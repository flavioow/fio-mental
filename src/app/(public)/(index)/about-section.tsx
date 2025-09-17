import { Card, CardContent } from "@/components/ui/card"
import { Building2, Heart, Shield, Users } from "lucide-react"

const cards = [
    {
        icon: Heart,
        title: "Cuidado Personalizado",
        description: "Relatórios personalizados e acompanhamento individual para cada colaborador.",
    },
    {
        icon: Users,
        title: "Psicólogos Qualificados",
        description: "Profissionais certificados prontos para impactar vidas com seu trabalho.",
    },
    {
        icon: Building2,
        title: "Benefícios Corporativos",
        description: "Empresas podem oferecer saúde mental como benefício aos seus times.",
    },
    {
        icon: Shield,
        title: "Ambiente Seguro",
        description: "Plataforma segura e confidencial para conversas e acompanhamento.",
    },
]

export function AboutSection() {
    return (
        <section id="about">
            <h2 className="font-josefin font-bold text-3xl text-center mb-2">Sobre o FIO Mental</h2>
            <p className="md:text-justify md:indent-8 text-foreground/75">O Mental FIO é um espaço pensado para promover bem-estar e cuidado emocional de forma acessível. Através da nossa plataforma, colaboradores podem conversar com um psicólogo virtual e receber relatórios personalizados, empresas podem oferecer benefícios de saúde mental aos seus times, e psicólogos têm a chance de impactar mais vidas com seu trabalho. Nosso objetivo é facilitar o acesso à escuta, ao apoio e ao autoconhecimento — tudo em um só lugar.</p>

            <div className="my-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mb-16">
                {cards.map((card, index) => (
                    <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <card.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                            <p className="text-foreground/75 text-balance">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center">
                <p className="text-lg text-foreground/75 mb-2">Nosso objetivo é facilitar o acesso à escuta, ao apoio e ao autoconhecimento</p>
                <p className="text-foreground/75 font-medium">— tudo em um só lugar.</p>
            </div>
        </section>
    )
}
