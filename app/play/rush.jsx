// react
import React, { useState, useEffect, useRef } from 'react';
// native
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// expo
import { useRouter } from 'expo-router';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { addScore } from '../../src/redux/gameSlice';
// logic
import { saveUserData,getDictionarySize } from '../../src/logic/GameManager';
import { generateRushRound } from '../../src/logic/generators/RushLogic';
// sound
import { playSound } from '../../src/logic/SoundManager';
// semantics
import Colors from '../../src/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// components
import GameHeader from '../../src/components/GameHeader';
import GameResultModal from '../../src/components/GameResultModal';

export default function WordRush() {
    // set-up router and dispatcher
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Redux
    const isDarkMode = useSelector((state) => state.game.isDarkMode);
    const userName = useSelector((state) => state.game.userName);
    const currentScore = useSelector((state) => state.game.score);
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyle(theme);

    // Game State
    const [currentRound, setCurrentRound] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    
    // Use Ref to track lives in real-time inside the Timer Loop
    const livesRef = useRef(3); 
    
    // Timer Animation
    const timerAnim = useRef(new Animated.Value(1)).current;

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [finalMessage, setFinalMessage] = useState("");

    useEffect(() => {
        startGame();
        return () => {
            if (timerAnim) timerAnim.stopAnimation();
        };
    }, []);

    const startGame = () => {
        setScore(0);
        setLives(3);
        livesRef.current = 3; // Reset Ref
        setModalVisible(false);
        nextRound();
    };

    const nextRound = () => {
        // If we are dead, stop everything (Double safety check)
        if (livesRef.current <= 0) return;

        const roundData = generateRushRound();
        setCurrentRound(roundData);
        
        // Reset Timer
        timerAnim.setValue(1);
        Animated.timing(timerAnim, {
            toValue: 0,
            duration: 2000, 
            useNativeDriver: false
        }).start(({ finished }) => {
            // Only run timeout logic if the animation finished naturally
            // (i.e., wasn't stopped by the user clicking a button)
            if (finished) {
                handleTimeOut();
            }
        });
    };

    const handleChoice = (choice) => {
        // Stop Timer immediately (this triggers callback with finished=false)
        timerAnim.stopAnimation();

        const isCorrect = choice === currentRound.isReal;

        if (isCorrect) {
            playSound('success');
            setScore(prev => prev + 1);
            nextRound();
        } else {
            handleLifeLost();
        }
    };

    const handleTimeOut = () => {
        handleLifeLost();
    };

    const handleLifeLost = () => {
        playSound('loss');
        
        // 🛡️ FIX: Update Ref immediately and check IT
        livesRef.current -= 1;
        setLives(livesRef.current); // Sync visual state

        if (livesRef.current > 0) {
            nextRound();
        } else {
            gameOver();
        }
    };

    const gameOver = () => {
        // Stop any lingering animations
        timerAnim.stopAnimation();
        if (score > 0) {
            const size=getDictionarySize()/100;
            const score_=Math.min(size+score,5);
            dispatch(addScore(score_));
            saveUserData(userName, currentScore + score_, isDarkMode);
            setFinalMessage(`You scored ${score_} points!`);
        }
        else setFinalMessage(`You scored ${score} points!`);
        setModalVisible(true);
    };

    if (!currentRound) return null;

    return (
        <SafeAreaView style={styles.container}>
            <GameHeader title="Word Rush" theme={theme} hideQuit={true}>
                 <View style={styles.statBox}>
                    <FontAwesome name="heart" size={16} color="red" />
                    {/* Show State for UI */}
                    <Text style={styles.statText}>{lives}</Text>
                </View>
            </GameHeader>

            {/* Progress Bar */}
            <View style={styles.timerContainer}>
                <Animated.View style={[
                    styles.timerBar, 
                    { 
                        width: timerAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'] 
                        }),
                        backgroundColor: timerAnim.interpolate({
                            inputRange: [0, 0.3, 1],
                            outputRange: ['red', 'orange', '#4CAF50']
                        })
                    }
                ]} />
            </View>

            <View style={styles.gameArea}>
                <Text style={styles.label}>Is this real?</Text>
                
                <View style={styles.wordCard}>
                    <Text style={styles.wordText}>{currentRound.word}</Text>
                </View>

                <Text style={styles.scoreLabel}>Round Score: {score}</Text>

                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={[styles.btn, styles.btnFalse]} 
                        onPress={() => handleChoice(false)}
                    >
                        <FontAwesome name="times" size={32} color="white" />
                        <Text style={styles.btnText}>FAKE</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.btn, styles.btnTrue]} 
                        onPress={() => handleChoice(true)}
                    >
                        <FontAwesome name="check" size={32} color="white" />
                        <Text style={styles.btnText}>REAL</Text>
                    </Pressable>
                </View>
            </View>

            <GameResultModal 
                visible={modalVisible}
                title="Time's Up!"
                message={finalMessage}
                isWin={score > 5}
                onPlayAgain={startGame}
                onQuit={() => router.back()}
                theme={theme}
            />
        </SafeAreaView>
    );
}

function getStyle(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        statBox: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 5 },
        statText: { fontWeight: 'bold', fontSize: 16, color: theme.text },
        
        timerContainer: { height: 6, backgroundColor: theme.border, width: '100%' },
        timerBar: { height: '100%' },

        gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
        label: { fontSize: 18, color: theme.text, opacity: 0.6, marginBottom: 20 },
        
        wordCard: { 
            paddingVertical: 40, paddingHorizontal: 20, 
            width: '100%', alignItems: 'center', 
            backgroundColor: theme.card, borderRadius: 20,
            borderWidth: 1, borderColor: theme.border,
            marginBottom: 30, elevation: 5
        },
        wordText: { fontSize: 42, fontWeight: 'bold', color: theme.text, textTransform: 'capitalize' },
        
        scoreLabel: { fontSize: 20, fontWeight: 'bold', color: theme.tint, marginBottom: 40 },

        buttonContainer: { flexDirection: 'row', gap: 20, width: '100%', justifyContent: 'center' },
        btn: { 
            flex: 1, height: 120, borderRadius: 20, 
            justifyContent: 'center', alignItems: 'center', 
            gap: 10, elevation: 4 
        },
        btnFalse: { backgroundColor: '#FF5252' },
        btnTrue: { backgroundColor: '#4CAF50' },
        btnText: { color: 'white', fontSize: 24, fontWeight: '900', letterSpacing: 1 }
    });
}