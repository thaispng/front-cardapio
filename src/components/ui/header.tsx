import { ModeToggle } from "../ModeToggle";


export default function Header() {
    return (
        <header className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold">Cardápio</h1>
            <ModeToggle />
        </header>
    )
}