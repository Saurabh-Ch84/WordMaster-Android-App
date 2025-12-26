// react
import React, { useState } from "react";
// native
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// redux
import { useSelector } from "react-redux";
// semantics
import Colors from "../../src/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// logic
import { addWordsToDictionary } from "../../src/logic/GameManager";

export default function ManualInsert() {
  // read-input
  const [text, setText] = useState("");

  // redux state
  const isDarkMode = useSelector((state) => state.game.isDarkMode);

  // Theme Logic
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const styles = getStyle(theme);

  const handleTextSave = () => {
    const count = addWordsToDictionary(text);
    if (count > 0) {
      Alert.alert(
        "Success",
        `Added ${count} word${count > 1 ? "s" : ""} to dictionary!`
      );
      setText("");
      Keyboard.dismiss();
    } else {
      Alert.alert("Oops", "No valid words found. Try typing letters only.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Instructions */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            Create
          </Text>
          <Text style={styles.subtitle} numberOfLines={2} adjustsFontSizeToFit>
            Type, Paste or Speak a sentence or word(s) separated by spaces.
          </Text>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type here to insert..."
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
            style={styles.input}
            multiline={true} // Allows multiple lines
            textAlignVertical="top" // Starts typing at top-left
          />
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleTextSave}
          style={({ pressed }) => [
            styles.saveBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <MaterialIcons name="save" size={24} color="#FFF" />
          <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>
            Add to Dictionary
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStyle(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 20,
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1, // Allows content to push boundaries
      padding: 20,
      paddingBottom: 50, // Extra padding at bottom for easy scrolling
    },
    // Header
    header: {
      marginBottom: 20,
      marginTop: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.7,
      lineHeight: 22,
    },

    // Input Box
    inputContainer: {
      marginBottom: 30,
    },
    input: {
      backgroundColor: theme.card,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 15,
      height: 200, // Makes it a big box
      fontSize: 16,
      elevation: 2, // Slight shadow on Android
    },

    // Save Button
    saveBtn: {
      backgroundColor: theme.tint === "#FFFFFF" ? "#333" : "#007AFF", // Adaptive Color
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 15,
      borderRadius: 12,
      gap: 10,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
    },
    btnText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
}
