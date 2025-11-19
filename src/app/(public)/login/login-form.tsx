"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function LoginForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Erro ao fazer login")
                setLoading(false)
                return
            }

            // Redireciona para a rota retornada pela API
            window.location.href = data.redirectTo

        } catch (err) {
            console.error("Login error:", err)
            setError("Erro ao fazer login. Tente novamente.")
            setLoading(false)
        }
    }

    const handleBack = () => router.push("/")

    const canSubmit = formData.email && formData.password && !loading

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Entrar</CardTitle>
                <p className="text-muted-foreground">Acesse sua conta no NEO Mental</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="seu@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Digite sua senha"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-[1fr_3fr] gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
