// react
import React,{useState, useEffect} from "react";
// native
import {View, Text, StyleSheet, TextInput, Pressable, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
// router
import { useRouter } from "expo-router";
// redux
import { useDispatch, useSelector } from "react-redux";
import { addScore } from "../../src/redux/gameSlice";
// logic
import { getRandomWord, saveUserData, getDictionarySize } from "../../src/logic/GameManager";
// sound
import { playSound } from "../../src/logic/SoundManager";
// semantics
import Colors from "../../src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// components
import GameHeader from "../../src/components/GameHeader";
import GameResultModal from "../../src/components/GameResultModal";
// speech-tech
import * as Speech from 'expo-speech';

export default function SpellBee(){
    // set-up router
    const router = useRouter();
    // dispatcher
    const dispatch=useDispatch();
    // redux
    const isDarkMode=useSelector((state)=>state.game.isDarkMode);
    const userName=useSelector((state)=>state.game.userName);
    const currentScore=useSelector((state)=>state.game.score);
    // theme
    const theme=isDarkMode? Colors.dark : Colors.light;
    const styles=getStyle(theme);
    // state
    const [targetWord, setTargetWord]=useState('');
    const [userInput, setUserInput]=useState('');
    const [isSpeaking, setIsSpeaking]=useState(false);
    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "", isWin: false });

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame=()=>{
        setModalVisible(false);
        const word=(getRandomWord() || "education").toLowerCase();
        setTargetWord(word);
        setUserInput('');
        // Speak immediately after a short delay
        setTimeout(() => speakWord(word), 500);
    }

    const speakWord=(word,rate=0.9)=>{
        if(isSpeaking) return;
        setIsSpeaking(true);
        Speech.speak(word,{
            language:'en-US',
            pitch: 1.0,
            rate: rate,
            onDone:()=>setIsSpeaking(false),
            onStopped:()=>setIsSpeaking(false),
        });
    }

    const handleSubmit=()=>{
        const cleanInput=userInput.trim().toLowerCase();
        if(cleanInput===targetWord){
            playSound('win');
            const multiplier=getDictionarySize()/100;
            let points=multiplier*(targetWord.length-10);
            const newPoints=Math.floor(Math.max(1,points));
            dispatch(addScore(newPoints));
            saveUserData(userName, currentScore+newPoints, isDarkMode);
            setModalContent({
                title: "Correct!",
                message: `Earned ${newPoints} point${newPoints>1?'s':''}`,
                isWin: true
            });
            setModalVisible(true);
            Keyboard.dismiss();
        }
        else{
            playSound('error');
            alert("Incorrect spelling. Listen again!");
            setUserInput("");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <GameHeader title="Spell Bee" theme={theme}>
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
                {/* 📜 FIX: ScrollView handles small screens when keyboard is open */}
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    
                    <View style={styles.gameArea}>
                        <Text style={styles.instruction} numberOfLines={2} adjustsFontSizeToFit>Listen and type the word:</Text>

                        {/* BIG SPEAKER BUTTON */}
                        <View style={styles.speakerContainer}>
                            <Pressable 
                                style={({pressed}) => [styles.speakerBtn, pressed && {transform: [{scale: 0.95}]}]}
                                onPress={() => speakWord(targetWord, 0.9)}
                                disabled={isSpeaking}
                            >
                                 <MaterialIcons name="volume-up" size={60} color="white" />
                                 <Text style={styles.speakText} adjustsFontSizeToFit numberOfLines={1}>{isSpeaking ? "Speaking..." : "Tap to Listen"}</Text>
                            </Pressable>

                            {/* SLOW MOTION BUTTON */}
                            <Pressable 
                                style={styles.slowBtn}
                                onPress={() => speakWord(targetWord, 0.5)}
                                disabled={isSpeaking}
                            >
                                <MaterialIcons name="speed" size={20} color={theme.text} />
                                <Text style={styles.slowText} numberOfLines={1} adjustsFontSizeToFit>Slow Mode</Text>
                            </Pressable>
                        </View>

                        {/* Input */}
                        <TextInput 
                            style={styles.input}
                            value={userInput}
                            onChangeText={setUserInput}
                            placeholder="Type word here..."
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="visible-password"
                            onSubmitEditing={handleSubmit}
                        />

                        {/* Submit */}
                        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                            <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>Check Spelling</Text>
                        </Pressable>

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
        instruction: { fontSize: 18, color: theme.text, marginBottom: 30, opacity: 0.8 },

        speakerContainer: { alignItems: 'center', marginBottom: 40, gap: 15 },
        speakerBtn: { 
            width: 140, height: 140, borderRadius: 70, 
            backgroundColor: '#FFB300', 
            justifyContent: 'center', alignItems: 'center',
            elevation: 10, shadowColor: '#FFB300', shadowOpacity: 0.4, shadowOffset: {width:0, height:5}
        },
        speakText: { color: 'white', fontWeight: 'bold', marginTop: 5 },
        
        slowBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border },
        slowText: { color: theme.text, fontSize: 12 },

        input: { width: '85%', backgroundColor: theme.card, padding: 15, borderRadius: 12, fontSize: 22, color: theme.text, textAlign: 'center', borderWidth: 1, borderColor: theme.border, marginBottom: 20 },

        submitBtn: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, width: '85%', alignItems: 'center' },
        btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },

        skipBtn: { marginTop: 30, padding: 10 },
        skipText: { color: theme.text, opacity: 0.5, fontSize: 14, textDecorationLine: 'underline' }
    });
}