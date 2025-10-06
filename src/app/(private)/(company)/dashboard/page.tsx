import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
    return (
        <div className="content-grid min-h-screen flex flex-col items-center justify-start p-8 bg-background text-foreground">
            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8">
                <span className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-primary">🟦</span> Início
                </span>
                <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 shadow min-w-[250px]">
                    <div className="flex flex-col justify-center ml-2">
                        <div className="font-semibold flex items-center gap-1">
                            Cauane R. <span className="text-xs">✏️</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Psicóloga</div>
                    </div>
                    <Button variant="ghost" className="ml-4 text-muted-foreground">&lt;Logout</Button>
                </div>
            </div>

            {/* Card principal */}
            <div className="w-full bg-card rounded-lg mb-4">
                <div className="border-b border-muted flex items-center gap-4 pb-4 mb-4">
                    <Avatar>
                        <AvatarImage src="/assets/fiohomem.png" alt="@fio" />
                        <AvatarFallback>F</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <div className="font-semibold">Cauane Rodrigues dos Santos</div>
                        <div className="text-sm text-muted-foreground">Psicóloga</div>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6">Olá Cauane, o que você quer fazer?</h2>

                {/* Três blocos separados */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Relatórios */}
                    <div className="bg-blue-100 rounded-lg p-6 text-center shadow flex flex-col items-center">
                        {/* Espaço para imagem */}
                        <div className="w-full h-24 bg-white rounded-md mb-4 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm"><img src="/assets/image 3.png" alt="Relatórios" className="w-full h-24 object-cover rounded-md" /></span>
                        </div>
                        <div className="text-lg font-bold mb-2">Relatórios</div>
                        <div className="text-xs text-muted-foreground mb-6">
                            Veja seus relatórios detalhados de consultas e diagnósticos.
                        </div>
                        <Button className="bg-primary text-primary-foreground w-full">Abrir Relatórios</Button>
                    </div>

                    {/* Agendamentos */}
                    <div className="bg-blue-100 rounded-lg p-6 text-center shadow flex flex-col items-center">
                        {/* Espaço para imagem */}
                        <div className="w-full h-24 bg-white rounded-md mb-4 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm"><img src="/assets/image 4.png" alt="Agendamentos" className="w-full h-24 object-cover rounded-md" /></span>
                        </div>
                        <div className="text-lg font-bold mb-2">Agendamentos</div>
                        <div className="text-xs text-muted-foreground mb-6">
                            Consulte, edite ou crie novos agendamentos de consulta.
                        </div>
                        <Button className="bg-primary text-primary-foreground w-full">Ver Agendamentos</Button>
                    </div>

                    {/* Ver PerFIO */}
                    <div className="bg-blue-100 rounded-lg p-6 text-center shadow flex flex-col items-center">
                        {/* Espaço para imagem */}
                        <div className="w-full h-24 bg-white rounded-md mb-4 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm"><img src="/assets/image 5.png" alt="VerPerFIO" className="w-full h-24 object-cover rounded-md" />
                            </span>
                        </div>
                        <div className="text-lg font-bold mb-2">Ver PerFIO</div>
                        <div className="text-xs text-muted-foreground mb-6">
                            Acesse seu perfil no sistema FIO e atualize seus dados.
                        </div>
                        <Button className="bg-primary text-primary-foreground w-full">Abrir PerFIO</Button>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <a href="quiz" className="text-primary underline text-sm font-medium">Refazer Questionário</a>
                </div>
            </div>
        </div>
    )
}
