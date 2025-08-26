import Image from "next/image"
import { Button } from "../ui/button"

export function Navbar() {
    return (
        <header className="w-full fixed top-0 z-50 flex justify-center items-center">
            <div className="flex gap-4 justify-center items-center w-fit bg-background/50 backdrop-blur-md p-2 my-4 rounded-md">
                <a href="/">
                    <Image src="/assets/fiohomem.png" alt="Fio" width="42" height="42" />
                </a>
                <nav>
                    <ul className="flex gap-2">
                        <li id="inicio">
                            <Button variant="ghost"><a href="#">Início</a></Button>
                        </li>
                        <li id="sobre">
                            <Button variant="ghost"><a href="#">Sobre</a></Button>
                        </li>
                        <li id="cadastro">
                            <Button variant="ghost"><a href="#">Cadastro</a></Button>
                        </li>

                        <li id="login">
                            <Button variant="default" className="bg-primary text-primary-foreground">
                                <a href="#">
                                    Login
                                </a>
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
