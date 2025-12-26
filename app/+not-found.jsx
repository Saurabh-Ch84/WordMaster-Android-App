import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icons & Theme
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../src/constants/Colors';

export default function NotFoundScreen() {
  // 1. Get Theme from Redux
  const isDarkMode = useSelector((state) => state.game.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;
  
  // 2. Generate Styles
  const styles = getStyle(theme);

  return (
    <>
      {/* Update the Header Title dynamically */}
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          
          {/* Icon */}
          <FontAwesome name="question-circle-o" size={100} color={theme.tint} />
          
          {/* Text */}
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>This screen doesn't exist.</Text>
          <Text style={styles.subtitle} numberOfLines={2} adjustsFontSizeToFit>
            It looks like you got lost in the dictionary.
          </Text>

          {/* Go Home Button */}
          <Link href="/" asChild>
            <Pressable style={({pressed}) => [
                styles.button, 
                { opacity: pressed ? 0.8 : 1 }
            ]}>
              <Text style={styles.buttonText} adjustsFontSizeToFit numberOfLines={1}>Go to Dashboard</Text>
            </Pressable>
          </Link>

        </View>
      </SafeAreaView>
    </>
  );
}

// --- STYLES ---
function getStyle(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 20,
    },
    subtitle: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.7,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: theme.tint === '#FFFFFF' ? '#333' : '#007AFF', // Adaptive Color
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      elevation: 5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}