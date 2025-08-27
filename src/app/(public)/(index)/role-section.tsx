import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { ArrowRight, Brain, Building2, User } from "lucide-react"

export function RoleSection() {
    return (
        <section>
            <h2 className="font-josefin font-bold text-3xl text-center mb-2">Como você deseja continuar?</h2>
            <p className="text-center text-balance text-xl max-w-[600px] mb-12 mx-auto text-foreground/75">Escolha o tipo de cadastro que melhor se adequa ao seu perfil e comece sua jornada no FIO Mental.</p>

            <div className="flex flex-col items-center gap-4 mb-8">
                <Card
                    className="p-6 cursor-pointer transition-all hover:shadow-md border-primary bg-accent w-full !m-0"
                >
                    <Label className="flex items-center space-x-4 cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                            <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-foreground">Colaborador(a)</h3>
                            <p className="text-sm text-muted-foreground">Quero ser atendido e receber diagnósticos.</p>
                        </div>
                    </Label>
                </Card>

                <Card
                    className="flex-1 p-6 cursor-pointer transition-all hover:shadow-md border border-border hover:border-muted-foreground w-full !m-0"
                >
                    <Label className="flex items-center space-x-4 cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                            <Brain className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-foreground">Psicólogo(a)</h3>
                            <p className="text-sm text-muted-foreground">Quero ajudar pacientes a se sentirem melhor.</p>
                        </div>
                    </Label>
                </Card>

                <Card
                    className="flex-1 p-6 cursor-pointer transition-all hover:shadow-md border-border hover:border-muted-foreground w-full !m-0"
                >
                    <Label className="flex items-center space-x-4 cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                            <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-semibold text-foreground">Empresa</h3>
                            <p className="text-sm text-muted-foreground">Quero gerir e acompanhar meu time de colaboradores.</p>
                        </div>
                    </Label>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button>
                    Avançar
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="ghost">Já possuo uma conta</Button>
            </div>
        </section>
    )
}
