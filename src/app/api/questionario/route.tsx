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
Você é um assistente especializado em análise psicológica organizacional.
Com base nas respostas abaixo, gere um PERFIL PSICOLÓGICO resumido do funcionário.

Sua resposta **DEVE SER ESTRITAMENTE UM JSON VÁLIDO**, no formato:

{
  "tipo": "engajado",
  "perfilPrincipal": "descrição breve do perfil psicológico (1 a 2 linhas)",
  "diagnostico": "resumo interpretativo de 3 a 5 linhas sobre o estado emocional e comportamental do funcionário",
  "recomendacoes": ["ação prática 1", "ação prática 2", "ação prática 3"]
}

REGRAS IMPORTANTES:
1. O campo "tipo" deve ser **EXATAMENTE UMA destas palavras (em letras minúsculas e sem variações):**
   - engajado
   - motivado
   - resiliente
   - estressado
   - burnout
   - desmotivado
   - equilibrado
   - ansioso
   - confiante
2. NÃO escreva nada fora do JSON (sem introdução, sem explicação, sem markdown, sem texto adicional).
3. NÃO escreva frases dentro do campo "tipo" — ele deve conter **somente uma das palavras acima**.
4. Seja coerente e consistente com as respostas dadas.

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

Descrição dos tipos disponíveis:
1. engajado: Alta motivação, energia positiva, sente-se útil e reconhecido
2. motivado: Gosta do trabalho, mas sinais de excesso de demandas
3. resiliente: Lida com pressões, mas precisa de apoio emocional
4. estressado: Tensão frequente, dificuldade em relaxar
5. burnout: Fadiga intensa, queda de motivação, exaustão
6. desmotivado: Baixa energia, pouca conexão emocional
7. equilibrado: Nível saudável de estresse, boa organização
8. ansioso: Expectativas elevadas, preocupação constante
9. confiante: Boa autoeficácia, lida bem com pressões
`

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const result = await model.generateContent(prompt)
        let perfilGeradoBruto = result?.response?.text() || "{}"

        // LIMPA os backticks e markdown
        perfilGeradoBruto = perfilGeradoBruto.replace(/```json\s*|```/g, "").trim()

        // Valida se é um JSON válido
        let perfilJSON: any = {}
        try {
            perfilJSON = JSON.parse(perfilGeradoBruto)
        } catch (err) {
            console.error("Erro ao parsear JSON da Gemini:", perfilGeradoBruto)
            // Fallback: cria um objeto básico
            perfilJSON = {
                tipo: "equilibrado",
                perfilPrincipal: "Perfil não identificado",
                diagnostico: perfilGeradoBruto,
                recomendacoes: []
            }
        }

        // Garante que o campo "tipo" existe e está em minúsculo
        if (!perfilJSON.tipo) {
            perfilJSON.tipo = "equilibrado"
        }
        perfilJSON.tipo = perfilJSON.tipo.toLowerCase()

        // Converte de volta para string JSON limpo
        const perfilLimpo = JSON.stringify(perfilJSON)

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
                perfilPsicologico: perfilLimpo, // Salva o JSON limpo
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
                perfilPsicologico: perfilLimpo, // Salva o JSON limpo
            },
        })

        return NextResponse.json({
            success: true,
            perfil: perfilLimpo,
            questionarioId: questionario.id
        })
    } catch (err) {
        console.error("Erro ao salvar questionário:", err)
        return NextResponse.json({ error: "Erro ao processar questionário" }, { status: 500 })
    }
}
