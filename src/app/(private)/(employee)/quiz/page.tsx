"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Brain, Target, Users, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react"

export default function RefazerQuestionario() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [form, setForm] = useState({
        estresse: "",
        motivoEstresse: "",
        equilibrio: "",
        reacaoProblema: "",
        espacoBemEstar: "",
        motivacao: "",
        desmotivacao: "",
        melhorHorario: "",
        foco: "",
        satisfacao: "",
        pedirAjuda: "",
        conflitos: "",
        ouvido: "",
        tipoColega: "",
        ambiente: "",
        habilidades: "",
        oportunidades: "",
        confianca: "",
        palavra: "",
        mudanca: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const perfilPsico = { ...form }
            const res = await fetch("/api/questionario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            if (!res.ok) {
                alert(data.error || "Erro ao salvar questionário")
                return
            }

            localStorage.setItem("perfilIA", data.perfil)
            router.push("/result")
        } catch (error) {
            console.error("Erro:", error)
            alert("Erro ao enviar questionário")
        }
    }

    const sections = [
        {
            title: "Saúde Mental e Bem-Estar",
            icon: Brain,
            color: "text-blue-500",
            questions: [
                {
                    name: "estresse",
                    label: "Como você avaliaria seu nível atual de estresse no trabalho de 1 a 10?",
                    type: "number",
                    min: 1,
                    max: 10,
                },
                {
                    name: "motivoEstresse",
                    label: "O que mais costuma gerar estresse ou ansiedade no seu dia a dia profissional?",
                    type: "textarea",
                },
                {
                    name: "equilibrio",
                    label: "Você sente que consegue equilibrar bem trabalho e vida pessoal?",
                    type: "textarea",
                },
                {
                    name: "reacaoProblema",
                    label: "Quando enfrenta um problema no trabalho, qual costuma ser sua primeira reação?",
                    type: "textarea",
                },
                {
                    name: "espacoBemEstar",
                    label: "Você sente que tem espaço para falar sobre seu bem-estar com colegas ou líderes?",
                    type: "textarea",
                },
            ],
        },
        {
            title: "Motivação e Produtividade",
            icon: Target,
            color: "text-green-500",
            questions: [
                { name: "motivacao", label: "O que mais te motiva a dar o seu melhor no trabalho?", type: "textarea" },
                { name: "desmotivacao", label: "O que mais desmotiva ou atrapalha sua produtividade?", type: "textarea" },
                {
                    name: "melhorHorario",
                    label: "Em quais momentos do dia você sente que trabalha melhor (manhã, tarde, noite)?",
                    type: "textarea",
                },
                {
                    name: "foco",
                    label: "Você se considera mais focado em tarefas individuais ou colaborativas?",
                    type: "textarea",
                },
                {
                    name: "satisfacao",
                    label: "O que poderia aumentar sua satisfação e motivação no ambiente de trabalho?",
                    type: "textarea",
                },
            ],
        },
        {
            title: "Relacionamento e Trabalho em Equipe",
            icon: Users,
            color: "text-purple-500",
            questions: [
                { name: "pedirAjuda", label: "Você se sente confortável em pedir ajuda quando precisa?", type: "textarea" },
                { name: "conflitos", label: "Como você lida com conflitos ou divergências no time?", type: "textarea" },
                {
                    name: "ouvido",
                    label: "O quanto você sente que é ouvido e respeitado nas reuniões ou discussões de equipe?",
                    type: "textarea",
                },
                {
                    name: "tipoColega",
                    label: "Qual é o tipo de colega ou líder que mais te ajuda a render melhor?",
                    type: "textarea",
                },
                {
                    name: "ambiente",
                    label: "Você prefere ambientes mais calmos e estruturados ou dinâmicos e cheios de interações?",
                    type: "textarea",
                },
            ],
        },
        {
            title: "Desenvolvimento e Futuro",
            icon: TrendingUp,
            color: "text-orange-500",
            questions: [
                {
                    name: "habilidades",
                    label: "Quais habilidades você gostaria de desenvolver nos próximos meses?",
                    type: "textarea",
                },
                {
                    name: "oportunidades",
                    label: "Você sente que tem oportunidades reais de crescimento dentro da empresa?",
                    type: "textarea",
                },
                {
                    name: "confianca",
                    label: "O que faria você se sentir mais confiante para assumir novas responsabilidades?",
                    type: "textarea",
                },
                {
                    name: "palavra",
                    label: "Em uma palavra, como você definiria sua relação atual com o trabalho?",
                    type: "text",
                },
                {
                    name: "mudanca",
                    label: "Se pudesse mudar uma coisa na empresa para melhorar o bem-estar dos colaboradores, o que seria?",
                    type: "textarea",
                },
            ],
        },
    ]

    const currentSection = sections[currentStep]
    const Icon = currentSection.icon
    const progress = ((currentStep + 1) / sections.length) * 100

    const nextStep = () => {
        if (currentStep < sections.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const isLastStep = currentStep === sections.length - 1

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Questionário de Bem-Estar</h1>
                    <p className="text-muted-foreground text-lg">Ajude-nos a entender melhor suas necessidades profissionais</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        {sections.map((section, index) => {
                            const SectionIcon = section.icon
                            return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        <SectionIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs text-muted-foreground hidden md:block max-w-[80px] text-center leading-tight">
                                        {section.title.split(" ")[0]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Form Card */}
                <Card className="p-8 md:p-10 shadow-lg border-2">
                    <form onSubmit={handleSubmit}>
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ${currentSection.color}`}
                            >
                                <Icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{currentSection.title}</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Seção {currentStep + 1} de {sections.length}
                                </p>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-8">
                            {currentSection.questions.map((question, index) => (
                                <div key={question.name} className="space-y-3">
                                    <Label htmlFor={question.name} className="text-base font-semibold text-foreground leading-relaxed">
                                        {index + 1}. {question.label}
                                    </Label>
                                    {question.type === "textarea" ? (
                                        <Textarea
                                            id={question.name}
                                            name={question.name}
                                            value={form[question.name as keyof typeof form]}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="resize-none text-base"
                                            placeholder="Digite sua resposta aqui..."
                                        />
                                    ) : question.type === "number" ? (
                                        <Input
                                            id={question.name}
                                            name={question.name}
                                            type="number"
                                            min={question.min}
                                            max={question.max}
                                            value={form[question.name as keyof typeof form]}
                                            onChange={handleChange}
                                            required
                                            className="text-base"
                                            placeholder="1-10"
                                        />
                                    ) : (
                                        <Input
                                            id={question.name}
                                            name={question.name}
                                            type="text"
                                            value={form[question.name as keyof typeof form]}
                                            onChange={handleChange}
                                            required
                                            className="text-base"
                                            placeholder="Digite sua resposta..."
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-10 pt-8 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="gap-2 bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Anterior
                            </Button>

                            {isLastStep ? (
                                <Button type="submit" className="gap-2 px-8">
                                    Enviar Respostas
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button type="button" onClick={nextStep} className="gap-2">
                                    Próxima
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Footer Info */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Suas respostas são confidenciais e serão usadas apenas para melhorar sua experiência
                </p>
            </div>
        </div>
    )
}
