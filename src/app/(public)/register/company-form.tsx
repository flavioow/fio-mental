"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MultiStepForm } from "@/components/layout/multi-step"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { maskCNPJ, maskPhone } from "@/utils/mask"

export function CompanyForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Dados da empresa
        nomeEmpresa: "",
        cnpj: "",
        telefone: "",
        endereco: "",
        setor: "",
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
            router.push("/")
        } else {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        // Aqui você implementaria a lógica de cadastro
        console.log("Cadastro empresa:", formData)
        // Redirecionar para dashboard ou página de sucesso
    }

    const canGoNext = () => {
        if (currentStep === 1) {
            return (
                formData.nomeEmpresa.trim() !== "" &&
                formData.cnpj.trim() !== "" &&
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
                            <Label htmlFor="nomeEmpresa">Razão Social</Label>
                            <Input
                                id="nomeEmpresa"
                                value={formData.nomeEmpresa}
                                onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
                                placeholder="Nome da sua empresa"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                value={formData.cnpj}
                                onChange={(e) => setFormData({ ...formData, cnpj: maskCNPJ(e.target.value) })}
                                placeholder="XX.XXX.XXX/XXXX-XX"
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

                        <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input
                                id="endereco"
                                value={formData.endereco}
                                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                placeholder="Endereço completo da empresa"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="setor">Setor de Atuação</Label>
                            <Input
                                id="setor"
                                value={formData.setor}
                                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                                placeholder="Ex: Tecnologia, Saúde, Educação..."
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail Corporativo</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contato@empresa.com"
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
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <MultiStepForm
            title="Cadastro - Empresa"
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
