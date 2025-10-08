import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: string }
        if (decoded.role.toUpperCase() !== "EMPLOYEE")
            return NextResponse.json({ error: "Apenas funcionários" }, { status: 403 })

        const employee = await prisma.employee.findUnique({ where: { userId: decoded.id } })
        if (!employee) return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })

        const body = await req.json()
        const {
            estresse,
            motivoEstresse,
            equilibrio,
            reacaoProblema,
            espacoBemEstar,
            motivacao,
            desmotivacao,
            melhorHorario,
            foco,
            satisfacao,
            pedirAjuda,
            conflitos,
            ouvido,
            tipoColega,
            ambiente,
            habilidades,
            oportunidades,
            confianca,
            palavra,
            mudanca,
        } = body

        // Monta prompt para Gemini
        const prompt = `
Gere um perfil psicológico do funcionário em JSON com campos:
{
  "perfilPrincipal": "...",
  "diagnostico": "...",
  "recomendacoes": ["...", "..."]
}

Respostas do questionário:
- Nível de estresse: ${estresse}
- Motivo do estresse: ${motivoEstresse}
- Equilíbrio: ${equilibrio}
- Primeira reação a problemas: ${reacaoProblema}
- Espaço para falar sobre bem-estar: ${espacoBemEstar}
- Motivação: ${motivacao}
- Desmotivação: ${desmotivacao}
- Melhor horário: ${melhorHorario}
- Foco: ${foco}
- Satisfação: ${satisfacao}
- Pedir ajuda: ${pedirAjuda}
- Conflitos: ${conflitos}
- Ouvido/respeito: ${ouvido}
- Tipo de colega: ${tipoColega}
- Ambiente: ${ambiente}
- Habilidades: ${habilidades}
- Oportunidades: ${oportunidades}
- Confiança: ${confianca}
- Palavra: ${palavra}
- Mudança: ${mudanca}

Perfis possíveis:
1. Engajado: Alta motivação, energia positiva, sente-se útil e reconhecido
2. Motivado, mas sobrecarregado: Gosta do trabalho, mas sinais de excesso de demandas
3. Resiliente em construção: Lida com pressões, mas precisa de apoio emocional
4. Estressado: Tensão frequente, dificuldade em relaxar
5. Burnout: Fadiga intensa, queda de motivação, exaustão
6. Desmotivado/Desengajado: Baixa energia, pouca conexão emocional
7. Equilibrado: Nível saudável de estresse, boa organização
8. Ansioso no trabalho: Expectativas elevadas, preocupação constante
9. Confiante/Autônomo: Boa autoeficácia, lida bem com pressões

Resuma o relatório para algo entre 6 a 7 linhas
`

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const result = await model.generateContent(prompt)
        const perfilGerado = result?.response?.text() || "Erro ao gerar perfil"

        // Salva no banco
        const questionario = await prisma.questionario.upsert({
            where: { employeeId: employee.id },
            update: {
                escalaEstresse: parseInt(estresse),
                motivoEstresse,
                equilibrio,
                reacaoProblema,
                espacoBemEstar,
                motivacao,
                desmotivacao,
                melhorHorario,
                focoColaborativo: foco,
                satisfacao,
                pedirAjuda,
                conflitos,
                senteOuvido: ouvido,
                tipoColega,
                ambienteCalmo: ambiente,
                habilidades,
                oportunidades,
                confianca,
                palavra,
                mudanca,
                perfilPsicologico: perfilGerado,
            },
            create: {
                employeeId: employee.id,
                escalaEstresse: parseInt(estresse),
                motivoEstresse,
                equilibrio,
                reacaoProblema,
                espacoBemEstar,
                motivacao,
                desmotivacao,
                melhorHorario,
                focoColaborativo: foco,
                satisfacao,
                pedirAjuda,
                conflitos,
                senteOuvido: ouvido,
                tipoColega,
                ambienteCalmo: ambiente,
                habilidades,
                oportunidades,
                confianca,
                palavra,
                mudanca,
                perfilPsicologico: perfilGerado,
            },
        })

        return NextResponse.json({ success: true, perfil: perfilGerado, questionarioId: questionario.id })
    } catch (err) {
        console.error("Erro ao salvar questionário:", err)
        return NextResponse.json({ error: "Erro ao processar questionário" }, { status: 500 })
    }
}
