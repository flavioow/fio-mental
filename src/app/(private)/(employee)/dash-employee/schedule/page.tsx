"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Loader2,
    CheckCircle2
} from "lucide-react"
import { useRouter } from "next/navigation"

interface AvailabilitySlot {
    dayOfWeek: number
    startTime: string // "HH:mm"
    endTime: string // "HH:mm"
}

interface Psychologist {
    id: number
    nome: string
    email?: string
    crp?: string
    tempoAtuacao?: number | null
    descricao?: string | null
    companyId?: number
    availability: AvailabilitySlot[]
}

const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
]

export default function ScheduleAppointmentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [psychologists, setPsychologists] = useState<Psychologist[]>([])
    const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [notes, setNotes] = useState("")
    const [scheduling, setScheduling] = useState(false)
    const [error, setError] = useState("")
    const [employeeCompanyId, setEmployeeCompanyId] = useState<number | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    // Carrega dados: tenta buscar companyId do funcionário e lista de psicólogos
    const loadData = async () => {
        setLoading(true)
        setError("")
        try {
            // Tenta buscar employee para obter companyId (se existir endpoint)
            try {
                const empRes = await fetch("/api/employee")
                if (empRes.ok) {
                    const empData = await empRes.json()
                    if (empData?.success && typeof empData.employee?.companyId === "number") {
                        setEmployeeCompanyId(empData.employee.companyId)
                    } else if (empData?.companyId) {
                        setEmployeeCompanyId(empData.companyId)
                    }
                } else {
                    // se 404/401 etc, seguimos sem companyId (não é crítico)
                    console.info("Nenhum /api/employee disponível ou sem companyId — seguindo sem filtro.")
                }
            } catch (e) {
                console.info("Falha ao buscar /api/employee — seguindo sem filtro.", e)
            }

            // Busca psicólogos
            const res = await fetch("/api/psychologist")
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || "Erro ao carregar psicólogos")
            }
            const data = await res.json()

            if (data.success && Array.isArray(data.psychologists)) {
                let list: Psychologist[] = data.psychologists

                // Se o backend retornar companyId em cada psicólogo e tivermos companyId do employee,
                // filtramos para mostrar só os psicólogos da mesma empresa.
                if (employeeCompanyId !== null) {
                    list = list.filter(p => p.companyId === employeeCompanyId)
                }

                // Ordena por nome
                list.sort((a, b) => a.nome.localeCompare(b.nome))
                setPsychologists(list)
            } else {
                throw new Error("Resposta inválida do servidor ao buscar psicólogos")
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Erro inesperado"
            console.error("Erro carregar dados:", msg)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    // retorna dias da semana disponíveis para um psicólogo (ordenado)
    const getAvailableDays = (psychologist: Psychologist) => {
        const days = [...new Set(psychologist.availability.map(a => a.dayOfWeek))]
        return days.sort((a, b) => a - b)
    }

    // Gera horários de 30 em 30 minutos para o dia informado, usando UTC (evita problemas timezone)
    const getAvailableTimes = (psychologist: Psychologist, date: string) => {
        if (!date) return []

        // Normaliza data como UTC midnight
        const selectedDate = new Date(date + "T00:00:00Z")
        const dayOfWeek = selectedDate.getUTCDay()

        const dayAvailability = psychologist.availability.filter(a => a.dayOfWeek === dayOfWeek)
        const times: string[] = []

        dayAvailability.forEach(slot => {
            const [startHour, startMin] = slot.startTime.split(":").map(Number)
            const [endHour, endMin] = slot.endTime.split(":").map(Number)

            let currentHour = startHour
            let currentMin = startMin

            // Gera slots de 30 minutos; garante que uma consulta de 30 min caiba totalmente antes do endTime
            while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
                const startInMin = currentHour * 60 + currentMin
                const endIfStart = startInMin + 30
                const slotEndInMin = endHour * 60 + endMin

                if (endIfStart <= slotEndInMin) {
                    times.push(`${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`)
                } else {
                    // se não cabe 30min, termina
                    break
                }

                // avança 30 minutos
                currentMin += 30
                if (currentMin >= 60) {
                    currentMin = 0
                    currentHour++
                }
            }
        })

        // Remover duplicatas e ordenar
        const unique = Array.from(new Set(times))
        unique.sort()
        return unique
    }

    // Retorna as próximas datas disponíveis (até 30 datas nos próximos X dias)
    const getNextAvailableDates = (psychologist: Psychologist) => {
        const availableDays = getAvailableDays(psychologist)
        const dates: string[] = []
        const today = new Date()
        // zera horas para evitar efeitos
        today.setHours(0, 0, 0, 0)

        // Começa do dia seguinte (i = 1) para evitar agendamento no mesmo dia cedo
        for (let i = 1; i <= 90; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() + i)
            // usar getUTCDay com ISO string do dia em UTC
            const utcDay = new Date(date.toISOString().split("T")[0] + "T00:00:00Z").getUTCDay()
            if (availableDays.includes(utcDay)) {
                dates.push(date.toISOString().split("T")[0])
            }
            if (dates.length >= 30) break
        }

        return dates
    }

    const handleSchedule = async () => {
        setError("")
        if (!selectedPsychologist || !selectedDate || !selectedTime) {
            setError("Por favor, preencha todos os campos obrigatórios")
            return
        }

        try {
            setScheduling(true)

            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    psychologistId: selectedPsychologist.id,
                    date: selectedDate, // formato YYYY-MM-DD
                    time: selectedTime, // HH:mm
                    notes
                })
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok) {
                const msg = data?.error || "Erro ao agendar consulta"
                setError(msg)
                return
            }

            // sucesso
            alert("Consulta agendada com sucesso!")
            router.push("/dash-employee")
        } catch (err) {
            console.error("Erro ao agendar:", err)
            setError("Erro ao agendar consulta")
        } finally {
            setScheduling(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <Button variant="ghost" onClick={() => router.push("/dash-employee")} className="gap-2 mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao Dashboard
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Agendar Consulta</h1>
                        <p className="text-muted-foreground mt-1">Escolha um psicólogo e horário para sua consulta</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Mensagem de Erro */}
                {error && (
                    <Card className="mb-6 border-destructive">
                        <CardContent className="pt-6">
                            <p className="text-sm text-destructive">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {psychologists.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-semibold mb-2">Nenhum psicólogo disponível</h3>
                            <p className="text-muted-foreground">
                                Não há psicólogos cadastrados na sua empresa no momento.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Lista de Psicólogos */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Escolha o Psicólogo</h2>
                            {psychologists.map((psych) => {
                                const availableDays = getAvailableDays(psych)
                                const hasAvailability = availableDays.length > 0

                                return (
                                    <Card
                                        key={psych.id}
                                        className={`cursor-pointer transition-all ${selectedPsychologist?.id === psych.id
                                            ? "ring-2 ring-primary"
                                            : "hover:shadow-md"
                                            }`}
                                        onClick={() => {
                                            setSelectedPsychologist(psych)
                                            setSelectedDate("")
                                            setSelectedTime("")
                                            setError("")
                                        }}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{psych.nome}</CardTitle>
                                                    <CardDescription>CRP: {psych.crp ?? "—"}</CardDescription>
                                                </div>
                                                {selectedPsychologist?.id === psych.id && (
                                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {psych.tempoAtuacao && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {psych.tempoAtuacao} anos de experiência
                                                </p>
                                            )}
                                            {psych.descricao && (
                                                <p className="text-sm text-muted-foreground mb-3">{psych.descricao}</p>
                                            )}
                                            {hasAvailability ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {availableDays.map(day => (
                                                        <Badge key={day} variant="secondary" className="text-xs">
                                                            {daysOfWeek[day]}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">
                                                    Sem disponibilidade cadastrada
                                                </Badge>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Seleção de Data e Hora */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Escolha Data e Horário</h2>

                            {selectedPsychologist ? (
                                <>
                                    {/* Data */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Selecione a Data
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <select
                                                className="w-full border rounded px-3 py-2 bg-background text-foreground"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setSelectedDate(e.target.value)
                                                    setSelectedTime("")
                                                    setError("")
                                                }}
                                            >
                                                <option value="">Escolha uma data</option>
                                                {getNextAvailableDates(selectedPsychologist).map(date => {
                                                    const d = new Date(date + "T00:00:00Z")
                                                    return (
                                                        <option key={date} value={date}>
                                                            {d.toLocaleDateString("pt-BR", {
                                                                weekday: "long",
                                                                day: "2-digit",
                                                                month: "long"
                                                            })}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </CardContent>
                                    </Card>

                                    {/* Horário */}
                                    {selectedDate && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Selecione o Horário
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {getAvailableTimes(selectedPsychologist, selectedDate).length === 0 ? (
                                                        <div className="col-span-3 text-sm text-muted-foreground">
                                                            Nenhum horário disponível neste dia.
                                                        </div>
                                                    ) : (
                                                        getAvailableTimes(selectedPsychologist, selectedDate).map(time => (
                                                            <Button
                                                                key={time}
                                                                variant={selectedTime === time ? "default" : "outline"}
                                                                className="w-full"
                                                                onClick={() => {
                                                                    setSelectedTime(time)
                                                                    setError("")
                                                                }}
                                                            >
                                                                {time}
                                                            </Button>
                                                        ))
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Observações */}
                                    {selectedDate && selectedTime && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Observações (Opcional)</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Label htmlFor="notes" className="text-sm text-muted-foreground">
                                                    Descreva brevemente o motivo da consulta
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Ex: Estou sentindo ansiedade no trabalho..."
                                                    rows={4}
                                                    className="mt-2"
                                                />
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Botão Agendar */}
                                    {selectedDate && selectedTime && (
                                        <Button
                                            className="w-full"
                                            onClick={handleSchedule}
                                            disabled={scheduling}
                                        >
                                            {scheduling ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Agendando...
                                                </>
                                            ) : (
                                                "Confirmar Agendamento"
                                            )}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            Selecione um psicólogo para ver os horários disponíveis
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
