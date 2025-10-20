"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, ClipboardList, Loader2, AlertCircle, CheckCircle2, Clock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Appointment {
    id: number
    date: string
    startTime: string
    endTime: string
    status: string
    psychologist: {
        name: string
        email: string
    }
}

interface PerfilPsicologico {
    tipo: string
    perfilPrincipal: string
    diagnostico: string
    recomendacoes: string[]
}

interface Profile {
    id: number
    name: string
    email: string
    telefone: string | null
    company: string
    hasQuestionario: boolean
    questionarioData: string | null
    resultado: string | null
    perfilPsicologico: PerfilPsicologico | null
    appointments: Appointment[]
}

const getResultBadgeConfig = (tipo: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive"; className?: string }> = {
        engajado: { variant: "default", className: "bg-chart-1" },
        motivado: { variant: "default", className: "bg-chart-2" },
        resiliente: { variant: "default", className: "bg-chart-3" },
        estressado: { variant: "default", className: "bg-chart-4" },
        burnout: { variant: "destructive" },
        desmotivado: { variant: "secondary" },
        equilibrado: { variant: "default", className: "bg-primary" },
        ansioso: { variant: "default", className: "bg-chart-5" },
        confiante: { variant: "default", className: "bg-green-600" },
    }
    return configs[tipo] || { variant: "secondary" }
}

const getResultLabel = (tipo: string) => {
    const labels: Record<string, string> = {
        engajado: "Engajado",
        motivado: "Motivado",
        resiliente: "Resiliente",
        estressado: "Estressado",
        burnout: "Burnout",
        desmotivado: "Desmotivado",
        equilibrado: "Equilibrado",
        ansioso: "Ansioso",
        confiante: "Confiante",
    }
    return labels[tipo] || tipo
}

export default function DashboardEmployee() {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/employee/profile")
            const data = await res.json()

            if (data.success) {
                setProfile(data.profile)
            } else {
                alert(data.error || "Erro ao carregar perfil")
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err)
            alert("Erro ao carregar dados")
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Erro ao carregar dados</CardTitle>
                        <CardDescription>Não foi possível carregar suas informações</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={loadProfile}>Tentar Novamente</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {getGreeting()}, {profile.name}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {profile.company}
                        </p>
                    </div>
                </div>
            </div>

            <div className="content-grid py-8 space-y-6">
                <div className="flex flex-row items-start gap-4 relative">
                    <div className="flex flex-col gap-4 sticky top-4">
                        {/* Seção de Resultado do Questionário */}
                        {profile.hasQuestionario && profile.perfilPsicologico ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    Resultado do Questionário
                                                </CardTitle>
                                                <CardDescription>
                                                    Última avaliação: {formatDate(profile.questionarioData!)}
                                                </CardDescription>
                                            </div>
                                            <Badge {...getResultBadgeConfig(profile.resultado!)}>
                                                {getResultLabel(profile.resultado!)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold mb-2">Perfil Identificado</h3>
                                                <p className="text-muted-foreground">
                                                    {profile.perfilPsicologico.perfilPrincipal}
                                                </p>
                                            </div>
                                            {profile.perfilPsicologico.diagnostico && (
                                                <div>
                                                    <h3 className="font-semibold mb-2">Análise</h3>
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {profile.perfilPsicologico.diagnostico}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="pt-4">
                                                <Link href="/quiz">
                                                    <Button variant="outline" size="sm">
                                                        <ClipboardList className="h-4 w-4 mr-2" />
                                                        Refazer Questionário
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {/* Ações Recomendadas */}
                                {profile.perfilPsicologico.recomendacoes && profile.perfilPsicologico.recomendacoes.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-primary" />
                                                Ações Recomendadas
                                            </CardTitle>
                                            <CardDescription>
                                                Sugestões baseadas no seu perfil para melhorar seu bem-estar
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                {profile.perfilPsicologico.recomendacoes.map((rec, index) => (
                                                    <li key={index} className="flex gap-3">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <span className="text-sm font-semibold text-primary">{index + 1}</span>
                                                        </div>
                                                        <p className="text-muted-foreground flex-1">{rec}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                        Questionário Pendente
                                    </CardTitle>
                                    <CardDescription>
                                        Complete o questionário para receber uma análise personalizada
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Alert className="mb-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            O questionário ajuda a identificar seu perfil psicológico e fornece recomendações
                                            personalizadas para melhorar seu bem-estar no trabalho.
                                        </AlertDescription>
                                    </Alert>
                                    <Link href="/quiz">
                                        <Button className="w-full sm:w-auto">
                                            <ClipboardList className="h-4 w-4 mr-2" />
                                            Realizar Questionário
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 sticky top-4">
                        {/* Seção de Agendamento */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Agendar Consulta
                                </CardTitle>
                                <CardDescription>
                                    Marque uma consulta com um dos psicólogos da empresa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">
                                        Nossos psicólogos estão disponíveis para atendê-lo. Escolha o melhor horário e
                                        profissional para suas necessidades.
                                    </p>
                                    <Link href="/dash-employee/schedule">
                                        <Button className="w-full sm:w-auto">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Agendar Nova Consulta
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Próximas Consultas */}
                        {profile.appointments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Próximas Consultas
                                    </CardTitle>
                                    <CardDescription>
                                        Suas consultas agendadas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {profile.appointments.map((apt) => (
                                            <div
                                                key={apt.id}
                                                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div>
                                                            <p className="font-semibold">{apt.psychologist.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {apt.psychologist.email}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline">{apt.status}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(apt.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{apt.startTime} - {apt.endTime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
