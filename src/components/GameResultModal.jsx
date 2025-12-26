import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function GameResultModal({ 
  visible, 
  title, 
  message, 
  isWin, 
  onPlayAgain, 
  onQuit, 
  theme 
}) {
  const styles = getStyle(theme);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade" // makes it smooth
      onRequestClose={onQuit} // Android back button handle
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          {/* Icon Header */}
          <View style={styles.iconContainer}>
            {isWin ? (
              <FontAwesome name="trophy" size={50} color="#FFD700" />
            ) : (
              <MaterialIcons name="sentiment-very-dissatisfied" size={50} color="#FF5252" />
            )}
          </View>

          {/* Title & Message */}
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
          <Text style={styles.message} numberOfLines={2} adjustsFontSizeToFit>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {/* Quit Button */}
            <Pressable onPress={onQuit} style={[styles.btn, styles.btnQuit]}>
              <MaterialIcons name="close" size={20} color="white" />
              <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>Quit</Text>
            </Pressable>

            {/* Play Again Button */}
            <Pressable onPress={onPlayAgain} style={[styles.btn, styles.btnPlay]}>
              <MaterialIcons name="refresh" size={20} color="white" />
              <Text style={styles.btnText} numberOfLines={1} adjustsFontSizeToFit>Play Again</Text>
            </Pressable>
            
          </View>

        </View>
      </View>
    </Modal>
  );
}

function getStyle(theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)', // Dim background
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '85%',
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      // Shadow for iOS/Android
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 10, 
    },
    iconContainer: {
      marginBottom: 15,
      padding: 15,
      backgroundColor: theme.card,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.border,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 25,
      lineHeight: 24,
      opacity: 0.8,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 15,
      width: '100%',
      justifyContent: 'center',
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      gap: 5,
      minWidth: 120,
      justifyContent: 'center',
    },
    btnQuit: {
      backgroundColor: '#FF5252',
    },
    btnPlay: {
      backgroundColor: '#4CAF50',
    },
    btnText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    }
  });
}