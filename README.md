#  Word Master

> **Challenge yourself, expand your vocabulary, and compete with friends!**

**Word Master** is a comprehensive word game suite built with **React Native** and **Expo**. It features 5 distinct game modes, a real-time cloud leaderboard, and a fully customizable local dictionary manager.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-green.svg)
![Tech](https://img.shields.io/badge/tech-React%20Native%20%7C%20Redux%20%7C%20Firebase-orange.svg)

---

## Download the App

Get the latest Android APK from the **Releases** page:

👉 **[Download WordMaster v1.0.0](https://github.com/Saurabh-Ch84/WordMaster-Android-App/releases/download/v1.0.0/application-47fdeafb-47e8-4802-8d68-a4b22c413979.apk)**

## Web Version:

Don't want to install no worries:

**(https://word-master-app-web-version.vercel.app/)**

---

## Features

### 🕹️ 5 Unique Game Modes
Each game mode features a distinct color identity and unique mechanics:
* **🟢 Hangman (Emerald):** The classic guessing game. Save the stickman before it's too late!
* **🟣 Word Scramble (Violet):** Unjumble the shuffled letters to reconstruct the hidden word.
* **🔴 Word Rush (Rose):** A race against time! Identify words quickly before the 1-second timer runs out.
* **🟡 Spell Bee (Amber):** Listen to the word (using Text-to-Speech) and type the correct spelling.
* **🔵 Word Rain (Sky Blue):** A physics-based challenge. Tap the falling words before they hit the floor!

### 🏆 Cloud Leaderboard
* **Real-Time Sync:** Powered by **Firebase Realtime Database**.
* **Live Rankings:** See your rank update instantly as you play.
* **Anonymous Login:** No signup required—start playing immediately.
* **"You" Highlight:** Your score is specially highlighted with a gold border.

### ⚙️ Dictionary Manager
* **Mutate Dictionary:** You are in control! Add new words or delete existing ones from the game's database.
* **Local Persistence:** Your custom words are saved locally on your device.

### 🎨 Design & Accessibility
* **Dark/Light Mode:** Full theme support that respects system settings or manual toggle.
* **Vibrant UI:** Custom "3D Pop" card designs with tactile feedback.
* **Responsive:** optimized for various screen sizes (Mobile & Web).

---

## 🛠️ Tech Stack

* **Core:** React Native, Expo (Managed Workflow)
* **Navigation:** Expo Router (File-based routing)
* **State Management:** Redux Toolkit (Persisted with AsyncStorage)
* **Backend:** Firebase Realtime Database & Authentication
* **Audio/Speech:** `expo-av`, `expo-speech`
* **Deployment:** EAS Build (Expo Application Services)

---

## 🚀 How to Run Locally

If you want to run the code on your own machine:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Saurabh-Ch84/WordMaster-Android-App.git
    cd WordMaster
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the App**
    ```bash
    npx expo start
    ```
    * Press **`a`** to open on Android Emulator (or scan QR code with Expo Go).
    * Press **`w`** to open the Web version in your browser.

---

## 📂 Project Structure

* **`/app`**: Contains all screens and routing logic (Expo Router).
* **`/src/components`**: Reusable UI components (Cards, Headers, Modals).
* **`/src/redux`**: State management logic (`gameSlice.js`).
* **`/src/logic`**: Core game algorithms, Sound manager, and Firebase helpers.
* **`/src/constants`**: Theme colors (`Colors.js`) and configuration.


## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by Saurabh Chowrasia**
