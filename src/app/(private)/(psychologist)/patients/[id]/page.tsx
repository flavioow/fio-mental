"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { use } from "react"

// Dados mockados para demonstração
const pacientesData: Record<string, any> = {
    "1": {
        id: 1,
        nome: "Kevin Simões de Souza Lima",
        email: "kevin.simoes@fiomental.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "15/03/2008",
        resultado: "Alegre",
        status: "completed",
        sessoes: 8,
        ultimaSessao: "05/01/2025",
        proximaSessao: "12/01/2025",
        observacoes:
            "Paciente apresenta boa evolução no tratamento. Demonstra maior controle emocional e técnicas de enfrentamento mais eficazes.",
        historico: [
            { data: "05/01/2025", tipo: "Sessão Individual", descricao: "Discussão sobre técnicas de mindfulness" },
            { data: "29/12/2024", tipo: "Sessão Individual", descricao: "Avaliação de progresso mensal" },
            { data: "22/12/2024", tipo: "Sessão Individual", descricao: "Trabalho com ansiedade social" },
        ],
    },
    "2": {
        id: 2,
        nome: "Cauã Rodrigues dos Santos",
        email: "caua.rodrigues@ecommerce.com",
        telefone: "(11) 98765-1234",
        dataNascimento: "22/07/2008",
        resultado: "Estressado",
        status: "in-progress",
        sessoes: 4,
        ultimaSessao: "03/01/2025",
        proximaSessao: "10/01/2025",
        observacoes: "Paciente iniciou tratamento recentemente. Mostra-se estressado às técnicas propostas.",
        historico: [
            { data: "03/01/2025", tipo: "Sessão Individual", descricao: "Introdução a técnicas de respiração" },
            { data: "27/12/2024", tipo: "Sessão Individual", descricao: "Avaliação inicial" },
        ],
    },
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const paciente = pacientesData[resolvedParams.id]

    if (!paciente) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Paciente não encontrado</CardTitle>
                        <CardDescription>O paciente solicitado não existe no sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/patients")} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para Pacientes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <Badge variant="default" className="bg-success">
                        Concluído
                    </Badge>
                )
            case "in-progress":
                return (
                    <Badge variant="default" className="bg-primary">
                        Em Andamento
                    </Badge>
                )
            case "pending":
                return <Badge variant="secondary">Pendente</Badge>
            default:
                return <Badge variant="outline">Desconhecido</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <Button variant="ghost" onClick={() => router.push("/patients")} className="gap-2 mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Pacientes
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{paciente.nome}</h1>
                            <p className="text-muted-foreground mt-1">Detalhes do paciente e histórico de sessões</p>
                        </div>
                        {getStatusBadge(paciente.status)}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                                    <p className="font-medium">{paciente.nome}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{paciente.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Telefone</p>
                                    <p className="font-medium">{paciente.telefone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                    <p className="font-medium">{paciente.dataNascimento}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informações de Tratamento */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações de Tratamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Sessões</p>
                                <p className="text-2xl font-bold">{paciente.sessoes}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Última Sessão</p>
                                <p className="font-medium">{paciente.ultimaSessao}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Próxima Sessão</p>
                                <p className="font-medium">{paciente.proximaSessao}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status do Tratamento</p>
                                <div className="mt-1">{getStatusBadge(paciente.status)}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Observações */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Observações Clínicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{paciente.observacoes}</p>
                    </CardContent>
                </Card>

                {/* Histórico de Sessões */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Histórico de Sessões</CardTitle>
                        <CardDescription>Registro das últimas sessões realizadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {paciente.historico.map((sessao: any, index: number) => (
                                <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium">{sessao.tipo}</p>
                                            <p className="text-sm text-muted-foreground">{sessao.data}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{sessao.descricao}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
