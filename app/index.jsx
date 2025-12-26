// react
import React, { useState, useEffect } from "react";
// native
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Alert,
  TextInput,
  Platform,
  ScrollView, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// expo
import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// redux
import { setUserName, resetGame, toggleTheme, restoreUser } from "../src/redux/gameSlice";
import { useSelector, useDispatch } from "react-redux";
// semantics
import Colors from "../src/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// logic
import {
  getDictionarySize,
  loadDictionary,
  loadUserData,
  saveUserData
} from "../src/logic/GameManager";
import { loginUserSilently } from "../src/logic/FirebaseManager";
import { useFocusEffect } from "expo-router";
import { saveScoreToCloud } from "../src/logic/FirebaseManager";
// sound 
import { playSound } from "../src/logic/SoundManager";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Read from Redux
  const userName = useSelector((state) => state.game.userName);
  const isDarkMode = useSelector((state) => state.game.isDarkMode);
  const score = useSelector((state) => state.game.score);

  // Local State
  const [dictSize, setDictSize] = useState(0);
  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [newName, setNewName] = useState(userName);

  // Theme Logic
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const styles = getStyle(theme);

  useEffect(() => {
    const initGame = async () => {
      console.log("Initializing App..");
      const dictionaryLoaded = await loadDictionary();
      if (dictionaryLoaded) {
        setDictSize(getDictionarySize());
      }
      const userData = await loadUserData();
      if (userData) {
        dispatch(restoreUser(userData));
      }
      await loginUserSilently();
    };
    initGame();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(isDarkMode ? "light" : "dark");
    }
  }, [isDarkMode]);

  useFocusEffect(
    React.useCallback(() => {
      setDictSize(getDictionarySize());
    }, [])
  );

  // Sync with Firebase
  useEffect(() => {
    if (userName && score > 0) {
      const timeout = setTimeout(() => {
        saveScoreToCloud(userName, score);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [userName, score]);

  const handleNameSave = () => {
    dispatch(setUserName(newName));
    saveUserData(newName, score, isDarkMode);
    setNameModalVisible(false);
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Game?",
      "This will delete your score and history, Sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            dispatch(resetGame());
            saveUserData(userName, 0, isDarkMode);
            playSound('loss');
          },
        },
      ]
    );
  };

  const handleThemeToggle = () => {
    playSound('tap');
    dispatch(toggleTheme());
    saveUserData(userName, score, !isDarkMode);
  }

  const getRank = (count) => {
    if (count < 100) return "Novice";
    if (count < 1000) return "Apprentice";
    if (count < 5000) return "Scholar";
    if (count < 8000) return "Library";
    return "Grandmaster";
  };

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* --- SECTION 1: HEADER & SCORE --- */}
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <View>
                <Text
                  style={styles.greetingText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Hi,{" "}
                  <Text style={{color: theme.tint}}>
                    {userName && userName.length > 10
                      ? userName.substring(0, 10) + ".."
                      : userName || "Word Master"}
                  </Text>
                </Text>
                <Pressable
                  onPress={() => setNameModalVisible(true)}
                  style={({ pressed }) => [
                    styles.editBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <FontAwesome name="edit" size={16} color={theme.secondaryText} />
                  <Text style={{ color: theme.secondaryText, marginLeft: 5, fontSize: 13, fontWeight:'600' }}>
                    Edit Name
                  </Text>
                </Pressable>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={handleThemeToggle}
                  style={({ pressed }) => [
                    styles.toggleButton,
                    { backgroundColor: pressed ? theme.border : theme.card },
                  ]}
                >
                  <FontAwesome
                    name={isDarkMode ? "sun-o" : "moon-o"}
                    size={20}
                    color={theme.text}
                  />
                </Pressable>

                <Pressable
                  onPress={() => {router.push("/info"); playSound('tap');}}
                  style={({ pressed }) => [
                    styles.toggleButton,
                    { backgroundColor: pressed ? theme.border : theme.card },
                  ]}
                >
                  <FontAwesome name="info-circle" size={20} color={theme.text} />
                </Pressable>
              </View>
            </View>

            {/* Score Card */}
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Current Score</Text>
              <Text style={styles.scoreValue} adjustsFontSizeToFit numberOfLines={1}>
                {score}
              </Text>
            </View>
          </View>

          {/* --- SECTION 2: MODES (Vibrant Cards) --- */}
          <View style={styles.modeContainer}>
            
            {/* MUTATE DICTIONARY (Cyan Theme) */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.cardMutate, // 👈 New Vibrant Style
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
              onPress={() => {router.push("/edit"); playSound('tap')}}
            >
              <View style={[styles.iconCircle, styles.iconMutate]}>
                <AntDesign name="build" size={28} color="#0891B2" />
              </View>
              <View style={{flex: 1}}>
                  <Text style={styles.cardTextTitle} numberOfLines={1} adjustsFontSizeToFit>Mutate Dictionary</Text>
                  <Text style={styles.cardTextSub} numberOfLines={1} adjustsFontSizeToFit>
                    Insert or Delete words
                  </Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#0891B2" />
            </Pressable>

            {/* PLAY GAMES (Violet Theme) */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.cardPlay, // 👈 New Vibrant Style
                { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
              ]}
              onPress={() => {router.push("/play"); playSound('tap');}}
            >
              <View style={[styles.iconCircle, styles.iconPlay]}>
                 <FontAwesome name="gamepad" size={28} color="#7C3AED" />
              </View>
              <View style={{flex: 1}}>
                  <Text style={styles.cardTextTitle}>Play Games</Text>
                  <Text style={styles.cardTextSub} numberOfLines={1} adjustsFontSizeToFit>
                    Test your skills & score
                  </Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="#7C3AED" />
            </Pressable>
          </View>

          {/* STATS BAR */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <FontAwesome name="book" size={20} color={theme.tint} />
              <Text style={styles.statLabel} numberOfLines={1}>Total Words</Text>
              <Text style={styles.statValue} numberOfLines={1}>{dictSize}</Text>
            </View>

            <View style={styles.verticalLine} />

              <View style={styles.statItem}>
                <MaterialCommunityIcons name="trophy-award" size={20} color="#F59E0B" />
                <Text style={styles.statLabel} numberOfLines={1}>Current Rank</Text>
                <Text style={styles.statValue} numberOfLines={1}>{getRank(dictSize)}</Text>
              </View>
          </View>

          {/* --- SECTION 3: FOOTER --- */}
          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() => router.push("/leaderBoard")}
            >
              <View style={styles.footerIconBg}>
                <FontAwesome name="trophy" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.footerText}>Leaderboard</Text>
            </Pressable>

            <Pressable style={styles.footerItem} onPress={handleReset}>
              <View style={[styles.footerIconBg, {backgroundColor: '#FEF2F2'}]}>
                <MaterialCommunityIcons name="database-refresh" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.footerText, { color: "#EF4444" }]}>Reset Score</Text>
            </Pressable>
          </View>

          {/* --- MODAL --- */}
          <Modal
            visible={isNameModalVisible}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Name</Text>

                <TextInput
                  style={styles.input}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Type name..."
                  placeholderTextColor="#999"
                />

                <View style={styles.modalButtons}>
                  <Pressable
                    onPress={() => setNameModalVisible(false)}
                    style={styles.modalBtn}
                  >
                    <Text style={{ color: "red", fontWeight:'600' }}>Cancel</Text>
                  </Pressable>

                  <Pressable onPress={handleNameSave} style={[styles.modalBtn, {backgroundColor: theme.tint, borderRadius: 8}]}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView> 
      </SafeAreaView>
    </>
  );
}

// --- STYLESHEET ---
function getStyle(theme) {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      paddingBottom: 40,
    },

    // Header Area
    headerContainer: { marginBottom: 25 },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 15,
    },
    greetingText: {
      fontSize: 26,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: -0.5,
    },
    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    toggleButton: {
      width: 44, height: 44,
      borderRadius: 22,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      marginLeft: 8,
    },

    // Score Widget
    scoreContainer: {
      backgroundColor: theme.card,
      paddingVertical: 20,
      borderRadius: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.gold, // Highlight border
      borderBottomWidth: 4,    // 3D effect
      
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
    },
    scoreLabel: {
      fontSize: 13,
      color: theme.secondaryText,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      fontWeight: "600",
      marginBottom: 5,
    },
    scoreValue: {
      fontSize: 42,
      fontWeight: "900",
      color: theme.tint,
      letterSpacing: -1,
    },

    // Mode Cards
    modeContainer: {
      marginBottom: 20,
      gap: 16,
    },
    
    // Base Card Style
    card: {
      flexDirection: 'row',
      padding: 20,
      borderRadius: 20,
      alignItems: "center",
      minHeight: 110,
      
      // 3D Pop Effect
      borderWidth: 1,
      borderBottomWidth: 4, 
      
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 3,
    },
    
    // --- VIBRANT THEMES ---
    // Mutate (Cyan/Teal)
    cardMutate: { 
        backgroundColor: "#ECFEFF", 
        borderColor: "#22D3EE", 
        borderBottomColor: "#0891B2" 
    },
    iconMutate: { backgroundColor: "#CFFAFE" },

    // Play (Violet/Purple)
    cardPlay: { 
        backgroundColor: "#F5F3FF", 
        borderColor: "#A78BFA", 
        borderBottomColor: "#7C3AED" 
    },
    iconPlay: { backgroundColor: "#EDE9FE" },

    // Content Styles
    iconCircle: {
        width: 52, height: 52, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 15,
    },
    cardTextTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#1F2937",
      marginBottom: 4,
    },
    cardTextSub: {
      fontSize: 14,
      color: "#4B5563",
      fontWeight: "500",
      maxWidth: "95%",
    },

    // Stats Section
    statsContainer: {
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: 16,
      paddingVertical: 18,
      marginTop: 5,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "space-evenly",
    },
    statItem: { alignItems: "center", gap: 6, flex: 1 },
    statLabel: {
      fontSize: 11,
      color: theme.secondaryText,
      textTransform: "uppercase",
      fontWeight: "700",
    },
    statValue: {
      fontSize: 17,
      fontWeight: "800",
      color: theme.text,
    },
    verticalLine: {
      width: 1,
      height: 40,
      backgroundColor: theme.border,
    },

    // Footer
    footer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 30,
      paddingTop: 10,
    },
    footerItem: {
      alignItems: "center",
      gap: 8,
      width: 100,
    },
    footerIconBg: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: theme.background,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: theme.border,
    },
    footerText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.text,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.card,
      width: "85%",
      padding: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      elevation: 10,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 20,
      color: theme.text,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 2,
      borderColor: theme.border,
      paddingHorizontal: 15,
      borderRadius: 12,
      marginBottom: 25,
      color: theme.text,
      backgroundColor: theme.background,
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: 'center',
    },
    modalBtn: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}