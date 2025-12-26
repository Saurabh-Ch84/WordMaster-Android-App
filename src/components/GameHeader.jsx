import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { playSound } from '../logic/SoundManager';

export default function GameHeader({ title, children, theme, hideQuit=false }) {
    const router = useRouter();

    const handleQuit = () => {
        playSound('tap');
        Alert.alert(
            "Quit Game?",
            "Your progress for this session will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Quit", 
                    style: "destructive", 
                    onPress: () => {
                                    router.back();
                                   } 
                }
            ]
        );
    };

    return (
        <View style={styles.header}>
            {/* 1. Quit Button (Only show if hideQuit is false) */}
            {!hideQuit ? (
                <Pressable onPress={handleQuit} style={styles.iconBtn}>
                    <MaterialIcons name="close" size={28} color={theme.text} />
                </Pressable>
            ) : (
                // Empty view to keep spacing if needed, or just nothing
                <View style={{ width: 28 }} /> 
            )}

            {/* 2. Title (Center) */}
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>

            {/* 3. Custom Game Stats (Right) - e.g. Lives, Timer */}
            <View style={styles.rightContainer}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        left: 0, 
        right: 0,
        textAlign: 'center',
        zIndex: -1
    },
    iconBtn: {
        padding: 5,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});