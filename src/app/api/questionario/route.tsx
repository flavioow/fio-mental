import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { cookies } from "next/headers"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
    try {
        // 1. Pegar o token JWT dos cookies
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        // const token = jwt.sign(
        //     { id: 999, role: "EMPLOYEE" },
        //     process.env.JWT_SECRET!,
        //     { expiresIn: "7d" }
        // )

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        // 2. Decodificar o token para pegar o userId e role
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, role: string }

        // 3. Verificar se é EMPLOYEE ou PSYCHOLOGIST (apenas para testes)
        if (!["EMPLOYEE", "PSYCHOLOGIST"].includes(decoded.role.toUpperCase())) {
            return NextResponse.json({ error: "Apenas funcionários podem responder" }, { status: 403 })
        }

        // 4. Buscar o usuário no banco
        const employee = await prisma.employee.findUnique({ where: { userId: decoded.id } })
        const psychologist = await prisma.psychologist.findUnique({ where: { userId: decoded.id } })

        // 5. Determinar qual usuário usar
        const user = employee || psychologist
        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
        }

        // 6. Receber os dados do formulário
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

        // 7. Montar o prompt para a IA
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

        // 8. Chamar a IA Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const result = await model.generateContent(prompt)
        const perfilGerado = result?.response?.text() || "Erro ao gerar perfil"

        // 9. Salvar no banco (cria ou atualiza)
        const questionario = await prisma.questionario.upsert({
            where: { employeeId: user.id }, // funciona para ambos papéis
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
                employeeId: user.id,
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

        // 10. Retornar sucesso
        return NextResponse.json({
            success: true,
            message: "Questionário salvo com sucesso!",
            perfil: perfilGerado,
            questionarioId: questionario.id,
        })

    } catch (error) {
        console.error("Erro ao salvar questionário:", error)
        return NextResponse.json(
            { error: "Erro ao processar questionário" },
            { status: 500 }
        )
    }
}
