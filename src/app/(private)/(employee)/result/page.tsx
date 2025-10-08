"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, Home } from "lucide-react"
import { useRouter } from "next/navigation"

type PerfilIA = {
    perfilPrincipal: string
    diagnostico: string
    recomendacoes: string[]
}

// Função para limpar o JSON retornado da Gemini
const sanitizeJSON = (input: string | object) => {
    if (!input) return { perfilPrincipal: "Perfil", diagnostico: "Não preenchido", recomendacoes: [] }
    if (typeof input === "object") return input
    try {
        const cleaned = input.replace(/```json\s*|```/g, "").trim()
        return JSON.parse(cleaned)
    } catch {
        return { perfilPrincipal: "Perfil", diagnostico: input, recomendacoes: [] }
    }
}

export default function PerfilPsicologico() {
    const router = useRouter()
    const [perfil, setPerfil] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPerfil() {
            try {
                const res = await fetch("/api/perfil-employee")
                if (!res.ok) throw new Error("Erro ao buscar perfil")
                const data = await res.json()

                // Extrai e sanitiza o perfil psicológico
                data.diagnostico = sanitizeJSON(data.diagnostico)
                setPerfil(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadPerfil()
    }, [])

    if (loading) return <div className="text-center mt-20">Carregando...</div>
    if (!perfil) return <div className="text-center mt-20">Perfil não disponível.</div>

    const perfilIA: PerfilIA = {
        perfilPrincipal: perfil.diagnostico?.perfilPrincipal || "Perfil",
        diagnostico: perfil.diagnostico?.diagnostico || "Não preenchido",
        recomendacoes: perfil.diagnostico?.recomendacoes || [],
    }

    return (
        <>
            {/* Header com gradiente */}
            <div className="content-grid relative bg-primary py-8">
                <div className="container mx-auto px-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-8 text-primary-foreground hover:bg-primary-foreground/25 hover:text-primary-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" /> Voltar
                    </Button>

                    <div className="flex items-center gap-6">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-background">
                            <AvatarImage
                                src={perfil.avatar || "/assets/fiohomem.png"}
                                alt={perfil.nome || "Colaborador"}
                            />
                            <AvatarFallback className="text-2xl bg-white text-blue-600">
                                {(perfil.nome || "Colaborador")
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-white">
                            <h1 className="text-3xl font-bold mb-2 text-primary-foreground">
                                {perfil.nome || "Colaborador"}
                            </h1>
                            <p className="text-primary-foreground/75 text-lg">
                                {perfil.role || "Colaborador"} | {perfil.desde || "desde 2024"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="content-grid container mx-auto px-4 mt-4 pb-12">
                <div className="w-full space-y-6">
                    {/* Resultado principal */}
                    <Card className="p-6 shadow-lg !w-full">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h2 className="text-2xl font-bold">Resultado da Avaliação</h2>
                                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                                        {perfilIA.perfilPrincipal}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {perfilIA.diagnostico || "Não há descrição detalhada disponível."}
                                </p>
                                {perfilIA.recomendacoes.length > 0 && (
                                    <ul className="list-disc pl-6 mt-3 text-sm text-muted-foreground">
                                        {perfilIA.recomendacoes.map((r, i) => (
                                            <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Informações do colaborador */}
                    <Card className="p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-6">Informações</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Nome</p>
                                    <p className="font-medium">{perfil.nome}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{perfil.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Telefone</p>
                                    <p className="font-medium">{perfil.telefone || "—"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                    <Home className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Endereço</p>
                                    <p className="font-medium">{perfil.endereco || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}
