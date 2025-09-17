"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { ArrowRight, Brain, Building2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const userTypes = [
    {
        id: "employee",
        title: "Colaborador(a)",
        description: "Quero ser atendido e receber diagnósticos.",
        icon: User,
    },
    {
        id: "psychologist",
        title: "Psicólogo(a)",
        description: "Quero ajudar pacientes a se sentirem melhor.",
        icon: Brain,
    },
    {
        id: "company",
        title: "Empresa",
        description: "Quero gerir e acompanhar meu time de colaboradores.",
        icon: Building2,
    },
]

export function RoleSection() {
    const [selectedType, setSelectedType] = useState("employee")
    const router = useRouter()

    const routerContinue = () => {
        router.push(`/register/${selectedType}`)
    }

    const routerLogin = () => {
        router.push("/login")
    }


    return (
        <section id="role">
            <h2 className="font-josefin font-bold text-3xl text-center mb-2">Como você deseja continuar?</h2>
            <p className="text-center text-balance text-xl max-w-[600px] mb-12 mx-auto text-foreground/75">Escolha o tipo de cadastro que melhor se adequa ao seu perfil e comece sua jornada no FIO Mental.</p>

            <div className="flex flex-col items-center gap-4 mb-8">
                <RadioGroup value={selectedType} onValueChange={setSelectedType} className="flex flex-col items-center gap-4 w-full">
                    {userTypes.map((type) => {
                        const Icon = type.icon
                        return (
                            <Card key={type.id}
                                className={`p-6 cursor-pointer transition-all hover:shadow-md border w-full !m-0 ${selectedType === type.id
                                    ? "border-primary bg-accent"
                                    : "border-accent bg-blue-50 dark:bg-blue-950/20"
                                    }`}
                            >
                                <Label htmlFor={type.id} className="flex items-center space-x-4 cursor-pointer">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                                        <Icon className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold text-foreground">{type.title}</h3>
                                        <p className="text-sm text-muted-foreground">{type.description}</p>
                                    </div>
                                    <RadioGroupItem value={type.id} id={type.id} />
                                </Label>
                            </Card>
                        )
                    })}
                </RadioGroup>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={routerContinue}>
                    Avançar
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="ghost" onClick={routerLogin}>Já possuo uma conta</Button>
            </div>
        </section>
    )
}
