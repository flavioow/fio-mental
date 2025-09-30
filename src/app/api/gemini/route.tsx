import { NextResponse } from "next/server"

// Se estiver usando o pacote oficial da Gemini:
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    const { prompt } = await req.json()

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent(prompt)
        const response = await result.response.text()
        return NextResponse.json({ result: response })
    } catch (error) {
        return NextResponse.json({ error: "Erro ao consultar Gemini" }, { status: 500 })
    }
}