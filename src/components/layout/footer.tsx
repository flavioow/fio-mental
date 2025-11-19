import Image from "next/image"

export function Footer() {
    return (
        <footer className="content-grid bg-secondary py-16">
            <section className="flex justify-between items-center flex-col lg:flex-row gap-8">
                <a href="/" className="flex gap-2 items-center">
                    <Image src="/assets/fiohomem.png" alt="Neo" width="92" height="92" />
                    <p className="font-bold text-3xl">Neo Mental</p>
                </a>

                <p className="text-foreground/75">Neo Mental © 2025 todos os direitos reservados</p>
            </section>
        </footer>
    )
}
