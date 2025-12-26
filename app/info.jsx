import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, Pressable, Linking, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Colors from '../src/constants/Colors';
import { playSound } from '@/src/logic/SoundManager';

const GAME_MODES = [
    { title: "Hangman", icon: "user-secret", desc: "Guess the hidden word letter by letter before you run out of lives." },
    { title: "Word Scramble", icon: "random", desc: "Unscramble the jumbled letters to form a valid English word." },
    { title: "Word Rush", icon: "bolt", desc: "Speed logic! Decide if the word is inserted by you." },
    { title: "Spell Bee", icon: "microphone", desc: "Listen to the word spoken and type the correct spelling." },
    { title: "Word Rain", icon: "cloud", desc: "Tap the falling words before they hit the ground. Don't let them hit the ground!" },
];

const TOOLS = [
    { 
        title: "Dictionary Manager", 
        icon: "book", 
        desc: "Add your own custom words manually to expand the game's vocabulary." 
    },
    { 
        title: "Global Leaderboard", 
        icon: "trophy", 
        desc: "Compete with players worldwide and see if you can reach the top 100." 
    },
    { 
        title: "Rank Tracker", 
        icon: "line-chart", 
        desc: "Track your progress from Novice to Grandmaster as your score grows." 
    },
    { 
        title: "Theme Engine", 
        icon: "adjust", 
        desc: "Switch between Light and Dark modes for a comfortable visual experience." 
    },
];

export default function InfoPage() {
    const router = useRouter();
    const isDarkMode = useSelector((state) => state.game.isDarkMode);
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyle(theme);

    // Accordion State
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (index) => {
        playSound('tap');
        setExpandedSection(expandedSection === index ? null : index);
    };

    const openLink = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) Linking.openURL(url);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="arrow-left" size={24} color={theme.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Help & About</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* 🌟 APP LOGO HEADER */}
                <View style={styles.logoSection}>
                    <View style={styles.logoBox}>
                        <FontAwesome name="cube" size={50} color="white" />
                    </View>
                    <Text style={styles.appName} numberOfLines={1} adjustsFontSizeToFit>WordMaster</Text>
                    <Text style={styles.version} numberOfLines={1} adjustsFontSizeToFit>Version 1.0.0</Text>
                </View>
                <View style={styles.logoSection}>
                    <Text style={{ textAlign: 'center', marginTop: 2, paddingHorizontal: 20, color: theme.text, opacity: 0.8, lineHeight: 22 }} numberOfLines={7} adjustsFontSizeToFit>
                            WordMaster is an all-in-one word game collection featuring 5 unique modes to challenge your vocabulary. Build your own dictionary learn, play, enjoy and score to get to the leaderboard.
                    </Text>
                </View>

                {/* 📘 MANUAL SECTION */}
                <Text style={styles.sectionTitle}>Game Modes</Text>
                {GAME_MODES.map((mode, index) => (
                    <Pressable 
                        key={index} 
                        style={styles.card} 
                        onPress={() => toggleSection(index)}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.row}>
                                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                    <FontAwesome name={mode.icon} size={20} color="#2196F3" />
                                </View>
                                <Text style={styles.cardTitle}>{mode.title}</Text>
                            </View>
                            <FontAwesome 
                                name={expandedSection === index ? "chevron-up" : "chevron-down"} 
                                size={16} 
                                color={theme.text} 
                                style={{ opacity: 0.5 }}
                            />
                        </View>
                        {expandedSection === index && (
                            <View style={styles.cardBody}>
                                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.cardDesc}>{mode.desc}</Text>
                            </View>
                        )}
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Tools</Text>
                {TOOLS.map((tool, index) => (
                    <View key={index} style={styles.staticCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                            <FontAwesome name={tool.icon} size={20} color="#FF9800" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle} numberOfLines={2} adjustsFontSizeToFit>{tool.title}</Text>
                            <Text style={styles.staticDesc} numberOfLines={2} adjustsFontSizeToFit>{tool.desc}</Text>
                        </View>
                    </View>
                ))}

                {/* 📬 CONTACT ME SECTION */}
                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Contact Me</Text>
                    
                    <View style={styles.devCard}>
                        <Image 
                            // Placeholder avatar - Replace with your GitHub avatar URL if you want
                            source={require('../assets/images/icon1.png')} 
                            style={styles.avatar} 
                        />
                        <View>
                            <Text style={styles.devName} numberOfLines={1} adjustsFontSizeToFit>Saurabh Chowrasia</Text>
                            <Text style={styles.devRole} numberOfLines={1} adjustsFontSizeToFit>Developer</Text>
                        </View>
                    </View>

                    <Pressable 
                        style={[styles.socialBtn, { backgroundColor: '#24292e' }]}
                        onPress={() => openLink('https://github.com/Saurabh-Ch84')}
                    >
                        <FontAwesome name="github" size={24} color="white" />
                        <Text style={styles.socialText} numberOfLines={1} adjustsFontSizeToFit>View on GitHub</Text>
                    </Pressable>

                    <Pressable 
                        style={[styles.socialBtn, { backgroundColor: '#0077b5' }]}
                        onPress={() => openLink('https://www.linkedin.com/in/saurabh-chowrasia-877275333/')}
                    >
                        <FontAwesome name="linkedin" size={24} color="white" />
                        <Text style={styles.socialText} numberOfLines={1} adjustsFontSizeToFit>Connect on LinkedIn</Text>
                    </Pressable>

                    <Text style={styles.footerText} numberOfLines={2} adjustsFontSizeToFit>
                        Made with ❤️ using React Native, Expo and FireBase
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function getStyle(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: theme.border },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text },
        
        scrollContent: { padding: 20, paddingBottom: 50 },

        // Logo Header
        logoSection: { alignItems: 'center', marginBottom: 30 },
        logoBox: { width: 80, height: 80, backgroundColor: '#4CAF50', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 5 },
        appName: { fontSize: 28, fontWeight: 'bold', color: theme.text },
        version: { fontSize: 14, color: theme.text, opacity: 0.6 },

        // Sections
        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 10, opacity: 0.8 },

        // Accordion Card
        card: { backgroundColor: theme.card, borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: theme.border },
        cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
        row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
        cardTitle: { fontSize: 16, fontWeight: 'bold', color: theme.text },
        cardBody: { padding: 15, paddingTop: 0, borderTopWidth: 1, borderTopColor: theme.border, marginTop: 5 },
        cardDesc: { color: theme.text, opacity: 0.7, lineHeight: 20, paddingTop: 10 },

        // Static Card (Tools)
        staticCard: { flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: theme.card, padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
        staticDesc: { color: theme.text, opacity: 0.6, fontSize: 13, marginTop: 4 },

        // Contact Section
        contactSection: { marginTop: 30, paddingTop: 30, borderTopWidth: 1, borderTopColor: theme.border },
        devCard: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
        avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee' },
        devName: { fontSize: 18, fontWeight: 'bold', color: theme.text },
        devRole: { color: theme.text, opacity: 0.6 },

        socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 15, borderRadius: 12, marginBottom: 10 },
        socialText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

        footerText: { textAlign: 'center', color: theme.text, opacity: 0.4, marginTop: 20, fontSize: 12 }
    });
}