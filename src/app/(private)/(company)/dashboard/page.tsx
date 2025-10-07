"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreVertical, Pencil, Trash2, UserPlus } from "lucide-react"
import { CompletionChart } from "./completion-chart"
import { CompletionPieChart } from "./completion-pie-chart"

// Dados mockados para demonstração
const initialColaboradores = [
    { id: 1, nome: "Kevin Simões de Souza Lima", email: "kevin.simoes@fiomental.com", concluido: true },
    { id: 2, nome: "Mateus Teixeira de Oliveira", email: "mateus.teixeira@fiomental.com", concluido: false },
    { id: 3, nome: "Alexandre Messias Pivatti", email: "alexandre.pivatti@fiomental.com", concluido: false },
    { id: 4, nome: "Flávio Henrique Perusin de Souza", email: "flavio.perusin@fiomental.com", concluido: true },
    { id: 5, nome: "Eduardo Ramalho", email: "eduardo.ramalho@fiomental.com", concluido: false },
]

export default function DashboardEmpresa() {
    const [colaboradores, setColaboradores] = useState(initialColaboradores)

    const handleRemover = (id: number) => {
        setColaboradores(colaboradores.filter((c) => c.id !== id))
    }

    const handleEditar = (id: number) => {
        console.log("[v0] Editar colaborador:", id)
        // Implementar lógica de edição
    }

    const totalColaboradores = colaboradores.length
    const colaboradoresConcluidos = colaboradores.filter((c) => c.concluido).length
    const percentualConclusao = Math.round((colaboradoresConcluidos / totalColaboradores) * 100)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">Gerencie seus colaboradores e acompanhe o progresso</p>
                        </div>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Adicionar Colaborador
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Cards de Resumo */}
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total de Colaboradores</CardDescription>
                            <CardTitle className="text-4xl">{totalColaboradores}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Cadastros Concluídos</CardDescription>
                            <CardTitle className="text-4xl">{colaboradoresConcluidos}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Taxa de Conclusão</CardDescription>
                            <CardTitle className="text-4xl">{percentualConclusao}%</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Gráficos */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <CompletionChart />
                    <CompletionPieChart
                        concluidos={colaboradoresConcluidos}
                        pendentes={totalColaboradores - colaboradoresConcluidos}
                    />
                </div>

                {/* Tabela de Colaboradores */}
                <Card>
                    <CardHeader>
                        <CardTitle>Colaboradores</CardTitle>
                        <CardDescription>Lista completa de colaboradores e status de cadastro</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {colaboradores.map((colaborador) => (
                                    <TableRow key={colaborador.id}>
                                        <TableCell className="font-medium">{colaborador.nome}</TableCell>
                                        <TableCell className="text-muted-foreground">{colaborador.email}</TableCell>
                                        <TableCell>
                                            {colaborador.concluido ? (
                                                <Badge variant="default" className="bg-success">
                                                    Concluído
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">Pendente</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                        <span className="sr-only">Abrir menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditar(colaborador.id)} className="gap-2">
                                                        <Pencil className="h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRemover(colaborador.id)}
                                                        className="gap-2 text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remover
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
