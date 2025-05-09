const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({ key: "YOUR_GOOGLE_TRANSLATE_API_KEY" });

const translateText = async (text, targetLang = "th") => {
  try {
    const [translatedText] = await translate.translate(text, targetLang);
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // ถ้าแปลไม่ได้ให้ใช้ข้อความเดิม
  }
};

module.exports = { translateText };
