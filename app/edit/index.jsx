import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import Colors from "../../src/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { playSound } from "@/src/logic/SoundManager";

export default function InsertMenu() {
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
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            Dictionary Ops
          </Text>
          <Text style={styles.subtitle}>
            Manage your local word database.
          </Text>
        </View>

        <View style={styles.buttonList}>
          {/* 1. INSERT (Teal Theme) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardInsert,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            onPress={() => {router.push("/edit/manual"); playSound('tap');}}
          >
            <View style={[styles.iconCircle, styles.iconInsert]}>
              <MaterialIcons name="keyboard" size={28} color="#0D9488" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Insert Words</Text>
              <Text style={styles.cardSubtitle}>Type, Speak or Paste</Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#0D9488" />
          </Pressable>

          {/* 2. DELETE (Coral Red Theme) */}
          <Pressable
            style={({ pressed }) => [
              styles.card,
              styles.cardDelete,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            onPress={() => {router.push("/edit/delete"); playSound('tap');}}
          >
            <View style={[styles.iconCircle, styles.iconDelete]}>
              <MaterialIcons name="delete-sweep" size={28} color="#E11D48" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Delete Words</Text>
              <Text style={styles.cardSubtitle}>Remove from dictionary</Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#E11D48" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStyle(theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    scrollContainer: { flexGrow: 1, padding: 20 },
    
    header: { marginTop: 10, marginBottom: 30 },
    title: { fontSize: 30, fontWeight: "800", color: theme.text, marginBottom: 5 },
    subtitle: { fontSize: 16, color: theme.text, opacity: 0.6 },

    buttonList: { gap: 16 },

    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 20,
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

    iconCircle: {
      width: 52, height: 52, borderRadius: 16,
      justifyContent: "center", alignItems: "center",
      marginRight: 16,
    },
    cardTextContainer: { flex: 1, justifyContent: "center" },
    cardTitle: { fontSize: 19, fontWeight: "800", color: "#1F2937" },
    cardSubtitle: { fontSize: 14, color: "#4B5563", marginTop: 2, fontWeight: "500" },

    // --- THEMES ---
    
    // Insert (Teal/Green)
    cardInsert: { 
        backgroundColor: "#F0FDFA", // Minty White
        borderColor: "#5EEAD4",     // Bright Teal Border
        borderBottomColor: "#2DD4BF" // Darker Bottom for 3D effect
    },
    iconInsert: { backgroundColor: "#CCFBF1" },

    // Delete (Rose/Coral)
    cardDelete: { 
        backgroundColor: "#FFF1F2", // Rose White
        borderColor: "#FDA4AF",     // Pink Border
        borderBottomColor: "#FB7185" // Darker Pink Bottom
    },
    iconDelete: { backgroundColor: "#FFE4E6" },
  });
}