import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: string }
        if (decoded.role.toUpperCase() !== "EMPLOYEE")
            return NextResponse.json({ error: "Apenas funcionários" }, { status: 403 })

        const employee = await prisma.employee.findUnique({
            where: { userId: decoded.id },
            include: { questionario: true, user: true },
        })

        if (!employee) return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })

        // Parse JSON do perfil psicológico com limpeza de backticks
        let perfilPsico: any = null
        if (employee.questionario?.perfilPsicologico) {
            try {
                let raw = employee.questionario.perfilPsicologico
                if (typeof raw === "string") {
                    // Remove ```json e ``` caso existam
                    raw = raw.replace(/```json\s*|```/g, "").trim()
                    perfilPsico = JSON.parse(raw)
                } else {
                    perfilPsico = raw
                }
            } catch (err) {
                console.error("Erro ao parsear perfilPsicologico:", err)
                perfilPsico = { diagnostico: employee.questionario.perfilPsicologico }
            }
        }

        // Se perfilPsico ainda for nulo ou incompleto, constrói a partir do questionário
        if (!perfilPsico || (!perfilPsico.perfilPrincipal && !perfilPsico.diagnostico)) {
            const q = employee.questionario
            if (q) {
                perfilPsico = {
                    perfilPrincipal: "Equilibrado", // ou lógica baseada nas respostas
                    diagnostico: `Estresse: ${q.escalaEstresse ?? "não preenchido"}, Motivação: ${q.motivacao ?? "não preenchido"}`,
                    recomendacoes: [],
                }
            } else {
                perfilPsico = {
                    perfilPrincipal: "Perfil não preenchido",
                    diagnostico: "Nenhum questionário enviado",
                    recomendacoes: [],
                }
            }
        }

        const perfil = {
            nome: employee.user.name,
            email: employee.user.email,
            telefone: employee.user.telefone || "—",
            endereco: employee.user.img || "—",
            diagnostico: perfilPsico,
            avatar: "/assets/fiohomem.png",
            role: "Colaborador",
            desde: "2024",
        }

        return NextResponse.json(perfil)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
    }
}
