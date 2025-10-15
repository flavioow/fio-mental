"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Mail, Phone, User, Building2, Loader2, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { use } from "react"

interface Patient {
    id: number
    nome: string
    email: string
    telefone?: string | null
    cpf: string
    empresa: string
    resultado: string
    hasQuestionario: boolean
    perfilPsicologico: any
    questionario: any
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [patient, setPatient] = useState<Patient | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPatient()
    }, [])

    const loadPatient = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/patients/${resolvedParams.id}`)
            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Erro ao carregar paciente")
                router.push("/dash-psychologist")
                return
            }

            setPatient(data.patient)
        } catch (err) {
            console.error("Erro ao carregar paciente:", err)
            alert("Erro ao carregar dados do paciente")
            router.push("/dash-psychologist")
        } finally {
            setLoading(false)
        }
    }

    const getResultadoBadge = (resultado: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
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

        const config = variants[resultado.toLowerCase()] || { variant: "secondary" }
        return <Badge variant={config.variant} className={config.className}>{resultado}</Badge>
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Carregando dados do paciente...</p>
                </div>
            </div>
        )
    }

    if (!patient) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Paciente não encontrado</CardTitle>
                        <CardDescription>O paciente solicitado não existe no sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/dash-psychologist")} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar ao Dashboard
                        </Button>
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
                    <Button variant="ghost" onClick={() => router.push("/dash-psychologist")} className="gap-2 mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao Dashboard
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{patient.nome}</h1>
                            <p className="text-muted-foreground mt-1">Detalhes do paciente e relatório psicológico</p>
                        </div>
                        {getResultadoBadge(patient.resultado)}
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
                                    <p className="font-medium">{patient.nome}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{patient.email}</p>
                                </div>
                            </div>
                            {patient.telefone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Telefone</p>
                                        <p className="font-medium">{patient.telefone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Empresa</p>
                                    <p className="font-medium">{patient.empresa}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">CPF</p>
                                    <p className="font-medium">{patient.cpf}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status do Questionário */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status do Questionário</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <div className="mt-2">
                                    {patient.hasQuestionario ? (
                                        <Badge variant="default" className="bg-success">Questionário Completo</Badge>
                                    ) : (
                                        <Badge variant="outline">Questionário Pendente</Badge>
                                    )}
                                </div>
                            </div>
                            {patient.questionario && (
                                <>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Data de Preenchimento</p>
                                        <p className="font-medium">{formatDate(patient.questionario.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Perfil Identificado</p>
                                        <div className="mt-2">{getResultadoBadge(patient.resultado)}</div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {patient.hasQuestionario && patient.perfilPsicologico && (
                    <>
                        {/* Análise Psicológica */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Análise Psicológica (IA)</CardTitle>
                                <CardDescription>Resultado gerado automaticamente com base nas respostas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {patient.perfilPsicologico.descricao && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Descrição do Perfil</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {patient.perfilPsicologico.descricao}
                                            </p>
                                        </div>
                                    )}
                                    {patient.perfilPsicologico.recomendacoes && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Recomendações</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {patient.perfilPsicologico.recomendacoes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Respostas do Questionário */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Respostas do Questionário</CardTitle>
                                <CardDescription>Todas as respostas fornecidas pelo paciente</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {patient.questionario.escalaEstresse !== null && (
                                        <div>
                                            <p className="font-medium mb-1">Escala de Estresse (1-10)</p>
                                            <p className="text-muted-foreground">{patient.questionario.escalaEstresse}</p>
                                        </div>
                                    )}

                                    {patient.questionario.motivoEstresse && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Principal motivo de estresse no trabalho</p>
                                                <p className="text-muted-foreground">{patient.questionario.motivoEstresse}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.equilibrio && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Como mantém o equilíbrio emocional</p>
                                                <p className="text-muted-foreground">{patient.questionario.equilibrio}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.reacaoProblema && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Reação diante de problemas inesperados</p>
                                                <p className="text-muted-foreground">{patient.questionario.reacaoProblema}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.espacoBemEstar && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Espaço para bem-estar na empresa</p>
                                                <p className="text-muted-foreground">{patient.questionario.espacoBemEstar}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.motivacao && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">O que mais motiva no trabalho</p>
                                                <p className="text-muted-foreground">{patient.questionario.motivacao}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.desmotivacao && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">O que mais desmotiva no trabalho</p>
                                                <p className="text-muted-foreground">{patient.questionario.desmotivacao}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.melhorHorario && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Melhor horário para trabalhar</p>
                                                <p className="text-muted-foreground">{patient.questionario.melhorHorario}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.focoColaborativo && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Preferência de trabalho</p>
                                                <p className="text-muted-foreground">{patient.questionario.focoColaborativo}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.satisfacao && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Satisfação com o trabalho atual</p>
                                                <p className="text-muted-foreground">{patient.questionario.satisfacao}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.pedirAjuda && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Facilidade para pedir ajuda</p>
                                                <p className="text-muted-foreground">{patient.questionario.pedirAjuda}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.conflitos && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Como lida com conflitos</p>
                                                <p className="text-muted-foreground">{patient.questionario.conflitos}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.senteOuvido && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Se sente ouvido pela equipe</p>
                                                <p className="text-muted-foreground">{patient.questionario.senteOuvido}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.ouvido && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Escuta ativamente os colegas</p>
                                                <p className="text-muted-foreground">{patient.questionario.ouvido}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.tipoColega && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Como se descreveria como colega</p>
                                                <p className="text-muted-foreground">{patient.questionario.tipoColega}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.ambienteCalmo && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Considera o ambiente de trabalho calmo</p>
                                                <p className="text-muted-foreground">{patient.questionario.ambienteCalmo}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.habilidades && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Reconhecimento das habilidades</p>
                                                <p className="text-muted-foreground">{patient.questionario.habilidades}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.oportunidades && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Oportunidades de crescimento</p>
                                                <p className="text-muted-foreground">{patient.questionario.oportunidades}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.confianca && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Confiança na liderança</p>
                                                <p className="text-muted-foreground">{patient.questionario.confianca}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.palavra && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">Uma palavra para descrever o trabalho</p>
                                                <p className="text-muted-foreground">{patient.questionario.palavra}</p>
                                            </div>
                                        </>
                                    )}

                                    {patient.questionario.mudanca && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-1">O que mudaria na empresa</p>
                                                <p className="text-muted-foreground">{patient.questionario.mudanca}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {!patient.hasQuestionario && (
                    <Card className="mt-6">
                        <CardContent className="py-8 text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-semibold mb-2">Questionário Pendente</h3>
                            <p className="text-muted-foreground">
                                Este paciente ainda não preencheu o questionário psicológico.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
