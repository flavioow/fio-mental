import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Helper para validar se um horário está dentro de um slot de disponibilidade
function isTimeInSlot(time: string, slotStart: string, slotEnd: string): boolean {
    const [timeHour, timeMin] = time.split(":").map(Number)
    const [slotHour, slotMin] = slotStart.split(":").map(Number)
    const [endHour, endMin] = slotEnd.split(":").map(Number)

    const timeInMinutes = timeHour * 60 + timeMin
    const slotStartInMinutes = slotHour * 60 + slotMin
    const slotEndInMinutes = endHour * 60 + endMin

    // Considera 30 minutos de duração da consulta
    return (
        timeInMinutes >= slotStartInMinutes &&
        timeInMinutes + 30 <= slotEndInMinutes
    )
}

// Helper para calcular data em formato YYYY-MM-DD sem problemas de timezone
function normalizeDateString(dateStr: string): string {
    // Garante que a data seja sempre no formato YYYY-MM-DD
    const date = new Date(dateStr + "T00:00:00Z")
    return date.toISOString().split("T")[0]
}

// POST - Criar agendamento
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!)
        } catch {
            return NextResponse.json({ error: "Token inválido" }, { status: 401 })
        }

        if (decoded.role !== "EMPLOYEE") {
            return NextResponse.json({ error: "Apenas funcionários podem agendar" }, { status: 403 })
        }

        const employee = await prisma.employee.findUnique({
            where: { userId: decoded.id }
        })

        if (!employee) {
            return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 })
        }

        const { psychologistId, date, time, notes } = await req.json()

        if (!psychologistId || !date || !time) {
            return NextResponse.json(
                { error: "Psicólogo, data e horário são obrigatórios" },
                { status: 400 }
            )
        }

        // Valida formato de data (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: "Data deve estar no formato YYYY-MM-DD" },
                { status: 400 }
            )
        }

        // Valida formato de hora (HH:mm)
        if (!/^\d{2}:\d{2}$/.test(time)) {
            return NextResponse.json(
                { error: "Horário deve estar no formato HH:mm" },
                { status: 400 }
            )
        }

        // Verifica se o psicólogo existe e é da mesma empresa
        const psychologist = await prisma.psychologist.findUnique({
            where: { id: parseInt(psychologistId) },
            include: {
                availability: true
            }
        })

        if (!psychologist || psychologist.companyId !== employee.companyId) {
            return NextResponse.json(
                { error: "Psicólogo não encontrado ou de outra empresa" },
                { status: 404 }
            )
        }

        // Valida se o dia da semana é de funcionamento
        const selectedDate = new Date(date + "T00:00:00Z")
        const dayOfWeek = selectedDate.getUTCDay()

        const dayAvailability = psychologist.availability.filter(a => a.dayOfWeek === dayOfWeek)

        if (dayAvailability.length === 0) {
            return NextResponse.json(
                { error: "Psicólogo não atende neste dia da semana" },
                { status: 400 }
            )
        }

        // Valida se o horário está dentro da disponibilidade
        const isAvailable = dayAvailability.some(slot =>
            isTimeInSlot(time, slot.startTime, slot.endTime)
        )

        if (!isAvailable) {
            return NextResponse.json(
                { error: "Horário não disponível neste dia" },
                { status: 400 }
            )
        }

        // Calcula startTime e endTime (30 minutos de duração)
        const [hours, minutes] = time.split(":").map(Number)
        const startTime = time
        const endMinutes = minutes + 30
        const endHours = endMinutes >= 60 ? hours + 1 : hours
        const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`

        // Verifica se já existe agendamento no mesmo horário
        const appointmentDate = new Date(date + "T00:00:00Z")

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                psychologistId: parseInt(psychologistId),
                date: appointmentDate,
                startTime: startTime,
                status: {
                    not: "CANCELLED"
                }
            }
        })

        if (existingAppointment) {
            return NextResponse.json(
                { error: "Horário já está ocupado" },
                { status: 409 }
            )
        }

        // Cria o agendamento
        const appointment = await prisma.appointment.create({
            data: {
                employeeId: employee.id,
                psychologistId: parseInt(psychologistId),
                date: appointmentDate,
                startTime: startTime,
                endTime: endTime,
                notes: notes || null,
                status: "SCHEDULED"
            },
            include: {
                psychologist: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                },
                employee: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: "Consulta agendada com sucesso",
            appointment
        })
    } catch (err) {
        console.error("Erro ao criar agendamento:", err)
        return NextResponse.json(
            { error: "Erro ao criar agendamento" },
            { status: 500 }
        )
    }
}

// GET - Listar agendamentos
export async function GET(req: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!)
        } catch {
            return NextResponse.json({ error: "Token inválido" }, { status: 401 })
        }

        let appointments

        if (decoded.role === "EMPLOYEE") {
            const employee = await prisma.employee.findUnique({
                where: { userId: decoded.id }
            })

            if (!employee) {
                return NextResponse.json(
                    { error: "Funcionário não encontrado" },
                    { status: 404 }
                )
            }

            appointments = await prisma.appointment.findMany({
                where: { employeeId: employee.id },
                include: {
                    psychologist: {
                        include: {
                            user: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                },
                orderBy: { date: "asc" }
            })
        } else if (decoded.role === "PSYCHOLOGIST") {
            const psychologist = await prisma.psychologist.findUnique({
                where: { userId: decoded.id }
            })

            if (!psychologist) {
                return NextResponse.json(
                    { error: "Psicólogo não encontrado" },
                    { status: 404 }
                )
            }

            appointments = await prisma.appointment.findMany({
                where: { psychologistId: psychologist.id },
                include: {
                    employee: {
                        include: {
                            user: {
                                select: { name: true, email: true, telefone: true }
                            }
                        }
                    }
                },
                orderBy: { date: "asc" }
            })
        } else {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
        }

        return NextResponse.json({
            success: true,
            appointments
        })
    } catch (err) {
        console.error("Erro ao buscar agendamentos:", err)
        return NextResponse.json(
            { error: "Erro ao buscar agendamentos" },
            { status: 500 }
        )
    }
}
