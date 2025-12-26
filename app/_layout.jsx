import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Stack>
          {/* Main Dashboard */}
          <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="leaderBoard" options={{ title: "LeaderBoard", headerShown: false }} />
          <Stack.Screen name="info" options={{ title: "Info And About", headerShown: false }} />
          
          {/* INSERT Section */}
          <Stack.Screen name="edit/index" options={{ title: "Mutate Dictionary", headerShown:false }} />
          <Stack.Screen name="edit/manual" options={{ title: "Manual or Voice Entry" ,headerShown:false}} />
          <Stack.Screen name="edit/delete" options={{ title: "Trim Dictionary", headerShown: false  }} />

          {/* PLAY Section */}
          <Stack.Screen name="play/index" options={{ title: "Game Menu",headerShown:false }} />
          <Stack.Screen name="play/hangman" options={{ title: "Guess the Word", headerShown: false}} />
          <Stack.Screen name="play/scramble" options={{ title: "Construct the Word",headerShown:false }} />
          <Stack.Screen name="play/rush" options={{ title: "Identify the Word",headerShown: false }} />
          <Stack.Screen name="play/spellbee" options={{ title: "Spell the Word",headerShown: false }} />
          <Stack.Screen name="play/rain" options={{ title: "Tap the Word",headerShown: false }} />
          
          {/* 404 Page */}
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </Provider>
    </SafeAreaProvider>
  )
}