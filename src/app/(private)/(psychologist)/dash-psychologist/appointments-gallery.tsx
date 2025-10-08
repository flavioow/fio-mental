"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Pencil, Trash2 } from "lucide-react"

interface Appointment {
    id: number
    paciente: string
    data: string
    horario: string
    tipo: string
}

interface AppointmentsGalleryProps {
    appointments: Appointment[]
    onView: (id: number) => void
    onEdit: (id: number) => void
    onDelete: (id: number) => void
}

export function AppointmentsGallery({ appointments, onView, onEdit, onDelete }: AppointmentsGalleryProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + "T00:00:00")
        return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* Cabeçalho do Card */}
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{appointment.paciente}</h3>
                                    <Badge variant={appointment.tipo === "Primeira Consulta" ? "default" : "secondary"}>
                                        {appointment.tipo}
                                    </Badge>
                                </div>
                            </div>

                            {/* Informações de Data e Hora */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(appointment.data)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{appointment.horario}</span>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => onView(appointment.id)}
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Ver
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onEdit(appointment.id)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onDelete(appointment.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
