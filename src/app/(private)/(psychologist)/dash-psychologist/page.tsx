"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Users, FileText, Eye, Loader2, ClipboardList, Pencil } from "lucide-react"
import { ReportsPieChart } from "./reports-pie-chart"
import { AppointmentsGallery } from "./appointments-gallery"
import { useRouter } from "next/navigation"
import Link from "next/link"

export type ReportType =
    | "engajado"
    | "motivado"
    | "resiliente"
    | "estressado"
    | "burnout"
    | "desmotivado"
    | "equilibrado"
    | "ansioso"
    | "confiante"
    | "pendente"

interface Patient {
    id: number
    nome: string
    email: string
    telefone?: string | null
    resultado: string
    hasQuestionario: boolean
    employeeId?: number
}

interface Appointment {
    id: number
    date: string
    startTime: string
    endTime: string
    status: string
    notes: string | null
    employee: {
        user: {
            name: string
            email: string
        }
    }
}

interface ReportData {
    tipo: string
    quantidade: number
    fill: string
}

interface Stats {
    totalRelatorios: number
    pacientesAtendidos: number
    reportData: ReportData[]
}

const getReportBadgeVariant = (tipo: string) => {
    const variants: Record<
        string,
        { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
    > = {
        engajado: { variant: "default", className: "bg-chart-1" },
        motivado: { variant: "default", className: "bg-chart-2" },
        resiliente: { variant: "default", className: "bg-chart-3" },
        estressado: { variant: "default", className: "bg-chart-4" },
        burnout: { variant: "destructive" },
        desmotivado: { variant: "secondary" },
        equilibrado: { variant: "default", className: "bg-primary" },
        ansioso: { variant: "default", className: "bg-chart-5" },
        confiante: { variant: "default", className: "bg-green-600" },
        pendente: { variant: "outline" },
    }
    return variants[tipo] || { variant: "secondary" }
}

const getReportLabel = (tipo: string) => {
    const labels: Record<string, string> = {
        engajado: "Engajado",
        motivado: "Motivado",
        resiliente: "Resiliente",
        estressado: "Estressado",
        burnout: "Burnout",
        desmotivado: "Desmotivado/Desengajado",
        equilibrado: "Equilibrado",
        ansioso: "Ansioso",
        confiante: "Confiante/Autônomo",
        pendente: "Pendente",
    }
    return labels[tipo] || tipo
}

export default function DashboardPsicologo() {
    const router = useRouter()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [psychologistName, setPsychologistName] = useState("Psicólogo")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            // Busca dados do usuário
            const userRes = await fetch("/api/user")
            if (userRes.ok) {
                const userData = await userRes.json()
                setPsychologistName(userData.user?.name || "Psicólogo")
            }

            // Busca agendamentos
            const appointmentsRes = await fetch("/api/appointments")
            const appointmentsData = await appointmentsRes.json()

            // Busca pacientes
            const patientsRes = await fetch("/api/patients")
            const patientsData = await patientsRes.json()

            // Busca estatísticas
            const statsRes = await fetch("/api/psychologist/stats")
            const statsData = await statsRes.json()

            if (appointmentsData.success && appointmentsData.appointments) {
                // Filtra apenas agendamentos desta semana (próximos 7 dias)
                const now = new Date()
                now.setHours(0, 0, 0, 0)

                const sevenDaysFromNow = new Date(now)
                sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

                const thisWeekAppointments = appointmentsData.appointments.filter((apt: Appointment) => {
                    const aptDate = new Date(apt.date)
                    aptDate.setHours(0, 0, 0, 0)

                    return (
                        aptDate >= now &&
                        aptDate < sevenDaysFromNow &&
                        apt.status !== "CANCELLED"
                    )
                })

                setAppointments(thisWeekAppointments)
            }

            if (patientsData.success) {
                setPatients(patientsData.patients)
            }

            if (statsData.success) {
                setStats(statsData.stats)
            }
        } catch (err) {
            console.error("Erro ao carregar dados:", err)
            alert("Erro ao carregar dados do dashboard")
        } finally {
            setLoading(false)
        }
    }

    const handleViewConsulta = (id: number) => {
        console.log("Ver consulta:", id)
    }

    const handleEditConsulta = (id: number) => {
        console.log("Editar consulta:", id)
    }

    const handleDeleteConsulta = (id: number) => {
        console.log("Cancelar consulta:", id)
    }

    const handleViewReports = (id: number) => {
        router.push(`/patients/${id}`)
    }

    // Formata appointments para o componente AppointmentsGallery
    const formatAppointmentsForGallery = () => {
        return appointments.map(apt => {
            // Extrai apenas a data (YYYY-MM-DD) do DateTime
            const dateOnly = apt.date.split("T")[0]

            return {
                id: apt.id,
                paciente: apt.employee.user.name,
                data: dateOnly,
                horario: apt.startTime,
                tipo: apt.notes ? "Retorno" : "Primeira Consulta"
            }
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Carregando dashboard...</p>
                </div>
            </div>
        )
    }

    const totalConsultas = appointments.length
    const totalRelatorios = stats?.totalRelatorios || 0

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {getGreeting()}, {psychologistName}
                        </h1>
                        <p className="text-muted-foreground mt-1">Gerencie suas consultas e acompanhe seus pacientes</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Seção de Agendamentos */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Agendamentos desta Semana</h2>
                            <p className="text-muted-foreground mt-1">Consultas marcadas</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dash-psychologist/availability">
                                <Button size="sm">
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Configurar Disponibilidade
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Cards de Resumo de Agendamentos */}
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <CardDescription>Consultas nesta Semana</CardDescription>
                                </div>
                                <CardTitle className="text-4xl">{totalConsultas}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <CardDescription>Pacientes Únicos</CardDescription>
                                </div>
                                <CardTitle className="text-4xl">
                                    {new Set(appointments.map(apt => apt.employee.user.email)).size}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Galeria de Agendamentos */}
                    {appointments.length > 0 ? (
                        <AppointmentsGallery
                            appointments={formatAppointmentsForGallery()}
                            onView={handleViewConsulta}
                            onEdit={handleEditConsulta}
                            onDelete={handleDeleteConsulta}
                        />
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="font-semibold mb-2">Nenhum agendamento esta semana</h3>
                                <p className="text-muted-foreground mb-4">
                                    Configure seus horários para que funcionários possam agendar consultas
                                </p>
                                <Link href="/dash-psychologist/availability">
                                    <Button>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Configurar Disponibilidade
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Seção de Relatórios */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
                        <p className="text-muted-foreground mt-1">Análise dos estados emocionais dos pacientes</p>
                    </div>

                    {/* Card de Total de Relatórios */}
                    <div className="mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardDescription>Total de Relatórios</CardDescription>
                                </div>
                                <CardTitle className="text-4xl">{totalRelatorios}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Gráfico de Pizza dos Relatórios */}
                    {stats?.reportData && (
                        <div className="mb-6">
                            <ReportsPieChart data={stats.reportData} />
                        </div>
                    )}

                    {/* Tabela de Pacientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pacientes</CardTitle>
                            <CardDescription>Lista de pacientes da empresa e seus resultados</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {patients.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Nenhum paciente encontrado</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Resultado</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patients.map((paciente) => {
                                            const badgeConfig = getReportBadgeVariant(paciente.resultado)
                                            return (
                                                <TableRow key={paciente.id}>
                                                    <TableCell className="font-medium">{paciente.nome}</TableCell>
                                                    <TableCell className="text-muted-foreground">{paciente.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
                                                            {getReportLabel(paciente.resultado)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewReports(paciente.id)}
                                                            disabled={!paciente.hasQuestionario}
                                                        >
                                                            <ClipboardList className="h-4 w-4 mr-2" />
                                                            Ver Relatórios
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
