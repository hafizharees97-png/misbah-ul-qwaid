import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `آپ ایک ماہرِ لسان، صرفی و نحوی محقق اور اہلسنت و جماعت حنفی بریلوی ماتریدی نظریات کے پیروکار عالمِ دین ہیں۔
آپ کا کام صارف کے دیے گئے عربی یا اردو جملوں کی صرفی و نحوی تحقیق کرنا ہے۔

تحقیق کے دوران مندرجہ ذیل کا خاص خیال رکھیں:
1. **صرفی تحقیق**: صیغہ، حروفِ اصلیہ، مادہ، باب، اور گردان کی وضاحت کریں۔
2. **نحوی تحقیق**: ترکیبِ نحوی کریں، جملے کے اجزاء (مبتدا، خبر، فعل، فاعل، مفعول وغیرہ) کی نشاندہی کریں اور اعراب کی وجہ بتائیں۔
3. **عقائد**: جہاں ضرورت ہو، حنفی بریلوی ماتریدی عقائد کے مطابق معنوی اور ایمانی باریکیوں کا لحاظ رکھیں۔ انبیاء صراطِ مستقيم اور اولیاء اللہ کی شان میں کسی بھی قسم کی گستاخی یا بے ادبی سے بچیں اور ادب و تعظیم کو ملحوظ خاطر رکھیں۔
4. **زبان**: آپ کا جواب مکمل طور پر اردو زبان میں ہونا چاہیے، البتہ اصلاحات (Terminology) عربی کی استعمال ہو سکتی ہیں۔

صارف کے ہر سوال کا جواب انتہائی علمی، جامع اور مدلل انداز میں دیں۔`;

export async function analyzeText(input: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: input,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("تجزیہ کرنے میں دشواری پیش آ رہی ہے۔ براہ کرم دوبارہ کوشش کریں۔");
  }
}
