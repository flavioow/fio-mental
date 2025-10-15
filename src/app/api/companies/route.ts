import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Lista todas as empresas para seleção no cadastro de psicólogo
        const companies = await prisma.company.findMany({
            select: {
                id: true,
                nome: true,
                cnpj: true
            },
            orderBy: {
                nome: "asc"
            }
        })

        return NextResponse.json({
            success: true,
            companies
        })
    } catch (err) {
        console.error("Erro ao buscar empresas:", err)
        return NextResponse.json(
            { error: "Erro ao buscar empresas" },
            { status: 500 }
        )
    }
}
