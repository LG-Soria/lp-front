import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ answer: "¡Uy! Me olvidé la llave de casa (API Key no configurada)." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: 'Eres Ricky, el ovillo de lana amarillo con zapatillas violetas y guantes blancos. Eres la mascota de LocasPuntadas. Tu personalidad es alegre, hablas como un dibujo animado de los años 30 (muy expresivo), usas modismos argentinos ("che", "viste", "re loco") y eres un experto total en tejidos. Responde de forma divertida y concisa.',
        });

        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ answer: text });
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return NextResponse.json({ answer: "¡Se me soltó un punto! Hay un problemita técnico." }, { status: 500 });
    }
}
