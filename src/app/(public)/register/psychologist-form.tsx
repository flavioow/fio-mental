"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MultiStepForm } from "@/components/layout/multi-step"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { maskCPF, maskCRP, maskPhone } from "@/utils/mask"

interface Company {
    id: number
    nome: string
}

export function PyschologistForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [companies, setCompanies] = useState<Company[]>([])
    const [loadingCompanies, setLoadingCompanies] = useState(true)
    const [formData, setFormData] = useState({
        // Dados do psicólogo
        nome: "",
        cpf: "",
        telefone: "",
        crp: "",
        tempoAtuacao: "",
        descricao: "",
        companyId: "",
        // Login
        email: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()

    useEffect(() => {
        loadCompanies()
    }, [])

    const loadCompanies = async () => {
        try {
            const res = await fetch("/api/companies")
            const data = await res.json()

            if (data.success) {
                setCompanies(data.companies)
            }
        } catch (err) {
            console.error("Erro ao carregar empresas:", err)
        } finally {
            setLoadingCompanies(false)
        }
    }

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

    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/auth/register/psychologist", {
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

            router.push(data.redirectTo || "/dash-psychologist")
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
                formData.telefone.trim() !== "" &&
                formData.crp.trim() !== "" &&
                formData.companyId.trim() !== ""
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
                            <Label htmlFor="nome">Nome</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Seu nome"
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

                        <div className="space-y-2">
                            <Label htmlFor="crp">Conselho Regional de Psicologia (CRP)</Label>
                            <Input
                                id="crp"
                                value={formData.crp}
                                onChange={(e) => setFormData({ ...formData, crp: maskCRP(e.target.value) })}
                                placeholder="XX/XXXXX"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tempoAtuacao">Tempo de atuação (anos)</Label>
                            <Input
                                id="tempoAtuacao"
                                type="number"
                                value={formData.tempoAtuacao}
                                onChange={(e) => setFormData({ ...formData, tempoAtuacao: e.target.value })}
                                placeholder="Ex: 5"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyId">Empresa</Label>
                            <Select
                                value={formData.companyId}
                                onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                            >
                                <SelectTrigger id="companyId">
                                    <SelectValue placeholder={loadingCompanies ? "Carregando..." : "Selecione a empresa"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((company) => (
                                        <SelectItem key={company.id} value={company.id.toString()}>
                                            {company.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                placeholder="Descreva brevemente seu trabalho..."
                                rows={3}
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
                                placeholder="seu.email@exemplo.com"
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
            title="Cadastro - Psicólogo"
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
