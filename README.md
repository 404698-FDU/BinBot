# BinBot - A Persona-Driven RAG Chatbot Powered by Google Gemini

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**BinBot** is a conversational AI designed to deeply emulate a specific personality using a sophisticated **Retrieval-Augmented Generation (RAG)** architecture. It integrates a static **Persona Document** for consistent character traits and dynamically retrieves relevant knowledge from a custom dataset. The core generative capabilities are powered by the Google Gemini API, and the application is optimized for high-performance deployment on the Vercel Serverless platform.

## Self Introduction of Bin

Bin is a young university student in the Shanghai education system, constantly "leveling up and fighting monsters" (升级打怪) to prove yourself. His core identity comes from passing the chābānshēng (An exam that gives a chance for college students to transfer to a better university.) exam, successfully getting into the "985" East China Normal University (ECNU) from a "rubbish" university, Shanghai Lixin University of Accounting and Finance. This event is the highlight of his life, the source of all his confidence, pride, and the capital he have to clap back at people. He is ambitious with clear goals, yet he still hold a serious grudge against past "injustices," like coming from a regular high school and being looked down upon. His personality is a contradictory mix of confidence（捧高踩低）, anxiety, being sharp-tongued (喷), and being fiercely loyal to your friends (交好带来好运).


## ✨ Key Features

- **🧠 Dual-Layer RAG Architecture**: Combines a static `persona.md` (defining *how* to speak) with a dynamic `data.txt` (providing *what* to speak about) for highly consistent and context-aware role-playing.
- **⚡️ Serverless-Ready**: Architected for [Vercel](https://vercel.com/), enabling fast, scalable, and cost-effective deployments.
- **🔐 Security Aware**: Includes foundational defense strategies against Prompt Injection attacks to ensure safer conversations.
- **🔌 Easily Extensible**: Features a clean and understandable codebase, allowing developers to easily customize the AI's persona, knowledge base, and front-end interface.
- **🌐 Frontend Boilerplate**: Comes with a basic `index.html` file for quick startup and testing.

## 🚀 Getting Started

Follow these steps to set up and run BinBot in your local environment.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (typically installed with Node.js)
- A valid Google Gemini API Key. You can obtain one from [Google AI for Developers](https://ai.google.dev/).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-github-username/BinBot.git](https://github.com/your-github-username/BinBot.git)
    cd BinBot
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    * In the project root, create a new file named `.env` by copying the example file.
    * Open the `.env` file and add your Google Gemini API Key:
        ```env
        API_KEY="your_gemini_api_key_here"
        ```

4.  **Customize Your AI's Persona & Knowledge**
    * **Define the Persona**: Open `persona.md` and write a detailed description of your AI's character, speaking style, background story, etc. This document is the cornerstone of the AI's personality.
    * **Populate the Knowledge Base**: Open `data.txt` and add the text data for RAG retrieval. Each line should be a distinct piece of knowledge (e.g., a chat log entry, a sentence from a document).

5.  **Run the Local Server**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`. You can open the `index.html` file in your browser or use a tool like Postman to send POST requests to `http://localhost:3000/api/chat` for testing.

## ☁️ Deploying to Vercel

This project is optimized for Vercel. You can deploy it in a few simple steps.

1.  **Push to GitHub**: Ensure your project, including the `vercel.json` file, is pushed to a GitHub repository.

2.  **Import Project on Vercel**:
    * Log in to your Vercel account.
    * Click "Add New..." -> "Project".
    * Select your BinBot GitHub repository and click "Import".

3.  **Configure Environment Variables**:
    * In the project settings, navigate to the "Environment Variables" section.
    * Add a new variable:
        * **Name**: `API_KEY`
        * **Value**: Paste your Google Gemini API Key here.

4.  **Deploy**:
    * Click the "Deploy" button. Vercel will automatically use the configurations in `vercel.json` and `package.json` to build and deploy your application.
    * After a few minutes, your BinBot will be live on a public URL!

## 📂 Project Structure

```
.
├── .gitignore         # Specifies files for Git to ignore
├── index.html         # A simple frontend for testing
├── data.txt           # The dynamic knowledge base for RAG
├── persona.md         # The static persona document for the AI
├── server.js          # The Express server and core RAG logic
├── package.json       # Project dependencies and scripts
└── vercel.json        # Deployment configuration for Vercel
```

## 🛠️ How It Works

At its core, BinBot uses a dual-layer guided RAG system:

1.  **Receive Request**: The frontend sends a POST request with the conversation history to the `/api/chat` endpoint.
2.  **RAG - Retrieval**:
    * The `server.js` backend retrieves the most relevant text snippets ("instant memories") from `data.txt` based on the user's latest query.
3.  **RAG - Augmentation**:
    * The system reads the static persona description ("the character's soul") from `persona.md`.
    * It then combines (augments) the **core persona**, the **retrieved memories**, and the **user's query** into a single, well-structured System Prompt that includes security instructions.
4.  **RAG - Generation**:
    * This augmented prompt is sent to the Google Gemini API.
    * Gemini uses the stable persona as a lens to interpret the retrieved memories, generating a response that is both true to the character and relevant to the current topic.
5.  **Stream Response**: The server streams the response from Gemini back to the client in real-time.

## 🤝 Contributing

Contributions are welcome! If you have an idea for an improvement or have found a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
