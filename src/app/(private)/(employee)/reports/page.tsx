"use client"

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Dia {
    dia: string;
    mes: string;
}

export default function Reports() {
    const dias: Dia[] = [
        { dia: "08", mes: "Outubro" },
        { dia: "09", mes: "Outubro" },
        { dia: "10", mes: "Outubro" },
        { dia: "11", mes: "Outubro" },
        { dia: "12", mes: "Outubro" },
        { dia: "13", mes: "Outubro" },
        { dia: "14", mes: "Outubro" },
        { dia: "15", mes: "Outubro" },
        { dia: "16", mes: "Outubro" },
        { dia: "17", mes: "Outubro" },
        { dia: "18", mes: "Outubro" },
        { dia: "19", mes: "Outubro" },
        { dia: "20", mes: "Outubro" },
        { dia: "21", mes: "Outubro" },
        { dia: "22", mes: "Outubro" },
        { dia: "23", mes: "Outubro" },
        { dia: "24", mes: "Outubro" },
        { dia: "25", mes: "Outubro" },
        { dia: "26", mes: "Outubro" },
        { dia: "27", mes: "Outubro" },
        { dia: "28", mes: "Outubro" },
        { dia: "29", mes: "Outubro" },
    ];

    const horarios: string[] = [
        "06:00", "07:00", "08:00", "09:00", "10:00",
        "11:00", "12:00", "13:00", "14:00", "15:00"
    ];

    // 🔹 Estado do dia ativo
    const [diaAtivo, setDiaAtivo] = useState(0);

    // 🔹 Marcações diferentes por dia
    const marcacoesPorDia: Record<number, { psic1: number[]; psic2: number[] }> = {
        0: { psic1: [0], psic2: [5] },
        1: { psic1: [2, 4], psic2: [1] },
        2: { psic1: [3, 6], psic2: [8] },
        3: { psic1: [1, 2], psic2: [4, 9] },
        4: { psic1: [0, 7], psic2: [2] },
        5: { psic1: [1, 5, 9], psic2: [0, 6] },
    };

    const marcacoes = marcacoesPorDia[diaAtivo] || { psic1: [], psic2: [] }
    return (
        <div className="flex flex-col items-center py-8">
            <div className="w-full max-w-5xl px-6">

                {/* Cabeçalho */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <a href="/dash-employee/" className="text-foreground hover:opacity-75">
                            <ArrowLeft size={22} />
                        </a>
                        <h1 className="text-2xl font-bold">Outubro 2025</h1>
                    </div>
                </div>

                {/* Dias - Rolável horizontal */}
                <div className="flex gap-8 border-b pb-3 mb-6 overflow-x-auto flex-nowrap scroll-smooth scrollbar-none">
                    {dias.map((d, i) => (
                        <div
                            key={i}
                            onClick={() => setDiaAtivo(i)}
                            className={`flex-shrink-0 flex flex-col items-center font-semibold cursor-pointer transition-colors ${i === diaAtivo ? "text-primary scale-110" : "text-foreground hover:text-primary/70"
                                }`}
                        >
                            <span className="text-lg">{d.dia}</span>
                            <span
                                className={`text-sm ${i === diaAtivo ? "text-primary font-bold" : "text-muted-foreground"
                                    }`}
                            >
                                {d.mes}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Título seção */}
                <h2 className="text-lg font-bold mb-4">Psicólogos da Empresa</h2>

                {/* Psicólogos */}
                <div className="space-y-10">
                    {/* Psicóloga 1 */}
                    <div>
                        <div className="flex gap-4 mb-3">
                            <Avatar className="w-14 h-14 bg-[#d6e0ef]">
                                <AvatarImage src="https://media.gazetadopovo.com.br/2025/08/15095613/hytalo-santos-foto-reproducao-youtube-hytalo-santos-372x372.jpg" alt="Avatar" />
                                <AvatarFallback>CR</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">
                                    Cauane Rodrigues{" "}
                                    <span className="text-muted-foreground text-sm font-normal">
                                        (11) 96969-7704
                                    </span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-snug mt-1">
                                    Sou Cauane Rodrigues, psicóloga formada e apaixonada por compreender e acolher as singularidades de cada pessoa.
                                    Atuo com foco no cuidado emocional, promovendo autoconhecimento, equilíbrio e qualidade de vida.
                                    Acredito que cada indivíduo carrega dentro de si o potencial para transformar sua história,
                                    e meu propósito é oferecer um espaço seguro, humano e empático para que esse processo seja possível.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-16">
                            {horarios.map((hora, i) => {
                                const ativo = marcacoes.psic1.includes(i);
                                return (
                                    <Button
                                        key={i}
                                        variant={ativo ? "default" : "secondary"}
                                        className={`${ativo
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                            } px-4`}
                                    >
                                        {hora}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Psicólogo 2 */}
                    <div>
                        <div className="flex gap-4 mb-3">
                            <Avatar className="w-14 h-14 bg-[#d6e0ef]">
                                <AvatarImage src="https://www.atlanticrecords.com/sites/g/files/g2000015596/files/styles/artist_image_detail/public/2023-02/Pdiddy.jpg?itok=iQy4ar7K" alt="Avatar" />
                                <AvatarFallback>GB</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">
                                    Gustavo B.{" "}
                                    <span className="text-muted-foreground text-sm font-normal">
                                        (11) 93475-1111
                                    </span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-snug mt-1">
                                    Sou Gustavo, psicólogo dedicado a oferecer acolhimento e escuta ativa em cada encontro.
                                    Meu trabalho é guiado pelo compromisso de ajudar pessoas a desenvolverem autoconhecimento,
                                    enfrentarem desafios emocionais e construírem uma vida com mais equilíbrio e bem-estar.
                                    Acredito que cada trajetória é única, e meu objetivo é proporcionar um espaço seguro,
                                    humano e transformador para que cada pessoa descubra novas formas de viver sua própria história.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-16">
                            {horarios.map((hora, i) => {
                                const ativo = marcacoes.psic2.includes(i);
                                return (
                                    <Button
                                        key={i}
                                        variant={ativo ? "default" : "secondary"}
                                        className={`${ativo
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                            } px-4`}
                                    >
                                        {hora}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
