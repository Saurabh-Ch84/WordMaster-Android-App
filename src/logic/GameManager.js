import AsyncStorage from '@react-native-async-storage/async-storage';
import Trie from './Trie';
import {playSound} from './SoundManager';

// Use a unique key to save your data
import { STORAGE_KEY, USER_KEY } from '../constants/Keys';

// Single Source of Truth
const globalTrie = new Trie();

import {DEFAULT_WORDS} from '../data/wordList';

// ---PERSISTENCE (Save & Load) ---

// Trie-Save Logic: Trie -> Array -> JSON String -> Disk
export const saveDictionary = async () => {
    try {
        // Optimization: Get words as a simple array ["apple", "banana"]
        const allWords = globalTrie.getAllWords();
        
        // Stringify is fast for arrays
        const jsonString = JSON.stringify(allWords);
        
        await AsyncStorage.setItem(STORAGE_KEY, jsonString);
        console.log(`Saved ${allWords.length} words to disk.`);
    } catch (e) {
        console.error("Failed to save dictionary", e);
    }
};

// Trie-Load Logic: Disk -> JSON String -> Array -> Trie
export const loadDictionary = async () => {
    try {
        const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (jsonString) {
            const words = JSON.parse(jsonString);
            
            if (Array.isArray(words)) {
                // Rebuild the Trie from scratch using the saved list
                globalTrie.fromArray(words);
                console.log(`Loaded ${words.length} words into memory.`);
                return true; 
            }
        }
    } catch (e) {
        console.error("Failed to load dictionary", e);
    }
    return false; // First time user
};

// save User data logic
export const saveUserData= async (userName, score, isDarkMode)=>{
    try {
        // make sure score is always an integer
        const cleanScore=Math.floor(score);
        const data={
            userName: userName,
            score: cleanScore,
            isDarkMode: isDarkMode
        };
        await AsyncStorage.setItem(USER_KEY,JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save User Profile!",e);
    }
}
// load User data logic
export const loadUserData=async()=>{
    try {
        const jsonString=await AsyncStorage.getItem(USER_KEY);
        if(jsonString){
            return JSON.parse(jsonString);
        }
    } catch (e) {
        console.error("Failed to load User Profile!",e);
    }
}

// --- ACTION WRAPPERS (Auto-Save) ---

// Add Words + Auto Save
export const addWordsToDictionary = (textInput) => {
    if (!textInput) return 0;
    // Clean text: keep only letters and spaces
    const cleanText = textInput.toLowerCase().replace(/[^a-z\s]/g, ''); 
    const words = cleanText.split(/\s+/); 
    let count = 0;
    words.forEach(word => {
        if (word.length > 0) {
            globalTrie.insert(word);
            count++;
        }
    });
    // Trigger Save immediately
    if (count > 0) {
        saveDictionary();
        playSound('success');
    }
    return count;
};

// Delete Word + Auto Save
export const deleteWordFromDictionary = (word) => {
    const success = globalTrie.remove(word);
    //Trigger Save if something actually changed
    if (success){
        saveDictionary();
        playSound('loss');
    }
    return success;
};

// Reset + Auto Save
export const resetDictionary = () => {
    globalTrie.clear();
    saveDictionary(); // Saves an empty list []
    playSound('error');
};

// --- GETTERS (Read Only) ---
export const getDictionarySize = () => {
  return globalTrie.getCount();
};

// --- Hangman Word Picker ---
export const getRandomWord=()=>{
    const userWords=globalTrie.getAllWords();
    const combinedSet= new Set(
        [
            ...DEFAULT_WORDS,
            ...userWords
        ]
    );
    const allWords=Array.from(combinedSet);
    if (allWords.length === 0) return "apple";
    const randomIndex=Math.floor(Math.random()*allWords.length);
    return allWords[randomIndex];
}

export default globalTrie;