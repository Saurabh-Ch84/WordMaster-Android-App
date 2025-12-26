import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { subscribeToLeaderboard } from '../src/logic/FirebaseManager';
import { auth } from '../src/config/firebaseConfig';
import { useSelector } from 'react-redux';
import Colors from '../src/constants/Colors';

export default function Leaderboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redux for Theme
  const isDarkMode = useSelector((state) => state.game.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const styles = getStyle(theme);

  useEffect(() => {
    // Connect to Firebase
    const unsubscribe = subscribeToLeaderboard((data) => {
      setUsers(data);
      setLoading(false);
    });
    // Clean up listener when leaving screen
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => {
    let rankColor = theme.text;
    let iconName = "star-o"; 
    
    // Check if this row belongs to the current user
    // We use the unique ID (uid) to be 100% sure
    const isMe = item.id === auth.currentUser?.uid;

    if (index === 0) { rankColor = "#FFD700"; iconName = "trophy"; }
    if (index === 1) { rankColor = "#C0C0C0"; iconName = "trophy"; }
    if (index === 2) { rankColor = "#CD7F32"; iconName = "trophy"; }

    return (
      <View style={[
          styles.card, 
          isMe && styles.myCard // 👈 Apply special style if it's Me
      ]}>
        <View style={styles.rankContainer}>
          <FontAwesome name={iconName} size={24} color={rankColor} />
          <Text style={[styles.rankText, { color: rankColor }]}>#{index + 1}</Text>
        </View>
        
        <View style={styles.infoContainer}>
            <Text style={[
                styles.nameText, 
                isMe && { color: theme.tint, fontWeight: '900' } // 👈 Make my name bold/colored
            ]} numberOfLines={1} adjustsFontSizeToFit>
                {item.name || "Anonymous"} 
                {isMe ? " (You)" : ""} {/* 👈 Add "(You)" tag */}
            </Text>
        </View>

        <Text style={[
            styles.scoreText,
            isMe && { fontSize: 22 } // 👈 Make my score slightly bigger
        ]} adjustsFontSizeToFit numberOfLines={1}>{item.score}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
           <MaterialIcons name="arrow-back-ios" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>Global Ranks</Text>
        <View style={{width: 24}} /> 
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.tint} style={{marginTop: 50}}/>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText} adjustsFontSizeToFit numberOfLines={2}>No scores yet. Be the first!</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

function getStyle(theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { padding: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.text },
    
    listContent: { padding: 20 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
    },

    myCard: {
      backgroundColor: theme.background, // Or a slightly different shade
      borderColor: theme.tint,           // Glow with the app's theme color
      borderWidth: 2,                    // Thicker border
      transform: [{ scale: 1.02 }],      // Make it pop out slightly
      shadowColor: theme.tint,
      shadowOpacity: 0.5,
      shadowRadius: 5,
    },

    rankContainer: { width: 50, alignItems: 'center', justifyContent: 'center' },
    rankText: { fontWeight: 'bold', fontSize: 14, marginTop: 2 },
    
    infoContainer: { flex: 1, paddingHorizontal: 15 },
    nameText: { color: theme.text, fontSize: 16, fontWeight: '600' },
    
    scoreText: { color: theme.tint, fontSize: 20, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: theme.text, marginTop: 50, opacity: 0.6 }
  });
}