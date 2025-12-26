class TrieNode{
    constructor(){
        this.children=new Map();
        this.isEndOfWord=false;
    }
};

class Trie{
    constructor(){
        this.root=new TrieNode();
        this.wordCount=0;
    }

    insert(word){
        if (!word || typeof word !== 'string') return;
        let currentNode=this.root;
        for(const char of word){
            if(!currentNode.children.has(char))
                currentNode.children.set(char,new TrieNode());
            currentNode=currentNode.children.get(char);
        }
        if(!currentNode.isEndOfWord){
            currentNode.isEndOfWord=true;
            this.wordCount++;
        }
    }

    search(word){
        if (!word || typeof word !== 'string') return false;
        let currentNode=this.root;
        for(const char of word){
            if(!currentNode.children.has(char))
                return false;
            currentNode=currentNode.children.get(char);
        }
        return currentNode.isEndOfWord;
    }

    startsWith(word){
        if (!word || typeof word !== 'string') return false;
        let currentNode=this.root;
        for(const char of word){
            if(!currentNode.children.has(char))
                return false;
            currentNode=currentNode.children.get(char);
        }
        return true;
    }

    getCount(){
        return this.wordCount;
    }

    remove(word) {
        if (!word) return false;
        const formattedWord = word.toLowerCase();
        let isDeleted = false;
        const removeHelper = (node, depth) => {
            // Base Case: We have reached the end of the word
            if (depth === formattedWord.length) {
                if (!node.isEndOfWord) return false; // Word didn't exist
                // Unmark the end of word
                node.isEndOfWord = false;
                this.wordCount--;
                isDeleted = true; //operation successful
                // If this node has no other children, we can delete it
                return node.children.size === 0;
            }
            const char = formattedWord[depth];
            const nextNode = node.children.get(char);
            // If path doesn't exist, word isn't in dictionary
            if (!nextNode) return false;
            // Recursive call: go deeper
            const shouldDeleteChild = removeHelper(nextNode, depth + 1);
            // Backtracking: If the child returned true, delete that reference
            if (shouldDeleteChild) {
                node.children.delete(char);
                // Return true if THIS node is also now empty and not a word itself
                return node.children.size === 0 && !node.isEndOfWord;
            }
            return false;
        };
        removeHelper(this.root, 0);
        return isDeleted;
    }

    clear() {
        this.root = new TrieNode();
        this.wordCount = 0;
        this.longestWordLength = 0;
    }

    getAllWords() {
        const words = [];
        // Helper function to crawl through every branch
        const search = (node, currentWord) => {
            // If we found a marked word, add it to our list
            if (node.isEndOfWord) {
                words.push(currentWord);
            }
            // Keep going deeper
            for (const [char, childNode] of node.children.entries()) {
                search(childNode, currentWord + char);
            }
        };
        search(this.root, "");
        return words;
    }

    // Rebuild Trie from a list
    fromArray(wordList) {
        this.clear();
        wordList.forEach(word => this.insert(word));
    }
};

export default Trie;