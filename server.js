const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 配置 ---
const PORT = 3000;
const DATA_FILE_PATH = path.join(__dirname, 'data.txt');
// 在这里填入你的 Gemini API Key
const API_KEY = process.env.API_KEY;
const MODEL_NAME = "gemini-2.5-flash"; // 选择 Gemini 模型

// --- 初始化 ---
const app = express();
app.use(express.json());
app.use(cors()); // 允许跨域请求

// 初始化 Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// --- RAG 核心逻辑 ---
let chatLogs = [];

// 1. 加载并分块数据
try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    // 按行分割，每一行作为一个独立的知识片段
    chatLogs = data.split('\n').filter(line => line.trim() !== '');
    console.log(`[INFO] 成功加载 ${chatLogs.length} 条聊天记录作为知识库。`);
} catch (error) {
    console.error(`[ERROR] 无法读取数据文件 ${DATA_FILE_PATH}。请确保文件存在且内容正确。`, error);
    process.exit(1); // 如果知识库加载失败，则退出程序
}

// 2. 检索函数 (增加深度调试日志)
function retrieveRelevantLogs(query, topK = 10) {
    const queryChars = query.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?\s]/g,"").split('');
    
    // --- 新增深度调试日志 ---
    // console.log('\n--- [DEEP DEBUG] ---');
    // console.log(`[DEBUG] 处理后的查询字符: [${queryChars.join(', ')}]`);
    // console.log('[DEBUG] 知识库（data.txt）的前5条记录:');
    // for (let i = 0; i < 5 && i < chatLogs.length; i++) {
    //     console.log(`  - Line ${i+1}: "${chatLogs[i]}"`);
    // }
    // console.log('--- [END DEEP DEBUG] ---\n');
    // --- 结束新增日志 ---

    const scoredLogs = chatLogs.map(log => {
        let score = 0;
        const lowerLog = log.toLowerCase();
        
        queryChars.forEach(char => {
            if (lowerLog.includes(char)) {
                score++;
            }
        });
        return { log, score };
    });

    const sortedLogs = scoredLogs.filter(item => item.score > 0).sort((a, b) => b.score - a.score);
    return sortedLogs.slice(0, topK).map(item => item.log);
}

// --- API 端点 ---
app.post('/api/chat', async (req, res) => {
    console.log('\n--- [NEW REQUEST] ---');
    console.log('[DEBUG] 收到前端发来的请求...');
    try {
        const history = req.body.history;
        if (!history || !Array.isArray(history) || history.length === 0) {
            console.log('[ERROR] 请求体中的 history 为空或格式不正确。');
            return res.status(400).json({ error: 'history 不能为空' });
        }

        const userQuery = history[history.length - 1].parts[0].text;
        console.log(`[DEBUG] 用户问题: "${userQuery}"`);

        // 1. RAG - 检索
        const relevantLogs = retrieveRelevantLogs(userQuery);
        console.log(`[DEBUG] 检索到 ${relevantLogs.length} 条相关记录。`);
        
        // 【重要更新】在这里打印检索到的具体记录
        console.log('[DEBUG] 以下是检索到的最相关的记录:');
        if (relevantLogs.length > 0) {
            relevantLogs.forEach((log, index) => {
                console.log(`  - [${index + 1}] ${log}`);
            });
        } else {
            console.log('  - (无相关记录)');
        }
        
        // 2. RAG - 增强
        const systemPromptText = `
            你正在扮演一个特定的人。你的回答必须严格模仿这个人的说话风格、语气和口头禅。
            为了帮助你更好地模仿，下面提供了一些这个人的真实历史聊天记录片段。请将它们作为你最重要的参考。
            ---
            历史聊天记录参考:
            ${relevantLogs.join('\n')}
            ---
            现在，请根据上面的风格，并结合当前的对话上下文，回答用户的问题。
        `;
        
        // 3. RAG - 生成
        const chat = model.startChat({
            generationConfig: {
                maxOutputTokens: 20000,
            },
            history: history.slice(0, -1),
            systemInstruction: {
                parts: [{ text: systemPromptText }]
            },
        });

        console.log('[DEBUG] 正在向 Gemini API 发送请求，请稍候...');
        const result = await chat.sendMessageStream(userQuery);
        console.log('[DEBUG] 已从 Gemini API 收到响应流，正在发回前端...');
        
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        for await (const chunk of result.stream) {
            res.write(chunk.text());
        }
        res.end();
        console.log('[DEBUG] 响应流发送完毕。');

    } catch (error) {
        console.error('[ERROR] API 请求过程中出错:', error.cause || error);
        res.status(500).json({ error: '与 AI 服务通信时发生错误' });
    }
});

// --- 启动服务器 ---
// 在本地开发时，我们仍然需要监听端口
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[INFO] 服务器已启动，正在监听 http://localhost:${PORT}`);
    });
}

// --- 导出 app ---
// 将 app 导出，以便 Vercel 可以将其作为 Serverless Function 使用
module.exports = app;
