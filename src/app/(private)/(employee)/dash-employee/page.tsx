import { Button } from "@/components/ui/button"

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-background text-foreground">
            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8">
                <span className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-primary">🟦</span> Início
                </span>
                <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 shadow min-w-[250px]">
                    <img
                        src="/avatar.png"
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border object-cover"
                    />
                    <div className="flex flex-col justify-center ml-2">
                        <div className="font-semibold flex items-center gap-1">
                            Cauã R. <span className="text-xs">✏️</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Funcionário</div>
                    </div>
                    <Button variant="ghost" className="ml-4 text-muted-foreground">&lt;Logout</Button>
                </div>
            </div>

            {/* Card */}
            <div className="w-full max-w-xl bg-card rounded-lg shadow p-8 mb-4">
                <div className="font-semibold mb-2 text-center">Cauã Rodrigues dos Santos</div>
                <div className="text-sm text-muted-foreground mb-4 text-center">Funcionário</div>
                <h2 className="text-xl font-bold mb-4 text-center">Olá Cauã, como foi seu dia?</h2>
                <div className="bg-blue-100 rounded-lg p-6 text-center mb-4">
                    <div className="text-lg font-bold mb-2">Você já preencheu o questionário</div>
                    <div className="text-sm text-muted-foreground mb-4">(Texto não oficial)</div>
                    <div className="text-xs text-muted-foreground mb-6">
                        Seu questionário está sendo avaliado em nosso sistema, o prazo mínimo de entrega do diagnóstico é de 1 semana.
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button className="bg-primary text-primary-foreground">Marcar Consulta</Button>
                        <Button variant="outline">Ver Perfil</Button>
                    </div>
                </div>
                <div className="text-center">
                    <a href="quiz" className="text-primary underline text-sm font-medium">Refazer Questionário</a>
                </div>
            </div>
        </div>
    )
}