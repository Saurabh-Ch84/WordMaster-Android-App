// react
import React, {useState, useEffect} from "react";
// native
import { View, Text, StyleSheet, TextInput, Pressable, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
// expo
import { useRouter } from 'expo-router';
// redux
import { useSelector, useDispatch } from "react-redux";
import { addScore } from "../../src/redux/gameSlice";
// logic
import { getRandomWord, saveUserData } from "../../src/logic/GameManager";
import { shuffleWord } from '../../src/logic/generators/ScrambleLogic';
// sound 
import { playSound } from "../../src/logic/SoundManager";
// semantics
import Colors from "../../src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// components
import GameHeader from "../../src/components/GameHeader";
import GameResultModal from "../../src/components/GameResultModal";

export default function ScrambleGame(){
    // set-up router
    const router = useRouter();
    // redux
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.game.isDarkMode);
    const userName = useSelector((state) => state.game.userName);
    const currentScore = useSelector((state) => state.game.score);

    // Theme
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyle(theme);

    // Local-State
    const [targetWord, setTargetWord] = useState("");
    const [scrambledText, setScrambledText] = useState("");
    const [userInput, setUserInput] = useState("");
    const [hintUsed, setHintUsed] = useState(false);

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "", isWin: false });

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        setModalVisible(false);
        // get random fallback to apple
        const word = (getRandomWord() || "apple").toLowerCase();
        setTargetWord(word);
        setScrambledText(shuffleWord(word).toUpperCase());
        setUserInput("");
        setHintUsed(false);
    };

    const handleSubmit = () => {
        const cleanInput = userInput.trim().toLowerCase();
        
        if (cleanInput === targetWord) {
            playSound('win');
            const pointsEarned = hintUsed ? 1 : 3;
            
            dispatch(addScore(pointsEarned));
            saveUserData(userName, currentScore + pointsEarned, isDarkMode);

            setModalContent({
                title: "Correct!",
                message: `Earned ${pointsEarned} Points`,
                isWin: true
            });
            setModalVisible(true);
            Keyboard.dismiss();
        } else {
            playSound('loss');
            alert("Not quite! Try again."); 
            setUserInput("");
        }
    };

    const useHint = () => {
        if (hintUsed) return;
        playSound('click');
        setHintUsed(true);
        // Reveal first letter
        setUserInput(targetWord[0]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <GameHeader title="Word Scramble" theme={theme}>
                <View style={styles.scoreBadge}>
                    <FontAwesome name="star" size={16} color="#FFD700" />
                    <Text style={styles.scoreText} numberOfLines={1} adjustsFontSizeToFit>{currentScore}</Text>
                </View>
            </GameHeader>

            {/* 🛡️ FIX: KeyboardAvoidingView wraps the main content */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* 📜 FIX: ScrollView ensures content is reachable on small screens */}
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    
                    <View style={styles.gameArea}>
                        <Text style={styles.instruction} numberOfLines={1} adjustsFontSizeToFit>Unscramble the letters:</Text>
                        
                        {/* Scrambled Tiles */}
                        <View style={styles.tileContainer}>
                            {scrambledText.split('').map((char, index) => (
                                <View key={index} style={styles.tile}>
                                    <Text style={styles.tileText}>{char}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Input Field */}
                        <TextInput 
                            style={styles.input}
                            value={userInput}
                            onChangeText={setUserInput}
                            placeholder="Type answer..."
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false} // Disable suggestions
                            keyboardType="visible-password" // Android no-suggestions fix
                            onSubmitEditing={handleSubmit}
                        />

                        {/* Action Buttons */}
                        <View style={styles.actions}>
                            <Pressable 
                                style={[styles.btn, styles.hintBtn, hintUsed && styles.disabledBtn]} 
                                onPress={useHint}
                                disabled={hintUsed}
                            >
                                <FontAwesome name="lightbulb-o" size={20} color="white" />
                                <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>Hint (-2)</Text>
                            </Pressable>

                            <Pressable style={[styles.btn, styles.submitBtn]} onPress={handleSubmit}>
                                <FontAwesome name="check" size={20} color="white" />
                                <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>Submit</Text>
                            </Pressable>
                        </View>
                        
                        <Pressable onPress={() => { playSound('click'); startNewGame(); }} style={styles.skipBtn}>
                            <Text style={styles.skipText} numberOfLines={1} adjustsFontSizeToFit>Skip Word</Text>
                        </Pressable>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <GameResultModal 
                visible={modalVisible}
                title={modalContent.title}
                message={modalContent.message}
                isWin={modalContent.isWin}
                onPlayAgain={startNewGame}
                onQuit={() => router.back()}
                theme={theme}
            />
        </SafeAreaView>
    );
};

function getStyle(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: theme.card, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: theme.border },
        scoreText: { fontWeight: 'bold', color: theme.text },
        scrollContent: { flexGrow: 1, justifyContent: 'center' },
        gameArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
        instruction: { fontSize: 18, color: theme.text, marginBottom: 20, opacity: 0.8 },
        
        tileContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 },
        tile: { width: 50, height: 50, backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 2, borderColor: theme.tint, elevation: 3 },
        tileText: { fontSize: 28, fontWeight: 'bold', color: theme.text },

        input: { width: '80%', backgroundColor: theme.card, padding: 15, borderRadius: 12, fontSize: 20, color: theme.text, textAlign: 'center', borderWidth: 1, borderColor: theme.border, marginBottom: 30 },
        
        actions: { flexDirection: 'row', gap: 15, width: '100%', justifyContent: 'center' },
        btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
        hintBtn: { backgroundColor: '#FFA000' },
        submitBtn: { backgroundColor: '#4CAF50' },
        disabledBtn: { backgroundColor: '#ccc', opacity: 0.5 },
        btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

        skipBtn: { marginTop: 30, padding: 10 },
        skipText: { color: theme.text, opacity: 0.5, fontSize: 14, textDecorationLine: 'underline' }
    });
}