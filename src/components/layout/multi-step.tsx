"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface MultiStepFormProps {
    title: string
    currentStep: number
    totalSteps: number
    onNext: () => void
    onPrevious: () => void
    onSubmit: () => void
    canGoNext: boolean
    isLastStep: boolean
    children: ReactNode
}

export function MultiStepForm({
    title,
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onSubmit,
    canGoNext,
    isLastStep,
    children,
}: MultiStepFormProps) {
    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">{title}</CardTitle>
                <div className="flex items-center justify-center space-x-2 mt-4">
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i + 1 <= currentStep ? "bg-primary" : "bg-muted"}`} />
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                    Passo {currentStep} de {totalSteps}
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {children}

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onPrevious}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>

                    {isLastStep ? (
                        <Button onClick={onSubmit} disabled={!canGoNext}>
                            Finalizar Cadastro
                        </Button>
                    ) : (
                        <Button onClick={onNext} disabled={!canGoNext}>
                            Próximo
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
