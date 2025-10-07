"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
    showIcon?: boolean
}

export function LogoutButton({
    variant = "outline",
    size = "default",
    className = "",
    showIcon = true
}: LogoutButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)

        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            })

            if (!res.ok) {
                console.error("Erro ao fazer logout")
                setLoading(false)
                return
            }

            // Redireciona para home
            window.location.href = "/"
        } catch (err) {
            console.error("Erro ao fazer logout:", err)
            setLoading(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            disabled={loading}
            className={className}
        >
            {showIcon && <LogOut className="w-4 h-4 mr-2" />}
            {loading ? "Saindo..." : "Sair"}
        </Button>
    )
}
