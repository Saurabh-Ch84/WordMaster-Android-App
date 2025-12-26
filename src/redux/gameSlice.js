import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userName:'',
    score: 0,
    currentWord: "",
    gameMode: "Listen",
    history: [],
    isDarkMode: false,
}

const gameSlice=createSlice({
    name: 'game',
    initialState,
    reducers:{
        setUserName:(state,action)=>{
            state.userName=action.payload;
        },
        setScore: (state,action)=>{
            state.score=action.payload;
        },
        addScore: (state,action)=>{
            state.score+=action.payload;
        },
        setCurrentWord: (state,action)=>{
            state.currentWord=action.payload;
        },
        addToHistory:(state,action)=>{
            state.history.push(action.payload);
        }, 
        resetGame:(state)=>{
            state.score=0;
            state.currentWord='';
            state.history=[];
        },
        toggleTheme: (state)=>{
            state.isDarkMode=!state.isDarkMode;
        },
        restoreUser: (state,action)=>{
            if(action.payload.userName) state.userName=action.payload.userName;
            if(action.payload.score !==undefined) state.score=action.payload.score;
            if(action.payload.isDarkMode !==undefined) state.isDarkMode=action.payload.isDarkMode;
        }
    }
})

export const {setUserName, setScore, addScore, setCurrentWord, addToHistory, resetGame, toggleTheme, restoreUser}=gameSlice.actions;

export default gameSlice.reducer;