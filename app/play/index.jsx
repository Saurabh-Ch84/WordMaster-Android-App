// react
import React from 'react';
// native
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
// expo
import { useRouter } from "expo-router";
// redux
import { useSelector } from 'react-redux';
// semantics
import Colors from '@/src/constants/Colors';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// sound
import { playSound } from '@/src/logic/SoundManager';

export default function PlayMenu(){
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.game.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const styles = getStyle(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            Game Zone
          </Text>
          <Text style={styles.subtitle}>
            Pick a challenge and start scoring!
          </Text>
        </View>

        {/* Game List */}
        <View style={styles.list}>

          {/* GAME 1: HANGMAN (Theme: Emerald Green) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardHangman, // 👈 Specific Style
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => {
              router.push("/play/hangman");
              playSound('tap');
            }}
          >
            <View style={[styles.iconCircle, styles.iconHangman]}>
               <MaterialIcons name="man-3" size={28} color="#047857" />
            </View>
            <View style={styles.cardTextContainer}>
               <Text style={styles.cardTitle}>Hangman</Text>
               <Text style={styles.cardSubtitle}>Guess the word</Text>
            </View>
            <FontAwesome name="play-circle" size={36} color="#047857" />
          </Pressable>

          {/* GAME 2: SCRAMBLE (Theme: Violet/Purple) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardScramble,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => {
              router.push("/play/scramble");
              playSound('tap');
            }}
          >
            <View style={[styles.iconCircle, styles.iconScramble]}>
               <MaterialCommunityIcons name="sort-alphabetical-variant" size={28} color="#6D28D9" />
            </View>
            <View style={styles.cardTextContainer}>
               <Text style={styles.cardTitle}>Word Scramble</Text>
               <Text style={styles.cardSubtitle}>Construct the word</Text>
            </View>
            <FontAwesome name="play-circle" size={36} color="#6D28D9" />
          </Pressable>

          {/* GAME 3: RUSH (Theme: Rose Red) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardRush,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => {
              router.push("/play/rush")
              playSound('tap');
            }}
          >
            <View style={[styles.iconCircle, styles.iconRush]}>
              <MaterialCommunityIcons name="timer-sand" size={28} color="#BE123C" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Word Rush</Text>
              <Text style={styles.cardSubtitle}>Identify the word</Text>
            </View>
            <FontAwesome name="play-circle" size={36} color="#BE123C" />
          </Pressable>

          {/* GAME 4: SPELL BEE (Theme: Amber/Gold) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardBee,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => {
              router.push("/play/spellbee");
              playSound('tap');
            }}
          >
            <View style={[styles.iconCircle, styles.iconBee]}>
              <MaterialCommunityIcons name="bee-flower" size={28} color='#B45309' />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Spell Bee</Text>
              <Text style={styles.cardSubtitle}>Listen & Type</Text>
            </View>
            <FontAwesome name="play-circle" size={36} color="#B45309" />
          </Pressable>

          {/* GAME 5: RAIN (Theme: Sky Blue) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardRain, 
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }], marginBottom: 20 }
            ]}
            onPress={() => {
              router.push("/play/rain");
              playSound('tap');
            }}
          >
            <View style={[styles.iconCircle, styles.iconRain]}>
              <MaterialCommunityIcons name="weather-pouring" size={28} color="#0369A1" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Word Rain</Text>
              <Text style={styles.cardSubtitle}>Tap the word</Text>
            </View>
            <FontAwesome name="play-circle" size={36} color="#0369A1" />
          </Pressable>
        </View>
      </ScrollView>
     </SafeAreaView> 
  );
}

function getStyle(theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    
    scrollContainer: { 
      flexGrow: 1, 
      padding: 20,
      paddingBottom: 50 
    },
    
    // Header
    header: { marginTop: 10, marginBottom: 25 },
    title: { fontSize: 34, fontWeight: '900', color: theme.text, marginBottom: 5, letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: theme.text, opacity: 0.6, fontWeight: '500' },

    // List Layout
    list: { gap: 16 },

    // CORE CARD STYLE (Shared)
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 22,
      paddingHorizontal: 20,
      borderRadius: 24, // Rounder corners look more modern
      minHeight: 110,
      
      // Shadows for depth
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1, // Subtle border makes colors pop
    },
    
    // CONTENT STYLES
    iconCircle: {
      width: 56, height: 56, borderRadius: 18, // Squircle shape
      justifyContent: 'center', alignItems: 'center',
      marginRight: 16,
    },
    cardTextContainer: { flex: 1, justifyContent: 'center' },
    // Title is darker for contrast
    cardTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 2 },
    // Subtitle is slightly colored to match the theme (optional, but looks good as grey)
    cardSubtitle: { fontSize: 14, color: '#4B5563', fontWeight: '500' },

    // --- VIBRANT COLOR THEMES ---
    
    // 1. Emerald (Hangman)
    cardHangman: { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' },
    iconHangman: { backgroundColor: '#D1FAE5' },

    // 2. Violet (Scramble)
    cardScramble: { backgroundColor: '#F5F3FF', borderColor: '#A78BFA' },
    iconScramble: { backgroundColor: '#EDE9FE' },

    // 3. Rose (Rush)
    cardRush: { backgroundColor: '#FFF1F2', borderColor: '#FDA4AF' },
    iconRush: { backgroundColor: '#FFE4E6' },

    // 4. Amber (Bee)
    cardBee: { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' },
    iconBee: { backgroundColor: '#FEF3C7' },

    // 5. Sky (Rain)
    cardRain: { backgroundColor: '#F0F9FF', borderColor: '#7DD3FC' },
    iconRain: { backgroundColor: '#E0F2FE' },
  });
};