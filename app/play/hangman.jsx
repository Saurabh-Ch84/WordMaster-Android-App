// react
import React, {useState, useEffect} from 'react';
// native
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// expo
import { useRouter } from 'expo-router';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { addScore } from '../../src/redux/gameSlice';
// logic
import { getRandomWord, getDictionarySize, saveUserData } from '../../src/logic/GameManager';
// semantics
import Colors from '../../src/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// component
import GameHeader from '../../src/components/GameHeader';
import GameResultModal from '../../src/components/GameResultModal';
// sound
import { playSound } from '../../src/logic/SoundManager';

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Hangman(){
  // set-up router
  const router = useRouter();
  // dispatch
  const dispatch = useDispatch();
  // Redux
  const isDarkMode = useSelector((state) => state.game.isDarkMode);
  const userName = useSelector((state) => state.game.userName);
  const currentTotalScore = useSelector((state) => state.game.score);
  // Theme
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const styles = getStyle(theme);
  // Local State
  const [targetWord, setTargetWord]=useState("");
  const [guessedLetters, setGuessedLetters]=useState(new Set());
  const [lives, setLives]=useState(6);
  const [gameStatus, setGameStatus]=useState("playing");
  const [modalVisible, setModalVisible]=useState(false);
  const [modalContent, setModalContent]=useState({title:'',message:'',isWin: false})

  useEffect(()=>{
    startNewGame()    ;
  },[]);

  const startNewGame = () => {
    setModalVisible(false);
    // 1. Pick a random word
    const rawWord = getRandomWord();
    const word = (rawWord || "apple").toLowerCase(); // Safety check
    setTargetWord(word);

    // 2. Smart Reveal Logic (Show ~1/3 of distinct letters)
    const uniqueChars = Array.from(new Set(word.split(''))); // Get unique letters
    const revealCount = Math.max(1, Math.floor(uniqueChars.length / 3)); // Ensure at least 1 hint
    
    const initialRevealed = new Set();
    // Randomly pick letters to reveal
    while (initialRevealed.size < revealCount) {
        const randomIndex = Math.floor(Math.random() * uniqueChars.length);
        initialRevealed.add(uniqueChars[randomIndex]);
    }

    setGuessedLetters(initialRevealed); // Start game with these letters "pressed"
    // Reset Lives & Status
    setLives(6);
    setGameStatus("playing");
  };

  const handlePress=(letter)=>{
    if(gameStatus!=='playing' || guessedLetters.has(letter)) return ;
    const newGuessed=new Set(guessedLetters);
    newGuessed.add(letter);
    playSound('tap');
    setGuessedLetters(newGuessed);
    if(!targetWord.includes(letter)){
      const newLives=lives-1;
      setLives(newLives);
      if(newLives===0) endGame("lost");
    }
    else{
      const isWon=targetWord.split('').every(char=>newGuessed.has(char));
      if(isWon) endGame("won",lives);
    }
  };

  const endGame=(result, finalLives)=>{
    setGameStatus(result);

    let title="";
    let message="";
    let isWin=false;

    if(result==="won"){
      isWin=true;
      const basePoints=finalLives;
      const dictSize=getDictionarySize();
      const multiplier=1+Math.floor(dictSize/100);
      const totalPoints=basePoints*multiplier;

      dispatch(addScore(totalPoints));
      saveUserData(userName,currentTotalScore+totalPoints,isDarkMode);
      title = "Victory!";
      message = `Earned: ${totalPoints} Points!`;
      playSound('success');
    }
    else{
      isWin=false;
      title="Game Over";
      message = `The word was: ${targetWord}`;
      playSound('loss');
    }
    setModalContent({title,message,isWin});
    setModalVisible(true);
  }

  const renderWord=()=>{
    return targetWord.split('').map((char, index)=>{
      const isGuessed=guessedLetters.has(char);
      return (
        <Text key={index} style={[styles.char, !isGuessed && gameStatus === 'lost' && styles.missedChar]}>
          {isGuessed || gameStatus==='lost'? char: '_'}
        </Text>
      )
    });
  }

  return (
    <SafeAreaView style={styles.container}>
            
            {/* Reusable Header Component with Quit Button */}
            <GameHeader title="Hangman" theme={theme}>
                <View style={styles.livesContainer}>
                    <FontAwesome name="heart" size={18} color="red" />
                    <Text style={styles.livesText} numberOfLines={1} adjustsFontSizeToFit>{lives}</Text>
                </View>
            </GameHeader>

            {/* Game Board */}
            <View style={styles.gameBoard}>
                <HangmanFigure lives={lives} theme={theme} />
                <View style={styles.wordContainer}>
                    {renderWord()}
                </View>
            </View>

            {/* Keyboard */}
            <View style={styles.keyboard}>
                {ALPHABET.map((letter) => {
                    const isUsed = guessedLetters.has(letter);
                    const isCorrect = targetWord.includes(letter);
                    return (
                        <Pressable
                            key={letter}
                            disabled={isUsed || gameStatus !== 'playing'}
                            onPress={() => handlePress(letter)}
                            style={[styles.key, isUsed && (isCorrect ? styles.keyCorrect : styles.keyWrong)]}
                        >
                            <Text style={[styles.keyText, isUsed && { color: 'white' }]} numberOfLines={1} adjustsFontSizeToFit>{letter}</Text>
                        </Pressable>
                    );
                })}
            </View>
            <GameResultModal
              visible={modalVisible}
              title={modalContent.title}
              message={modalContent.message}
              isWin={modalContent.isWin}
              onPlayAgain={startNewGame}
              onQuit={()=>router.back()}
              theme={theme}
            />
        </SafeAreaView>
  )
}

function HangmanFigure({ lives, theme }) {
    const color = theme.text;
    return (
        <View style={{ height: 120, width: 100, alignItems: 'center', marginBottom: 20 }}>
            <View style={{ position: 'absolute', top: 0, width: 80, height: 2, backgroundColor: color }} />
            <View style={{ position: 'absolute', top: 0, right: 20, width: 2, height: 20, backgroundColor: color }} />
            <View style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 120, backgroundColor: color }} />
            <View style={{ position: 'absolute', bottom: 0, left: -10, width: 40, height: 2, backgroundColor: color }} />
            {lives < 6 && <View style={{ position: 'absolute', top: 20, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: color }} />} 
            {lives < 5 && <View style={{ position: 'absolute', top: 44, width: 2, height: 35, backgroundColor: color }} />}
            {lives < 4 && <View style={{ position: 'absolute', top: 50, left: 25, width: 20, height: 2, backgroundColor: color, transform: [{ rotate: '-30deg' }] }} />}
            {lives < 3 && <View style={{ position: 'absolute', top: 50, right: 25, width: 20, height: 2, backgroundColor: color, transform: [{ rotate: '30deg' }] }} />}
            {lives < 2 && <View style={{ position: 'absolute', top: 75, left: 30, width: 20, height: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />}
            {lives < 1 && <View style={{ position: 'absolute', top: 75, right: 30, width: 20, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />}
        </View>
    );
}

function getStyle(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        
        // Header styles are now handled by GameHeader, 
        // specific styles for the "Lives" box inside the header
        livesContainer: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: theme.card, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.border },
        livesText: { fontSize: 16, fontWeight: 'bold', color: theme.text },

        // Board
        gameBoard: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        wordContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20, paddingHorizontal: 20 },
        char: { fontSize: 32, fontWeight: 'bold', color: theme.text, textTransform: 'uppercase', minWidth: 20, textAlign: 'center' },
        missedChar: { color: 'red' },

        // Keyboard
        keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10, gap: 6, marginBottom: 20 },
        key: { width: 34, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.card, borderRadius: 6, borderWidth: 1, borderColor: theme.border },
        keyText: { fontSize: 18, fontWeight: '600', color: theme.text },
        keyCorrect: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }, 
        keyWrong: { backgroundColor: '#E0E0E0', borderColor: '#BDBDBD', opacity: 0.3 } 
    });
}