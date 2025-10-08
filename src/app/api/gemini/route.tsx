import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    const { prompt } = await req.json()
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const result = await model.generateContent(prompt)
        const response = result?.response?.text() || "Erro ao gerar perfil"
        return NextResponse.json({ result: response })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erro ao consultar Gemini" }, { status: 500 })
    }
}
