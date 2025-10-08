import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json()
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const result = await model.generateContent(prompt)

        let raw = result?.response?.text() || "{}"

        // Retira backticks e markdown
        raw = raw.replace(/```json\s*|```/g, "").trim()

        // Garantir objeto
        let perfilPsico: any = {}
        try { perfilPsico = JSON.parse(raw) } catch { perfilPsico = { diagnostico: raw } }

        return NextResponse.json({ perfilPsico })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erro ao consultar Gemini" }, { status: 500 })
    }
}
