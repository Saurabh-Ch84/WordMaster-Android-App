// react
import React, {useState} from "react";
// native
import {View,Text,StyleSheet,Alert,Pressable,Keyboard, TextInput} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
// expo
import { useRouter } from "expo-router";
// redux
import { useSelector } from "react-redux";
// logic
import { deleteWordFromDictionary, resetDictionary } from "../../src/logic/GameManager";
// semantics
import Colors from '../../src/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DeleteScreen(){
    // set-up router
    const router=useRouter();
    // local-state
    const [text,setText]= useState('');
    // Read from redux
    const isDarkMode = useSelector((state) => state.game.isDarkMode);
    // theme logic
    const theme = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyle(theme);

    const handleDeleteOne=()=>{
        if(!text.trim()) return ;
        const response=deleteWordFromDictionary(text.trim().toLowerCase());
        if(response){
            Alert.alert("Success",`Deleted ${text} from dictionary.`);
            setText('');
            Keyboard.dismiss();
        }
        else{
            Alert.alert("Not Found",`${text} not found in dictionary.`);
        }
    }

    const handleDeleteAll=()=>{
        Alert.alert(
            "⚠️ DANGER-ZONE",
            "This will delete your ENTIRE dictionary. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "DELETE ALL",
                    style: "destructive",
                    onPress: () => {
                        resetDictionary();
                        Alert.alert("Wiped", "Your dictionary is now empty.");
                        router.back(); // Go back to home
                    }
                }
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                
                {/* Header with Back Button */}
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>Manage Dictionary</Text>
                </View>

                {/* --- SECTION 1: DELETE ONE WORD --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>Remove a Word</Text>
                    <Text style={styles.subtitle} numberOfLines={2} adjustsFontSizeToFit>Typo? Remove a specific word here.</Text>
                    
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            placeholder="e.g. apple"
                            placeholderTextColor="#999"
                        />
                        <Pressable 
                            style={({pressed}) => [styles.iconBtn, {opacity: pressed ? 0.5 : 1}]}
                            onPress={handleDeleteOne}
                        >
                            <MaterialIcons name="delete" size={24} color="#FFF" />
                        </Pressable> 
                    </View>
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* --- SECTION 2: DELETE ALL --- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, {color: 'red'}]} numberOfLines={1} adjustsFontSizeToFit>Danger Zone</Text>
                    <Text style={styles.subtitle} numberOfLines={2} adjustsFontSizeToFit>Delete all words and start fresh.</Text>
                    
                    <Pressable 
                        style={({pressed}) => [styles.dangerBtn, {opacity: pressed ? 0.8 : 1}]} 
                        onPress={handleDeleteAll}
                    >
                        <FontAwesome name="trash-o" size={24} color="white" />
                        <Text style={styles.dangerBtnText} numberOfLines={1} adjustsFontSizeToFit>RESET DICTIONARY</Text>
                    </Pressable>
                </View>

            </View>
        </SafeAreaView>
    )
}

function getStyle(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: 20 },
        
        // Header
        headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
        backBtn: { padding: 5, marginRight: 15 },
        title: { fontSize: 24, fontWeight: 'bold', color: theme.text },

        // Sections
        section: { marginBottom: 20 },
        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 5 },
        subtitle: { fontSize: 14, color: theme.text, opacity: 0.6, marginBottom: 15 },
        divider: { height: 1, backgroundColor: theme.border, marginVertical: 20, opacity: 0.5 },

        // Input Area
        inputRow: { flexDirection: 'row', gap: 10 },
        input: {
            flex: 1,
            backgroundColor: theme.card,
            color: theme.text,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            padding: 15,
            fontSize: 16,
        },
        iconBtn: {
            backgroundColor: '#FF9800', // Orange for specific delete
            justifyContent: 'center',
            alignItems: 'center',
            width: 55,
            borderRadius: 10,
        },

        // Danger Button
        dangerBtn: {
            backgroundColor: '#D32F2F', // Red for danger
            padding: 18,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        dangerBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
    });
}