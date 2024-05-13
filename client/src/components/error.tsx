import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AxiosError } from "axios"
import { Link } from "react-router-dom"

type ErrorComponentProps = {
    error: AxiosError
}

function ErrorComponent({ error }: ErrorComponentProps) {
    return (
        <div className="grid h-screen place-items-center bg-slate-300 text-slate-800" >
            <Alert variant='destructive' className="flex flex-col max-w-lg bg-slate-100 gap-2">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Algo deu errado!</AlertTitle>
                <AlertDescription>
                    <pre>{JSON.stringify(error.response?.data)}</pre>
                </AlertDescription>
                <AlertDescription>
                    Estamos trabalhando nisso!.
                </AlertDescription>
                <Link 
                className="bg-slate-200 hover:bg-slate-300 w-full p-2 mt-4 text-center rounded-md"
                to="/login">
                   clique aqui para tentar revalidar o acesso, caso não seja possivel será direcionado ao login
                </Link>
            </Alert>
        </div >
    )
}

export default ErrorComponent
