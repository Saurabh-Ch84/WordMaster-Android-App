import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addScore } from "../../src/redux/gameSlice"; 
import { getRandomWord, saveUserData } from "../../src/logic/GameManager";
import { playSound } from "../../src/logic/SoundManager";
import Colors from "../../src/constants/Colors";
import GameHeader from "../../src/components/GameHeader";
import GameResultModal from "../../src/components/GameResultModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width, height } = Dimensions.get('window');

// SUB-COMPONENT: A single falling word
const FallingWord = React.memo(({ id, word, startX, speed, onMiss, onTap, theme }) => {
    const translateY = useRef(new Animated.Value(-100)).current; 
    const [isTapped, setIsTapped] = useState(false);

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: height + 100, 
            duration: speed,
            easing: Easing.linear,
            useNativeDriver: true, 
        }).start(({ finished }) => {
            if (finished && !isTapped) {
                setTimeout(() => onMiss(id), 0);
            }
        });
    }, []);

    const handlePress = () => {
        if (isTapped) return;
        setIsTapped(true);
        onTap(id);
    };

    if (isTapped) return null;

    return (
        <Animated.View 
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: startX, 
                transform: [{ translateY }],
                zIndex: 10
            }}
        >
            <Pressable onPressIn={handlePress} hitSlop={20}>
                <View style={{
                    backgroundColor: theme.card, // Dark Grey in DarkMode
                    borderColor: theme.tint,     // Blue/Yellow Border
                    borderWidth: 2,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 30,
                    elevation: 6,
                    shadowColor: theme.text,     // Shadow matches text color
                    shadowOffset: {width:0, height:4}, 
                    shadowOpacity: 0.3
                }}>
                    <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 20 }}>
                        {word}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
});

// MAIN GAME COMPONENT
export default function WordRain() {
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Redux Data
    const isDarkMode = useSelector((state) => state.game.isDarkMode);
    const userName = useSelector((state) => state.game.userName);
    const currentTotalScore = useSelector((state) => state.game.score);
    
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyle(theme);

    // Local State
    const [words, setWords] = useState([]);
    const [lives, setLives] = useState(3);
    const [localScore, setLocalScore] = useState(0); 
    
    const scoreRef = useRef(0);
    const livesRef = useRef(3); 
    const spawnRate = useRef(1000); 
    const fallSpeed = useRef(3000); 
    const spawnTimer = useRef(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [finalMessage, setFinalMessage] = useState("");

    useEffect(() => {
        startGame();
        return () => stopGame(); 
    }, []);

    const startGame = () => {
        setWords([]);
        setLocalScore(0);
        scoreRef.current = 0; 
        setLives(3);
        livesRef.current = 3;
        setModalVisible(false);
        
        spawnRate.current = 1000; 
        fallSpeed.current = 3000; 

        startSpawning();
    };

    const stopGame = () => {
        if (spawnTimer.current) clearInterval(spawnTimer.current);
    };

    const startSpawning = () => {
        if (spawnTimer.current) clearInterval(spawnTimer.current);
        spawnTimer.current = setInterval(() => {
            addWord();
        }, spawnRate.current);
    };

    const addWord = () => {
        const id = Date.now().toString() + Math.random().toString();
        const word = getRandomWord();
        const maxX = width - 180; 
        const randomX = Math.floor(Math.random() * maxX) + 20;

        setWords(prev => [
            ...prev, 
            { id, word, x: randomX, speed: fallSpeed.current }
        ]);
    };

    const handleTap = (id) => {
        playSound('click'); 
        scoreRef.current += 1;
        setLocalScore(scoreRef.current);

        if (scoreRef.current % 5 === 0) {
            spawnRate.current = Math.max(500, spawnRate.current - 100); 
            fallSpeed.current = Math.max(1500, fallSpeed.current - 200); 
            startSpawning(); 
        }

        setWords(prev => prev.filter(w => w.id !== id));
    };

    const handleMiss = (id) => {
        setWords(prev => prev.filter(w => w.id !== id));

        livesRef.current -= 1;
        setLives(livesRef.current);
        
        if (livesRef.current > 0) {
            playSound('error'); 
        } else {
            playSound('loss');
            gameOver();
        }
    };

    const gameOver = () => {
        stopGame();
        const finalSessionScore = scoreRef.current;

        if (finalSessionScore > 0) {
            const score=Math.max(5,finalSessionScore);
            dispatch(addScore(score));
            saveUserData(userName, currentTotalScore + score, isDarkMode);
        }

        setFinalMessage(`You caught ${finalSessionScore} words!`);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <GameHeader title="Word Rain" theme={theme} hideQuit={true}>
                 <View style={styles.statBox}>
                    <FontAwesome name="heart" size={16} color="#FF5252" />
                    <Text style={styles.statText}>{lives}</Text>
                </View>
            </GameHeader>

            <View style={styles.gameArea}>
                {/* INCREASED VISIBILITY HERE */}
                <Text style={styles.scoreLabel}>{localScore}</Text>
                
                {words.map(w => (
                    <FallingWord 
                        key={w.id}
                        id={w.id}
                        word={w.word}
                        startX={w.x}
                        speed={w.speed}
                        onTap={handleTap}
                        onMiss={handleMiss}
                        theme={theme}
                    />
                ))}
            </View>

            <GameResultModal 
                visible={modalVisible}
                title="Storm Over!"
                message={finalMessage}
                isWin={localScore > 10}
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
        statBox: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: theme.card, padding: 6, borderRadius: 10 },
        statText: { fontWeight: 'bold', fontSize: 16, color: theme.text },

        gameArea: { flex: 1, position: 'relative', overflow: 'hidden' }, 
        scoreLabel: { 
            position: 'absolute', top: 50, width: '100%', 
            textAlign: 'center', fontSize: 100, fontWeight: '900', 
            color: theme.text, opacity: 0.2, zIndex: -1 
        },
    });
}