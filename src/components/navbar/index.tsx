import { Button } from "../ui/button"

export function Navbar() {
    return (
        <header className="w-full sticky top-0 z-50 flex justify-center items-center">
            <div className="w-fit bg-background/75 backdrop-blur-md p-2 my-4 rounded-md border border-border">
                <nav>
                    <ul className="flex gap-2">
                        <li id="sobre">
                            <Button variant="ghost">
                                <a href="#">
                                    Sobre o FIO
                                </a>
                            </Button>
                        </li>
                        <li id="contato">
                            <Button variant="ghost">
                                <a href="#">
                                    Contato do FIO
                                </a>
                            </Button>
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
