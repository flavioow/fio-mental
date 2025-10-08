"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function RefazerQuestionario() {
    const router = useRouter()
    const [form, setForm] = useState({
        estresse: "",
        motivoEstresse: "",
        equilibrio: "",
        reacaoProblema: "",
        espacoBemEstar: "",
        motivacao: "",
        desmotivacao: "",
        melhorHorario: "",
        foco: "",
        satisfacao: "",
        pedirAjuda: "",
        conflitos: "",
        ouvido: "",
        tipoColega: "",
        ambiente: "",
        habilidades: "",
        oportunidades: "",
        confianca: "",
        palavra: "",
        mudanca: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch("/api/questionario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Erro ao salvar questionário")
                return
            }

            // Salva apenas temporariamente pra exibir na página de resultado
            localStorage.setItem("perfilIA", data.perfil)

            router.push("/result")
        } catch (error) {
            console.error("Erro:", error)
            alert("Erro ao enviar questionário")
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-background text-foreground">
            <div className="w-full max-w-xl bg-card rounded-lg shadow p-8 mb-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Saúde Mental e Bem-Estar</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="font-semibold">Como você avaliaria seu nível atual de estresse no trabalho de 1 a 10?</label>
                        <input name="estresse" type="number" min={1} max={10} className="mt-2 w-full border rounded px-3 py-2" required value={form.estresse} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">O que mais costuma gerar estresse ou ansiedade no seu dia a dia profissional?</label>
                        <textarea name="motivoEstresse" className="mt-2 w-full border rounded px-3 py-2" required value={form.motivoEstresse} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Você sente que consegue equilibrar bem trabalho e vida pessoal?</label>
                        <textarea name="equilibrio" className="mt-2 w-full border rounded px-3 py-2" required value={form.equilibrio} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Quando enfrenta um problema no trabalho, qual costuma ser sua primeira reação?</label>
                        <textarea name="reacaoProblema" className="mt-2 w-full border rounded px-3 py-2" required value={form.reacaoProblema} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Você sente que tem espaço para falar sobre seu bem-estar com colegas ou líderes?</label>
                        <textarea name="espacoBemEstar" className="mt-2 w-full border rounded px-3 py-2" required value={form.espacoBemEstar} onChange={handleChange} />
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-6 text-center">Motivação e Produtividade</h2>
                    <div>
                        <label className="font-semibold">O que mais te motiva a dar o seu melhor no trabalho?</label>
                        <textarea name="motivacao" className="mt-2 w-full border rounded px-3 py-2" required value={form.motivacao} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">O que mais desmotiva ou atrapalha sua produtividade?</label>
                        <textarea name="desmotivacao" className="mt-2 w-full border rounded px-3 py-2" required value={form.desmotivacao} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Em quais momentos do dia você sente que trabalha melhor (manhã, tarde, noite)?</label>
                        <textarea name="melhorHorario" className="mt-2 w-full border rounded px-3 py-2" required value={form.melhorHorario} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Você se considera mais focado em tarefas individuais ou colaborativas?</label>
                        <textarea name="foco" className="mt-2 w-full border rounded px-3 py-2" required value={form.foco} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">O que poderia aumentar sua satisfação e motivação no ambiente de trabalho?</label>
                        <textarea name="satisfacao" className="mt-2 w-full border rounded px-3 py-2" required value={form.satisfacao} onChange={handleChange} />
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-6 text-center">Relacionamento e Trabalho em Equipe</h2>
                    <div>
                        <label className="font-semibold">Você se sente confortável em pedir ajuda quando precisa?</label>
                        <textarea name="pedirAjuda" className="mt-2 w-full border rounded px-3 py-2" required value={form.pedirAjuda} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Como você lida com conflitos ou divergências no time?</label>
                        <textarea name="conflitos" className="mt-2 w-full border rounded px-3 py-2" required value={form.conflitos} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">O quanto você sente que é ouvido e respeitado nas reuniões ou discussões de equipe?</label>
                        <textarea name="ouvido" className="mt-2 w-full border rounded px-3 py-2" required value={form.ouvido} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Qual é o tipo de colega ou líder que mais te ajuda a render melhor?</label>
                        <textarea name="tipoColega" className="mt-2 w-full border rounded px-3 py-2" required value={form.tipoColega} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Você prefere ambientes mais calmos e estruturados ou dinâmicos e cheios de interações?</label>
                        <textarea name="ambiente" className="mt-2 w-full border rounded px-3 py-2" required value={form.ambiente} onChange={handleChange} />
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-6 text-center">Desenvolvimento e Futuro</h2>
                    <div>
                        <label className="font-semibold">Quais habilidades você gostaria de desenvolver nos próximos meses?</label>
                        <textarea name="habilidades" className="mt-2 w-full border rounded px-3 py-2" required value={form.habilidades} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Você sente que tem oportunidades reais de crescimento dentro da empresa?</label>
                        <textarea name="oportunidades" className="mt-2 w-full border rounded px-3 py-2" required value={form.oportunidades} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">O que faria você se sentir mais confiante para assumir novas responsabilidades?</label>
                        <textarea name="confianca" className="mt-2 w-full border rounded px-3 py-2" required value={form.confianca} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Em uma palavra, como você definiria sua relação atual com o trabalho?</label>
                        <input name="palavra" type="text" className="mt-2 w-full border rounded px-3 py-2" required value={form.palavra} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="font-semibold">Se pudesse mudar uma coisa na empresa para melhorar o bem-estar dos colaboradores, o que seria?</label>
                        <textarea name="mudanca" className="mt-2 w-full border rounded px-3 py-2" required value={form.mudanca} onChange={handleChange} />
                    </div>

                    <div className="flex justify-center mt-8">
                        <Button type="submit" className="bg-primary text-primary-foreground px-8 py-2">Enviar Respostas</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
