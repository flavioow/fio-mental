import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Verifica autenticação
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            )
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!)
        } catch {
            return NextResponse.json(
                { error: "Token inválido" },
                { status: 401 }
            )
        }

        // Verifica se é psicólogo
        if (decoded.role !== "PSYCHOLOGIST") {
            return NextResponse.json(
                { error: "Acesso negado" },
                { status: 403 }
            )
        }

        // Busca o psicólogo e sua empresa
        const psychologistUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                psychologist: {
                    include: {
                        company: true
                    }
                }
            }
        })

        if (!psychologistUser?.psychologist) {
            return NextResponse.json(
                { error: "Psicólogo não encontrado" },
                { status: 404 }
            )
        }

        const companyId = psychologistUser.psychologist.companyId

        // Busca o paciente (funcionário)
        const patient = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                employee: {
                    include: {
                        questionario: true,
                        company: true
                    }
                }
            }
        })

        if (!patient || !patient.employee) {
            return NextResponse.json(
                { error: "Paciente não encontrado" },
                { status: 404 }
            )
        }

        // Verifica se o paciente pertence à mesma empresa do psicólogo
        if (patient.employee.companyId !== companyId) {
            return NextResponse.json(
                { error: "Acesso negado - paciente de outra empresa" },
                { status: 403 }
            )
        }

        // Formata os dados do paciente
        const questionario = patient.employee.questionario
        let perfilPsicologico = null
        let resultado = "Pendente"

        if (questionario?.perfilPsicologico) {
            try {
                // Limpa possíveis backticks remanescentes
                let perfilLimpo = questionario.perfilPsicologico
                if (typeof perfilLimpo === 'string') {
                    perfilLimpo = perfilLimpo.replace(/```json\s*|```/g, "").trim()
                }

                perfilPsicologico = JSON.parse(perfilLimpo)
                resultado = perfilPsicologico.tipo || perfilPsicologico.perfilPrincipal || "Equilibrado"
            } catch (err) {
                console.error("Erro ao parsear perfilPsicologico:", err)
                // Fallback: usa o texto bruto como diagnóstico
                perfilPsicologico = {
                    tipo: "equilibrado",
                    diagnostico: questionario.perfilPsicologico
                }
                resultado = "Equilibrado"
            }
        }

        const patientData = {
            id: patient.id,
            nome: patient.name,
            email: patient.email,
            telefone: patient.telefone,
            cpf: patient.employee.cpf,
            empresa: patient.employee.company.nome,
            resultado,
            hasQuestionario: !!questionario,
            perfilPsicologico,
            questionario: questionario ? {
                id: questionario.id,
                createdAt: questionario.createdAt,
                escalaEstresse: questionario.escalaEstresse,
                motivoEstresse: questionario.motivoEstresse,
                equilibrio: questionario.equilibrio,
                reacaoProblema: questionario.reacaoProblema,
                espacoBemEstar: questionario.espacoBemEstar,
                motivacao: questionario.motivacao,
                desmotivacao: questionario.desmotivacao,
                melhorHorario: questionario.melhorHorario,
                focoColaborativo: questionario.focoColaborativo,
                satisfacao: questionario.satisfacao,
                pedirAjuda: questionario.pedirAjuda,
                conflitos: questionario.conflitos,
                senteOuvido: questionario.senteOuvido,
                ouvido: questionario.ouvido,
                tipoColega: questionario.tipoColega,
                ambienteCalmo: questionario.ambienteCalmo,
                habilidades: questionario.habilidades,
                oportunidades: questionario.oportunidades,
                confianca: questionario.confianca,
                palavra: questionario.palavra,
                mudanca: questionario.mudanca,
            } : null
        }

        return NextResponse.json({
            success: true,
            patient: patientData
        })
    } catch (err) {
        console.error("Erro ao buscar detalhes do paciente:", err)
        return NextResponse.json(
            { error: "Erro ao buscar detalhes do paciente" },
            { status: 500 }
        )
    }
}
