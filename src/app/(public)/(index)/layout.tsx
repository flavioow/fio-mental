import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function IndexLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}
