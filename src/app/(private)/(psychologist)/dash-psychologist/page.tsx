"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Users, FileText, Plus, Eye, Pencil, Trash2, ClipboardList } from "lucide-react"
import { ReportsPieChart } from "./reports-pie-chart"
import { AppointmentsGallery } from "./appointments-gallery"

// Tipos de relatórios
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

// Dados mockados para demonstração
const agendamentos = [
    { id: 1, paciente: "Ana Silva", data: "2025-10-06", horario: "09:00", tipo: "Primeira Consulta" },
    { id: 2, paciente: "Carlos Santos", data: "2025-10-06", horario: "10:30", tipo: "Retorno" },
    { id: 3, paciente: "Beatriz Lima", data: "2025-10-07", horario: "14:00", tipo: "Retorno" },
    { id: 4, paciente: "Diego Oliveira", data: "2025-10-07", horario: "11:00", tipo: "Primeira Consulta" },
    { id: 5, paciente: "Eduarda Costa", data: "2025-10-08", horario: "13:30", tipo: "Retorno" },
    { id: 6, paciente: "Felipe Alves", data: "2025-10-09", horario: "09:30", tipo: "Retorno" },
]

const pacientes = [
    { id: 1, nome: "Ana Silva", email: "ana.silva@email.com", resultado: "engajado" as ReportType },
    { id: 2, nome: "Carlos Santos", email: "carlos.santos@email.com", resultado: "estressado" as ReportType },
    { id: 3, nome: "Beatriz Lima", email: "beatriz.lima@email.com", resultado: "equilibrado" as ReportType },
    { id: 4, nome: "Diego Oliveira", email: "diego.oliveira@email.com", resultado: "ansioso" as ReportType },
    { id: 5, nome: "Eduarda Costa", email: "eduarda.costa@email.com", resultado: "motivado" as ReportType },
    { id: 6, nome: "Felipe Alves", email: "felipe.alves@email.com", resultado: "burnout" as ReportType },
    { id: 7, nome: "Gabriela Rocha", email: "gabriela.rocha@email.com", resultado: "resiliente" as ReportType },
    { id: 8, nome: "Henrique Martins", email: "henrique.martins@email.com", resultado: "confiante" as ReportType },
    { id: 9, nome: "Flávio Henrique Perusin de Souza", email: "flavio.perusin@fiomental.com", resultado: "desmotivado" as ReportType },
]

const reportData = [
    { tipo: "Engajado", quantidade: 12, fill: "var(--chart-1)" },
    { tipo: "Motivado", quantidade: 8, fill: "var(--chart-2)" },
    { tipo: "Resiliente", quantidade: 6, fill: "var(--chart-3)" },
    { tipo: "Estressado", quantidade: 15, fill: "var(--chart-4)" },
    { tipo: "Burnout", quantidade: 5, fill: "var(--destructive)" },
    { tipo: "Desmotivado", quantidade: 7, fill: "var(--secondary-foreground)" },
    { tipo: "Equilibrado", quantidade: 18, fill: "var(--primary)" },
    { tipo: "Ansioso", quantidade: 11, fill: "var(--chart-5)" },
    { tipo: "Confiante", quantidade: 9, fill: "hsl(142 76% 36%)" },
]

const getReportBadgeVariant = (tipo: ReportType) => {
    const variants: Record<
        ReportType,
        { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
    > = {
        engajado: { variant: "default", className: "bg-chart-1" },
        motivado: { variant: "default", className: "bg-chart-2" },
        resiliente: { variant: "default", className: "bg-chart-3" },
        estressado: { variant: "default", className: "bg-chart-4" },
        burnout: { variant: "destructive", className: "text-background dark:text-foreground" },
        desmotivado: { variant: "secondary" },
        equilibrado: { variant: "default", className: "bg-primary" },
        ansioso: { variant: "default", className: "var(--chart-5)" },
        confiante: { variant: "default", className: "hsl(142 76% 36%)" },
    }
    return variants[tipo]
}

const getReportLabel = (tipo: ReportType) => {
    const labels: Record<ReportType, string> = {
        engajado: "Engajado",
        motivado: "Motivado",
        resiliente: "Resiliente",
        estressado: "Estressado",
        burnout: "Burnout",
        desmotivado: "Desmotivado/Desengajado",
        equilibrado: "Equilibrado",
        ansioso: "Ansioso",
        confiante: "Confiante/Autônomo",
    }
    return labels[tipo]
}

export default function DashboardPsicologo() {
    const [appointments, setAppointments] = useState(agendamentos)

    const totalConsultas = appointments.length
    const pacientesAtendidos = new Set(appointments.map((a) => a.paciente)).size - 1
    const totalRelatorios = reportData.reduce((acc, curr) => acc + curr.quantidade, 0)

    const handleAddConsulta = () => {
        console.log("[v0] Adicionar consulta")
    }

    const handleViewConsulta = (id: number) => {
        console.log("[v0] Ver consulta:", id)
    }

    const handleEditConsulta = (id: number) => {
        console.log("[v0] Editar consulta:", id)
    }

    const handleDeleteConsulta = (id: number) => {
        setAppointments(appointments.filter((a) => a.id !== id))
    }

    const handleViewReports = (id: number) => {
        console.log("[v0] Ver relatórios do paciente:", id)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Boa tarde, Gustavo B.</h1>
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
                            <p className="text-muted-foreground mt-1">Consultas marcadas de 13/01 a 19/01</p>
                        </div>
                        <div className="flex gap-2">
                            <a href="/reports-psychologist">
                                <Button variant="outline" size="sm" onClick={() => handleViewConsulta(0)}>
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
                    <div className="mb-6">
                        <ReportsPieChart data={reportData} />
                    </div>

                    {/* Tabela de Pacientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pacientes</CardTitle>
                            <CardDescription>Lista de pacientes e seus resultados mais recentes</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                    {pacientes.map((paciente) => {
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
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewReports(paciente.id)}>
                                                        <ClipboardList className="h-4 w-4 mr-2" />
                                                        Ver Relatórios
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
