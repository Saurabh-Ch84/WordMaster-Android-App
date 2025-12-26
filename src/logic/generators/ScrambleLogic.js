// Fisher-Yates Shuffle Algorithm
export const shuffleWord = (word) => {
    if (!word) return "";
    
    // Convert string to array
    const arr = word.split('');
    
    // Loop backwards
    for (let i = arr.length - 1; i > 0; i--) {
        // Pick a random index
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    const scrambled = arr.join('');

    // Edge Case: If shuffle result equals original word, shuffle again
    if (scrambled === word && word.length > 1) {
        return shuffleWord(word);
    }

    return scrambled;
};