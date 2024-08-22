// sendMessage.js
const coolsms = require("coolsms-node-sdk").default;

const api_key = process.env.COOLSMS_API_KEY;
const api_secret_key = process.env.COOLSMS_API_SECRET;
const from = process.env.CALLER_ID;
// CoolSMS API Key와 Secret 설정
const messageService = new coolsms(api_key, api_secret_key);

// 메시지 전송 함수
async function sendMessage(to: string, text: string) {
  console.log(to);
  console.log(text);
  try {
    const response = await messageService.sendMany([
      {
        to: to,
        from: from,
        text: `인증번호는 ${text} 입니다.`,
      },
    ]);
    console.log("메시지 전송 성공:", response);
  } catch (error) {
    console.error("메시지 전송 실패:", error);
  }
}

// 모듈 내보내기
module.exports = sendMessage;
