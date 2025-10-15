"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreVertical, Pencil, Trash2, UserPlus, Loader2 } from "lucide-react"
import { CompletionChart } from "./completion-chart"
import { CompletionPieChart } from "./completion-pie-chart"
import Link from "next/link"

interface Employee {
    id: number
    nome: string
    email: string
    telefone?: string | null
    cpf?: string
    concluido: boolean
    employeeId?: number
}

interface DashboardStats {
    totalEmployees: number
    completedEmployees: number
    pendingEmployees: number
    completionRate: number
    monthlyData: Array<{ mes: string; conclusoes: number }>
}

export default function DashboardEmpresa() {
    const [colaboradores, setColaboradores] = useState<Employee[]>([])
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [removing, setRemoving] = useState<number | null>(null)
    const [companyName, setCompanyName] = useState("Empresa")

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
                setCompanyName(userData.user?.name || "Empresa")
            }

            // Busca colaboradores
            const employeesRes = await fetch("/api/employees")
            const employeesData = await employeesRes.json()

            // Busca estatísticas
            const statsRes = await fetch("/api/dashboard/stats")
            const statsData = await statsRes.json()

            if (employeesData.success) {
                setColaboradores(employeesData.employees)
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

    const handleRemover = async (id: number) => {
        if (!confirm("Tem certeza que deseja remover este colaborador?")) {
            return
        }

        try {
            setRemoving(id)
            const res = await fetch(`/api/employees?id=${id}`, {
                method: "DELETE",
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Erro ao remover colaborador")
                return
            }

            // Remove da lista local
            setColaboradores(colaboradores.filter((c) => c.id !== id))

            // Recarrega estatísticas
            loadData()
        } catch (err) {
            console.error("Erro ao remover:", err)
            alert("Erro inesperado ao remover colaborador")
        } finally {
            setRemoving(null)
        }
    }

    const handleEditar = (id: number) => {
        console.log("Editar colaborador:", id)
        // TODO: Implementar lógica de edição
        alert("Funcionalidade de edição em desenvolvimento")
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

    const totalColaboradores = stats?.totalEmployees || 0
    const colaboradoresConcluidos = stats?.completedEmployees || 0
    const percentualConclusao = stats?.completionRate || 0

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{getGreeting()}, {companyName}</h1>
                            <p className="text-muted-foreground mt-1">Gerencie seus colaboradores e acompanhe o progresso</p>
                        </div>
                        <Link href="/register/employee">
                            <Button className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Adicionar Colaborador
                            </Button>
                        </Link>
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
                    <CompletionChart data={stats?.monthlyData || []} />
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
                        {colaboradores.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">Nenhum colaborador cadastrado ainda</p>
                                <Link href="/register/employee">
                                    <Button>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Adicionar Primeiro Colaborador
                                    </Button>
                                </Link>
                            </div>
                        ) : (
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
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={removing === colaborador.id}
                                                        >
                                                            {removing === colaborador.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreVertical className="h-4 w-4" />
                                                            )}
                                                            <span className="sr-only">Abrir menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditar(colaborador.id)}
                                                            className="gap-2"
                                                        >
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
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
