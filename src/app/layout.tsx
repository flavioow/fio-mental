import type { Metadata } from "next"
import { Inter, Josefin_Sans } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import "./layout.css"

const inter = Inter({ subsets: ["latin"] })
const josefin = Josefin_Sans({ subsets: ["latin"], variable: "--font-josefin" })


export const metadata: Metadata = {
    title: "Fio Mental",
    description: "Conecta pessoas, empresas e psicólogos em um ambiente seguro e acessível para cuidar da saúde mental",
    authors: [
        { name: "Flávio Henrique Perusin de Souza", url: "https://flavioow.vercel.app/" },
        { name: "Kevin Simões de Souza Lima", url: "https://kevin-simoes.github.io/kevin.folio" },
        { name: "Mateus Teixeira de Oliveira" },
        { name: "Alexandre Salcines Messias Pivatti" },
        { name: "Eduardo Ramalho Ferreira da Silva" },
    ],
    keywords: ["Saúde mental", "Grátis", "IA", "Psicologia", "Qualidade"],
    robots: { index: true, follow: true },
    manifest: "manifest.webmanifest",
    icons: [
        {
            rel: "icon",
            type: "image/png",
            url: "favicons/icon1.png",
        },
        {
            rel: "icon",
            type: "image/svg+xml",
            url: "favicons/icon0.svg",
        },
        {
            rel: "shortcut icon",
            url: "favicons/favicon.ico",
        },
        {
            rel: "apple-touch-icon",
            url: "favicons/apple-icon.png",
            sizes: "180x180",
        },
    ],
    appleWebApp: { capable: true, title: "Fio Mental", statusBarStyle: "default" },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-br">
            <body className={`${josefin.variable} ${inter.className}`}>
                <SpeedInsights />
                {children}
            </body>
        </html>
    )
}
