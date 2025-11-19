"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

// Dados mockados para demonstração
const pacientes = [
    {
        id: 1,
        nome: "Kevin Simões de Souza Lima",
        email: "kevin.simoes@neomental.com",
        resultado: "Alegre",
        status: "completed",
    },
    {
        id: 2,
        nome: "Cauã Rodrigues dos Santos",
        email: "caua.rodrigues@ecommerce.com",
        resultado: "Estressado",
        status: "in-progress",
    },
]

export default function PatientsPage() {
    const router = useRouter()

    const handleViewPatient = (id: number) => {
        router.push(`/patients/${id}`)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
                            <p className="text-muted-foreground mt-1">Visualize e gerencie seus pacientes</p>
                        </div>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Adicionar Paciente
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tabela de Pacientes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Pacientes</CardTitle>
                        <CardDescription>Todos os pacientes cadastrados no sistema</CardDescription>
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
                                {pacientes.map((paciente) => (
                                    <TableRow key={paciente.id}>
                                        <TableCell className="font-medium">{paciente.nome}</TableCell>
                                        <TableCell className="text-muted-foreground">{paciente.email}</TableCell>
                                        <TableCell>{paciente.resultado}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewPatient(paciente.id)}
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver Detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
