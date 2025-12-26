import { Audio } from 'expo-av';

// 1. Map your sound names to the files
const soundMap = {
    click: require('../../assets/sounds/click.wav'),
    error: require('../../assets/sounds/error.wav'),
    loss: require('../../assets/sounds/loss.wav'),
    success: require('../../assets/sounds/success.wav'),
    tap: require('../../assets/sounds/tap.wav'),
    win: require('../../assets/sounds/win.wav'),
};

// 2. The Play Function
export const playSound = async (soundName) => {
    try {
        const source = soundMap[soundName];
        if (!source) {
            console.warn(`Sound "${soundName}" not found in map.`);
            return;
        }
        // Create and play the sound
        const { sound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: true }
        );
        // Cleanup: Unload the sound from memory when it finishes
        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                await sound.unloadAsync();
            }
        });

    } catch (error) {
        // Don't crash if sound fails, just log
        console.log("Error playing sound:", error);
    }
};