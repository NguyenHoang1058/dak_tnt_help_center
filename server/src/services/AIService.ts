import { Ollama } from 'ollama';
import { SYSTEM_PROMPT } from '../ai/systemPrompt/SystemPromt';
import { forbiddenRegexes } from '../ai/securePrompt';

const ollama = new Ollama({
    host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
});

const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3';

function buildMessages(
  userContent: string,
  history: { role: string; content: string }[] = []
) {
  return [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: userContent
    }
  ];
}

export function isForbiddenContent(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return forbiddenRegexes.some(regex => regex.test(normalized));
}

export const AIService = {
    chat: async (message: string, history: {role: string; content: string}[] = []) => {
        try {
            if (isForbiddenContent(message)) {
                return 'Hệ thống chỉ hỗ trợ tư vấn sản phẩm tài chính cho người trẻ.';
            }

            //Ghép lịch sử chat để AI nhớ ngữ cảnh
            const messages = buildMessages(message, history);

            const response = await ollama.chat({
                model: MODEL_NAME,
                messages: messages as any,
                stream: false,
                options: {
                    num_ctx: 4096,
                    temperature: 0.2,
                    top_p: 0.9,
                    repeat_penalty: 1.1
                }
            });

            return response.message.content;
        }catch (error: any){
            console.error("Ollama Chat Error:", error);
            throw new Error("AI đang bận, vui lòng thử lại sau.")
        }
    },

    /* Phân tích danh mục đầu tư */
    analyzePortfolio: async (portfolioData: any) => {
        try{
            const prompt = `
                Dưới đây là dữ liệu danh mục đầu tư GIẢ ĐỊNH:
                ${JSON.stringify(portfolioData)}

                Yêu cầu:
                - Chỉ phân tích ở mức GIÁO DỤC.
                - Không đưa ra lời khuyên đầu tư cá nhân.
                - Không khuyến nghị mua / bán / giữ.
                - Chỉ trình bày các NGUYÊN TẮC phân bổ tài sản chung.
                - Không đề cập đến tổ chức, công ty hoặc tài sản cụ thể.
                - Trả lời hoàn toàn bằng tiếng Việt.
                `;

            const messages = buildMessages(prompt);

            const response = await ollama.chat({
                model: MODEL_NAME,
                messages: messages as any,
                stream: false,
                options: {
                  temperature: 0.2
                }
      });

            return response.message.content;
        }catch (error: any){
            console.error("Ollama Analyze Error:", error);
            throw new Error("Không thể phân tích danh mục, vui lòng thử lại.");
        }
    }
};