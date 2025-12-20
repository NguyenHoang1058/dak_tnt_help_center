import { Ollama } from 'ollama';

const ollama = new Ollama({
    host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
});

const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3';

export const AIService = {
    chat: async (message: string, history: {role: string; contents: string} [] = []) => {
        try {
            // Chuẩn bị context cho AI (System promt)
            const systemPromt = {
                role: 'system',
                content: "Bạn là trợ lý tài chính cho sinh viên DAK.TNT. Trả lời ngắn gọn, thân thiện bằng tiếng Việt. Tập trung vào tiết kiệm và đầu tư cơ bản."
            };

            //Ghép lịch sử chat để AI nhớ ngữ cảnh
            const messages = [
                systemPromt,
                ...history.map(msg => ({role: msg.role, content: msg.contents})),
                {role: 'user', content: message}
            ];

            const response = await ollama.chat({
                model: MODEL_NAME,
                messages: messages as any,
                stream: false
            });

            return response.message.content;
        }catch (error: any){
            console.error("Ollama Chat Error:", error);
            throw new Error("Ai đang bận, vui lòng thử lại sau.")
        }
    },

    /* Phân tích danh mục đầu tư */
    analyzePortfolio: async (portfolioData: any) => {
        try{
            const prompt = `
                Đóng vai trò chuyên gia tài chính. Hãy phân tích danh mục đầu tư sau đây và đưa ra lời khuyên ngắn gọn: 
                ${JSON.stringify(portfolioData)}
                `;
            const response = await ollama.chat({
                model: MODEL_NAME,
                messages: [{role: 'user', content: prompt}],
            });

            return response.message.content;
        }catch (error: any){
            console.error("Ollama Analyze Error:", error);
            throw new Error("Không thể phân tích danh mục lúc này.");
        }
    }
};