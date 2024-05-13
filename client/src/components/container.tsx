import { ReactElement } from "react"

type ContainerrProps = {
    children: ReactElement
}

export default function Container({ children }: ContainerrProps) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-300 max-w-screen px-6 py-4 gap-3">
            {children}
        </div >
    )
}
