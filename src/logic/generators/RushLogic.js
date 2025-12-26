import { getRandomWord } from '../GameManager';

export const generateRushRound = () => {
    const word = (getRandomWord() || "apple").toLowerCase();
    // 50% Chance: Return Real Word
    if (Math.random() > 0.5) {
        return { word: word, isReal: true };
    }
    // 50% Chance: Return Fake Word by Mutation
    return { word: makeFake(word), isReal: false };
};

const makeFake = (word) => {
    const chars = word.split('');
    const mutationType = Math.floor(Math.random() * 3);
    // 1. Delete a letter (if long enough)
    if (mutationType === 0 && word.length > 3) {
        const idx = Math.floor(Math.random() * chars.length);
        chars.splice(idx, 1);
    }
    // 2. Duplicate a letter
    else if (mutationType === 1) {
        const idx = Math.floor(Math.random() * chars.length);
        chars.splice(idx, 0, chars[idx]);
    }
    // 3. Swap two letters (if long enough)
    else if (word.length > 1) {
        const idx = Math.floor(Math.random() * (chars.length - 1));
        [chars[idx], chars[idx+1]] = [chars[idx+1], chars[idx]];
    }
    // Fallback: If mutation failed, just add 'z' to end
    return chars.join('');
};