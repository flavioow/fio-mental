import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
    return (
        <div className="content-grid flex flex-col items-center justify-start p-8 bg-background text-foreground">
            {/* Card */}
            <div className="w-full bg-card rounded-lg p-8 mb-4">
                <div className="border-b-2 border-muted flex">
                    <Avatar className="bg-accent size-15">
                        <AvatarImage src="/assets/fiohomem.png" alt="@fio" />
                        <AvatarFallback>F</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start items-start">
                        <div className="font-semibold mb-2 text-center">Cauã Rodrigues dos Santos</div>
                        <div className="text-sm text-muted-foreground mb-4 text-center">Funcionário</div>
                    </div>
                </div>
                <h2 className="font-josefin text-xl font-bold mb-4 text-center flex p-2">Olá Cauã, como foi seu dia?</h2>
                <div className="bg-accent rounded-lg border-primary border-2 p-6 text-center mb-4">
                    <div className="font-josefin text-2xl font-bold mb-2">Você já preencheu o questionário</div>
                    <div className="text-sm text-muted-foreground mb-4">Próxima consulta as 6:00 e 11:00</div>
                    <div className="text-xs text-muted-foreground mb-6">
                        Seu questionário está sendo avaliado em nosso sistema, o prazo mínimo de entrega do diagnóstico é de 1 semana.
                    </div>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <a href="/reports/">
                            <Button className="bg-primary text-primary-foreground">Marcar Consulta</Button>
                        </a>
                        <a href="/perfil/">
                            <Button variant="outline">Ver Perfil</Button>
                        </a>
                    </div>
                </div>
                <div className="text-center">
                    <a href="quiz" className="text-primary underline text-sm font-medium">Refazer Questionário</a>
                </div>
            </div>
        </div>
    )
}
