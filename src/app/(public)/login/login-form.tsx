"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await signIn("credentials", {
            redirect: false, // não faz redirect automático
            email: formData.email,
            password: formData.password,
        })

        setLoading(false)

        if (res?.error) {
            setError("E-mail ou senha inválidos")
        } else {
            // redireciona conforme role
            const session = await fetch("/api/auth/session").then(r => r.json())
            const role = session?.user?.role

            if (role === "employee") router.push("/chat")
            else if (role === "company") router.push("/dashboard")
            else if (role === "psychologist") router.push("/dash-psychologist")
            else router.push("/")
        }
    }

    const handleBack = () => router.push("/")

    const canSubmit = formData.email && formData.password && !loading

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Entrar</CardTitle>
                <p className="text-muted-foreground">Acesse sua conta no FIO Mental</p>
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
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="grid grid-cols-[1fr_3fr] gap-4 pt-4">
                        <Button variant="outline" onClick={handleBack}>
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
