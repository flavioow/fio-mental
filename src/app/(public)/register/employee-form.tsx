"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MultiStepForm } from "@/components/layout/multi-step"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { maskCPF, maskPhone } from "@/utils/mask"

export function EmployeeForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Dados do funcionário
        nome: "",
        cpf: "",
        telefone: "",
        // Login
        email: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()

    const handleNext = () => {
        setCurrentStep(currentStep + 1)
    }

    const handlePrevious = () => {
        if (currentStep === 1) {
            router.push("/dashboard")
        } else {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/auth/register/employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Erro no cadastro")
                return
            }

            alert("Funcionário cadastrado com sucesso!")
            router.push("/dashboard")
        } catch (err) {
            console.error(err)
            alert("Erro inesperado")
        }
    }

    const canGoNext = () => {
        if (currentStep === 1) {
            return (
                formData.nome.trim() !== "" &&
                formData.cpf.trim() !== "" &&
                formData.telefone.trim() !== ""
            )
        }
        if (currentStep === 2) {
            return (
                formData.email.trim() !== "" &&
                formData.password.trim() !== "" &&
                formData.password === formData.confirmPassword
            )
        }
        return false
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome do Funcionário</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Nome completo"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                                placeholder="XXX.XXX.XXX-XX"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
                                placeholder="(11) 99999-9999"
                                required
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="funcionario@email.com"
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
                                placeholder="Digite a senha"
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
                                placeholder="Confirme a senha"
                                required
                            />
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <MultiStepForm
            title="Cadastro de Funcionário"
            currentStep={currentStep}
            totalSteps={2}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            canGoNext={canGoNext()}
            isLastStep={currentStep === 2}
        >
            {renderStep()}
        </MultiStepForm>
    )
}
