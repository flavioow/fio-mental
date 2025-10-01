"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aqui você implementaria a lógica de login
        console.log("Login:", formData)
        // Redirecionar para dashboard
        router.push("/dash-employee")
    }

    const handleBack = () => {
        router.push("/")
    }

    const canSubmit = formData.email && formData.password

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

                    <div className="grid grid-cols-[1fr_3fr] gap-4 pt-4">
                        <Button variant="outline" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>

                        <Button type="submit" disabled={!canSubmit}>
                            Entrar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
