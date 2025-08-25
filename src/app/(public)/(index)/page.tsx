import Image from "next/image";

export default function Index() {
    return (
        <main>
            <section>
                <p className="font-medium text-center">Prazer, bem vindo ao</p>
                <h1 className="font-josefin font-bold text-4xl text-center">FIO Mental</h1>
            </section>

            <section>
                <p className="lg:text-justify lg:indent-8">O Mental FIO é um espaço pensado para promover bem-estar e cuidado emocional de forma acessível. Através da nossa plataforma, colaboradores podem conversar com um psicólogo virtual e receber relatórios personalizados, empresas podem oferecer benefícios de saúde mental aos seus times, e psicólogos têm a chance de impactar mais vidas com seu trabalho. Nosso objetivo é facilitar o acesso à escuta, ao apoio e ao autoconhecimento — tudo em um só lugar.</p>
                <p className="font-josefin font-bold text-lg">Como você deseja se cadastrar?</p>
            </section>

            <section>
                <div className="bg-background border border-border flex items-center gap-2 p-2 max-w-[350px] rounded-md">
                    <Image src="/assets/fiohomem.png" alt="Fio" width="92" height="92" />
                    <div>
                        <h2 className="font-josefin font-bold text-xl">Colaborador(a)</h2>
                        <p>Quero ser atendido e receber diagnósticos.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
