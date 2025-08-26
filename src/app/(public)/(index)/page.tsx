import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Building2, Heart, Shield, Users } from "lucide-react"
import Image from "next/image"

export default function Index() {
    return (
        <main className="content-grid">
            <section className="content-full-width !my-0 lg:py-48 grid place-items-center bg-[url('https://images.pexels.com/photos/823841/pexels-photo-823841.jpeg?_gl=1*1w7t6ci*_ga*MTM3NjMxNTY4NC4xNzU2MjMzNjYy*_ga_8JE65Q40S6*czE3NTYyMzM2NjEkbzEkZzEkdDE3NTYyMzM3NDEkajU5JGwwJGgw')] bg-bottom bg-cover bg-no-repeat bg-fixed relative">

                {/* Blur */}
                <div className="content-full-width absolute inset-0 bg-primary/15 backdrop-blur-sm bg-black/20 -z-0"></div>

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

            <section>
                <h1 className="font-josefin font-bold text-3xl text-center mb-2">Sobre o FIO Mental</h1>
                <p className="md:text-justify md:indent-8 text-foreground/75">O Mental FIO é um espaço pensado para promover bem-estar e cuidado emocional de forma acessível. Através da nossa plataforma, colaboradores podem conversar com um psicólogo virtual e receber relatórios personalizados, empresas podem oferecer benefícios de saúde mental aos seus times, e psicólogos têm a chance de impactar mais vidas com seu trabalho. Nosso objetivo é facilitar o acesso à escuta, ao apoio e ao autoconhecimento — tudo em um só lugar.</p>

                <div className="my-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Cuidado Personalizado</h3>
                            <p className="text-foreground/75 text-balance">Relatórios personalizados e acompanhamento individual para cada colaborador.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Psicólogos Qualificados</h3>
                            <p className="text-foreground/75 text-balance">Profissionais certificados prontos para impactar vidas com seu trabalho.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Benefícios Corporativos</h3>
                            <p className="text-foreground/75 text-balance">Empresas podem oferecer saúde mental como benefício aos seus times.</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Ambiente Seguro</h3>
                            <p className="text-foreground/75 text-balance">Plataforma segura e confidencial para conversas e acompanhamento.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <p className="text-lg text-foreground/75 mb-2">
                        <strong>Nosso objetivo é facilitar o acesso à escuta, ao apoio e ao autoconhecimento</strong>
                    </p>
                    <p className="text-foreground/75 font-medium">— tudo em um só lugar.</p>
                </div>
            </section>



            <section></section>
        </main>
    )
}
