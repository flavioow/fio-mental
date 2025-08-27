import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AboutSection } from "./about-section"
import { RoleSection } from "./role-section"

export default function Index() {
    return (
        <main className="content-grid">
            <section className="content-full-width !my-0 py-28 lg:py-48 grid place-items-center bg-[url('https://images.pexels.com/photos/823841/pexels-photo-823841.jpeg?_gl=1*1w7t6ci*_ga*MTM3NjMxNTY4NC4xNzU2MjMzNjYy*_ga_8JE65Q40S6*czE3NTYyMzM2NjEkbzEkZzEkdDE3NTYyMzM3NDEkajU5JGwwJGgw')] bg-bottom bg-cover bg-no-repeat bg-fixed relative">

                {/* Blur */}
                <div className="content-full-width absolute inset-0 bg-primary/15 backdrop-blur-sm -z-0"></div>

                <div className="z-0">
                    <p className="font-medium text-center mb-6 text-secondary">Prazer, bem vindo ao</p>
                    <h1 className="font-josefin font-bold text-6xl text-center mb-2 text-primary-foreground">FIO Mental</h1>
                    <p className="text-center text-balance text-xl max-w-[600px] mb-12 text-primary-foreground">Um espaço pensado para promover bem-estar e cuidado emocional de forma acessível. Conectamos colaboradores, psicólogos e empresas em uma plataforma única.</p>

                    <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                        <Button size="lg">
                            Comece agora
                            <ArrowRight className="h-5 w-5 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline">Saiba mais</Button>
                    </div>
                </div>
            </section>

            <AboutSection />

            <RoleSection />
        </main>
    )
}
