import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {
        // 1. Pegar o token JWT dos cookies
        const token = req.cookies.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        // 2. Decodificar o token para pegar o userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, role: string }

        if (decoded.role !== "EMPLOYEE") {
            return NextResponse.json({ error: "Apenas funcionários podem responder" }, { status: 403 })
        }

        // 3. Buscar o employee pelo userId
        const employee = await prisma.employee.findUnique({
            where: { userId: decoded.id }
        })

        if (!employee) {
            return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
        }

        // 4. Receber os dados do formulário
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

        // 5. Montar o prompt para a IA
        const prompt = `
Com base nas respostas abaixo, gere um perfil psicológico objetivo e estruturado em JSON com os seguintes campos:
{
  "perfilPrincipal": "Um dos perfis: Engajado, Motivado mas sobrecarregado, Resiliente em construção, Estressado, Burnout, Desmotivado/Desengajado, Equilibrado, Ansioso no trabalho, Confiante/Autônomo",
  "diagnostico": "Resumo psicológico em 2-3 frases",
  "recomendacoes": ["Recomendação 1", "Recomendação 2", "Recomendação 3"]
}

Respostas:
Saúde Mental e Bem-Estar
- Nível de estresse: ${estresse}
- Motivo do estresse: ${motivoEstresse}
- Equilíbrio trabalho/vida: ${equilibrio}
- Primeira reação a problemas: ${reacaoProblema}
- Espaço para falar sobre bem-estar: ${espacoBemEstar}

Motivação e Produtividade
- Motivação: ${motivacao}
- Desmotivação: ${desmotivacao}
- Melhor horário: ${melhorHorario}
- Foco: ${foco}
- Satisfação/motivação: ${satisfacao}

Relacionamento e Trabalho em Equipe
- Pedir ajuda: ${pedirAjuda}
- Conflitos: ${conflitos}
- Ouvido/respeitado: ${ouvido}
- Tipo de colega/líder: ${tipoColega}
- Ambiente preferido: ${ambiente}

Desenvolvimento e Futuro
- Habilidades para desenvolver: ${habilidades}
- Oportunidades de crescimento: ${oportunidades}
- Confiança para novas responsabilidades: ${confianca}
- Palavra sobre relação com trabalho: ${palavra}
- Mudança para bem-estar: ${mudanca}

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
`

        // 6. Chamar a IA Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const result = await model.generateContent(prompt)
        const perfilGerado = result?.response?.text() || "Erro ao gerar perfil"

        // 7. Salvar no banco (cria ou atualiza)
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
                perfilPsicologico: perfilGerado, // Salva o resultado da IA
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

        // 8. Retornar sucesso
        return NextResponse.json({
            success: true,
            message: "Questionário salvo com sucesso!",
            perfil: perfilGerado,
            questionarioId: questionario.id
        })

    } catch (error) {
        console.error("Erro ao salvar questionário:", error)
        return NextResponse.json(
            { error: "Erro ao processar questionário" },
            { status: 500 }
        )
    }
}
