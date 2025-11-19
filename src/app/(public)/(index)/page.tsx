import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight } from "lucide-react"
import { AboutSection } from "./about-section"
import { RoleSection } from "./role-section"

export default function Index() {
    return (
        <main className="content-grid">
            <section id="home" className="content-full-width !my-0 min-h-[75dvh] grid place-items-center bg-[url('https://i.postimg.cc/nzt5w3yY/Composi-o-1-1.gif')] bg-bottom bg-cover bg-no-repeat bg-fixed relative">

                {/* Blur */}
                <div className="content-full-width absolute inset-0 bg-primary/50 backdrop-blur-sm -z-0 h-full"></div>

                <div className="z-0">
                    <p className="font-medium text-center mb-6 text-secondary">Prazer, bem vindo ao</p>
                    <h1 className="font-josefin font-bold text-6xl text-center mb-2 text-primary-foreground">NEO Mental</h1>
                    <p className="text-center text-balance text-xl max-w-[600px] mb-12 text-primary-foreground">Um espaço pensado para promover bem-estar e cuidado emocional de forma acessível. Conectamos colaboradores, psicólogos e empresas em uma plataforma única.</p>

                    <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                        <a href="#role">
                            <Button size="lg">
                                Comece agora
                                <ArrowDown className="h-5 w-5 transition-transform" />
                            </Button>
                        </a>
                        <a href="#about"><Button size="lg" variant="outline">Saiba mais</Button></a>
                    </div>
                </div>
            </section>

            <AboutSection />

            <RoleSection />
        </main>
    )
}
