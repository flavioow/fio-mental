"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Users, FileText, Plus, Eye, Loader2, ClipboardList } from "lucide-react"
import { ReportsPieChart } from "./reports-pie-chart"
import { AppointmentsGallery } from "./appointments-gallery"
import { useRouter } from "next/navigation"

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

// Dados mockados de agendamentos (pode ser movido para API depois)
const agendamentosMock = [
    { id: 1, paciente: "Lewis Hamilton", data: "2025-10-06", horario: "09:00", tipo: "Primeira Consulta" },
    { id: 2, paciente: "Carlos Sains", data: "2025-10-06", horario: "10:30", tipo: "Retorno" },
    { id: 3, paciente: "Alexander Albon", data: "2025-10-07", horario: "14:00", tipo: "Retorno" },
    { id: 4, paciente: "Max Verstappen", data: "2025-10-07", horario: "11:00", tipo: "Primeira Consulta" },
    { id: 5, paciente: "Gabriel Bortoleto", data: "2025-10-08", horario: "13:30", tipo: "Retorno" },
    { id: 6, paciente: "Charles Leclerc", data: "2025-10-09", horario: "09:30", tipo: "Retorno" },
]

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
        confiante: { variant: "default", className: "bg-success" },
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

    const [appointments, setAppointments] = useState(agendamentosMock)
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

            // Busca pacientes
            const patientsRes = await fetch("/api/patients")
            const patientsData = await patientsRes.json()

            // Busca estatísticas
            const statsRes = await fetch("/api/psychologist/stats")
            const statsData = await statsRes.json()

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

    const handleAddConsulta = () => {
        alert("Funcionalidade de agendamento em desenvolvimento")
    }

    const handleViewConsulta = (id: number) => {
        console.log("Ver consulta:", id)
    }

    const handleEditConsulta = (id: number) => {
        console.log("Editar consulta:", id)
    }

    const handleDeleteConsulta = (id: number) => {
        setAppointments(appointments.filter((a) => a.id !== id))
    }

    const handleViewReports = (id: number) => {
        router.push(`/patients/${id}`)
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
    const pacientesAtendidos = stats?.pacientesAtendidos || 0
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
                            <a href="/reports-psychologist">
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Todas
                                </Button>
                            </a>
                            <Button size="sm" onClick={handleAddConsulta}>
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar
                            </Button>
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
                                    <CardDescription>Pacientes Atendidos</CardDescription>
                                </div>
                                <CardTitle className="text-4xl">{pacientesAtendidos}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Galeria de Agendamentos */}
                    <AppointmentsGallery
                        appointments={appointments}
                        onView={handleViewConsulta}
                        onEdit={handleEditConsulta}
                        onDelete={handleDeleteConsulta}
                    />
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
