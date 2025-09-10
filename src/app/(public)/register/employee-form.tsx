"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/router"
import type React from "react"

import { useState } from "react"

export function EmployeeForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault()
        // lógica
        console.log("Cadastro colaborador:", formData)
        router.push("/employee/chat")
    }

    const back = () => {
        router.push("/")
    }

    const canSubmit = formData.email && formData.password && formData.password === formData.confirmPassword

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Cadastro - Colaborador</CardTitle>
                <p className="text-muted-foreground">Crie sua conta para receber atendimento e diagnósticos</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={submitForm} className="space-y-4">
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Confirme sua senha"
                            required
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={back}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>

                        <Button type="submit" disabled={!canSubmit} className="bg-blue-600 hover:bg-blue-700">
                            Criar Conta
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
