import { ModeToggle } from "../ModeToggle";


export default function Header() {
    return (
        <header className="flex items-center justify-end px-8 py-4">
            <ModeToggle />
        </header>
    )
}