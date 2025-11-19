import { Button } from "@/components/ui/button"
import { LogoutButton } from "./logout-button"

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            {children}
            <footer className="content-grid bg-muted border-t py-16 mt-4">
                <section className="flex justify-between items-center flex-col lg:flex-row gap-8">
                    <p className="text-foreground/75">Neo Mental © 2025 todos os direitos reservados</p>
                    <LogoutButton variant="destructive" className="text-background dark:text-foreground" />
                </section>
            </footer>

        </>
    )
}
