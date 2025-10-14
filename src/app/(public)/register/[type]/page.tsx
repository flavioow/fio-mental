import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { PyschologistForm } from "@/app/(public)/register/psychologist-form"
import { CompanyForm } from "@/app/(public)/register/company-form"
import { EmployeeForm } from "@/app/(public)/register/employee-form"

const validTypes = ["employee", "psychologist", "company"]

interface CadastroPageProps {
    params: Promise<{ type: string }>
}

export default async function CadastroPage({ params }: CadastroPageProps) {
    const { type } = await params

    if (!validTypes.includes(type)) notFound()

    // Se for cadastro de employee, verifica autenticação
    if (type === "employee") {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            // Não autenticado, redireciona para login
            redirect("/login")
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

            // Apenas empresas podem cadastrar funcionários
            if (decoded.role !== "COMPANY") {
                redirect("/login")
            }
        } catch {
            // Token inválido
            redirect("/login")
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {type === "employee" && <EmployeeForm />}
                {type === "psychologist" && <PyschologistForm />}
                {type === "company" && <CompanyForm />}
            </div>
        </div>
    )
}
