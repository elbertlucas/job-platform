import { LayoutIcon } from "lucide-react"
import { Link, Navigate } from "react-router-dom"
import { create } from 'zustand'
import { selectPageUnderline } from "@/utils/_"
import AuthContext from "@/contexts/auth-context"
import { useContext } from "react"
import Loading from "./loading"

type State = {
    page: string
}

type Action = {
    updatePage: (page: State['page']) => void
}

const usePagStore = create<State & Action>((set) => ({
    page: 'workflows-group',
    updatePage: (page) => set(() => ({ page: page })),
}))


type HeaderProps = {
    logout: () => Promise<void>
}

export default function Header({ logout }: HeaderProps) {
    const { user, authenticated, loading } = useContext(AuthContext)
    const page = usePagStore(state => state.page)
    const updatePage = usePagStore(state => state.updatePage)

    if (loading) return <Loading />
    if (!authenticated) return <Navigate to="/login" replace={true} />

    return (
        <>
            <div className="flex justify-between items-center bg-slate-200 border-slate-400 text-slate-800 h-14 rounded-lg shadow-lg p-4" >
                <div className="flex gap-2">
                    <LayoutIcon className="m-2" />
                    <li className="flex list-none gap-2 items-center justify-center">
                        <Link onClick={() => updatePage('workflows-group')} to={'/workflows-group'}>
                            <ul className={`${selectPageUnderline(page, 'workflows-group')} text-slate-900 hover:underline hover:underline-offset-8 hover:text-slate-800 px-2 py-1 rounded-sm cursor-pointer`}>
                                Grupo de tarefas
                            </ul>
                        </Link>
                        <Link onClick={() => updatePage('workflow')} to={'/workflow'}>
                            <ul className={`${selectPageUnderline(page, 'workflow')} text-slate-900 hover:underline hover:underline-offset-8 hover:text-slate-800 px-2 py-1 rounded-sm cursor-pointer`}>
                                Tarefas
                            </ul>
                        </Link>
                        <Link onClick={() => updatePage('logs')} to={'/logs'}>
                            <ul className={`${selectPageUnderline(page, 'logs')} text-slate-900 hover:underline hover:underline-offset-8 hover:text-slate-800 px-2 py-1 rounded-sm cursor-pointer`}>
                                Logs
                            </ul>
                        </Link>
                    </li>
                </div>
                <div className="flex justify-center items-center gap-4">
                    {
                        user?.role == 'admin' && (
                            <Link onClick={() => updatePage('admin')} to={'/admin'}>
                                <ul className={`${selectPageUnderline(page, 'admin')} text-slate-900 hover:underline hover:underline-offset-8 hover:text-slate-800 px-2 py-1 rounded-sm cursor-pointer`}>
                                    Admin
                                </ul>
                            </Link>)
                    }
                    <button
                        className="border-[1px] border-slate-400 rounded-sm w-20 px-2 py-1 hover:bg-slate-400 hover:text-slate-800"
                        onClick={logout}
                    >
                        Sair
                    </button>
                </div>
            </div >
        </>
    )
}

