import { notFound, redirect } from "next/navigation"
import { PyschologistForm } from "@/app/(public)/register/psychologist-form"
import { CompanyForm } from "@/app/(public)/register/company-form"

const validTypes = ["employee", "psychologist", "company"]

interface CadastroPageProps {
    params: Promise<{ type: string }>
}

export default async function CadastroPage({ params }: CadastroPageProps) {
    const { type } = await params

    if (!validTypes.includes(type)) notFound()

    if (type === "employee") {
        redirect("/login") // redireciona no servidor (sem erros de renderização)
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {type === "psychologist" && <PyschologistForm />}
                {type === "company" && <CompanyForm />}
            </div>
        </div>
    )
}
