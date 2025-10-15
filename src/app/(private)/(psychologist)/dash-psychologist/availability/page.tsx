"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Plus, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface TimeSlot {
    dayOfWeek: number
    startTime: string
    endTime: string
}

const daysOfWeek = [
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
    { value: 0, label: "Domingo" },
]

export default function AvailabilityPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

    useEffect(() => {
        loadAvailability()
    }, [])

    const loadAvailability = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/psychologist/availability")
            const data = await res.json()

            if (data.success && data.availability) {
                setTimeSlots(data.availability)
                const days = [...new Set<number>(data.availability.map((a: any) => a.dayOfWeek))]
                setSelectedDays(days)
            }
        } catch (err) {
            console.error("Erro ao carregar disponibilidade:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDayToggle = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day))
            setTimeSlots(timeSlots.filter(slot => slot.dayOfWeek !== day))
        } else {
            setSelectedDays([...selectedDays, day])
            setTimeSlots([...timeSlots, { dayOfWeek: day, startTime: "09:00", endTime: "18:00" }])
        }
    }

    const addTimeSlot = (day: number) => {
        setTimeSlots([...timeSlots, { dayOfWeek: day, startTime: "09:00", endTime: "18:00" }])
    }

    const removeTimeSlot = (index: number) => {
        const newSlots = timeSlots.filter((_, i) => i !== index)
        setTimeSlots(newSlots)

        // Remove o dia se não houver mais slots
        const slot = timeSlots[index]
        if (!newSlots.some(s => s.dayOfWeek === slot.dayOfWeek)) {
            setSelectedDays(selectedDays.filter(d => d !== slot.dayOfWeek))
        }
    }

    const updateTimeSlot = (index: number, field: "startTime" | "endTime", value: string) => {
        const newSlots = [...timeSlots]
        newSlots[index][field] = value
        setTimeSlots(newSlots)
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const res = await fetch("/api/psychologist/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ availability: timeSlots })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Erro ao salvar disponibilidade")
                return
            }

            alert("Disponibilidade salva com sucesso!")
        } catch (err) {
            console.error("Erro ao salvar:", err)
            alert("Erro ao salvar disponibilidade")
        } finally {
            setSaving(false)
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
                    <Button variant="ghost" onClick={() => router.push("/dash-psychologist")} className="gap-2 mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao Dashboard
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Configurar Disponibilidade</h1>
                        <p className="text-muted-foreground mt-1">Defina seus horários de atendimento</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Seleção de Dias */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Dias da Semana</CardTitle>
                        <CardDescription>Selecione os dias em que você pode atender</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {daysOfWeek.map((day) => (
                                <div key={day.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`day-${day.value}`}
                                        checked={selectedDays.includes(day.value)}
                                        onCheckedChange={() => handleDayToggle(day.value)}
                                    />
                                    <label
                                        htmlFor={`day-${day.value}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {day.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Horários por Dia */}
                {selectedDays.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Horários de Atendimento</CardTitle>
                            <CardDescription>Defina os horários para cada dia selecionado</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {daysOfWeek
                                .filter(day => selectedDays.includes(day.value))
                                .map((day) => {
                                    const daySlots = timeSlots.filter(slot => slot.dayOfWeek === day.value)

                                    return (
                                        <div key={day.value} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold">{day.label}</h3>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addTimeSlot(day.value)}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Adicionar Horário
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {daySlots.map((slot, index) => {
                                                    const globalIndex = timeSlots.indexOf(slot)
                                                    return (
                                                        <div key={index} className="flex items-center gap-3">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <div className="flex-1">
                                                                    <Label className="text-xs text-muted-foreground">Início</Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={slot.startTime}
                                                                        onChange={(e) => updateTimeSlot(globalIndex, "startTime", e.target.value)}
                                                                    />
                                                                </div>
                                                                <span className="text-muted-foreground pt-5">até</span>
                                                                <div className="flex-1">
                                                                    <Label className="text-xs text-muted-foreground">Fim</Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={slot.endTime}
                                                                        onChange={(e) => updateTimeSlot(globalIndex, "endTime", e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeTimeSlot(globalIndex)}
                                                                className="mt-5"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                        </CardContent>
                    </Card>
                )}

                {/* Botão Salvar */}
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} disabled={saving || selectedDays.length === 0}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar Disponibilidade"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
