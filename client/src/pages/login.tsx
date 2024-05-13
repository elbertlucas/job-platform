
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import { Navigate, Link } from "react-router-dom"
import { useContext } from "react"
import AuthContext, { InputsLogin } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import Loading from "@/components/loading"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsLogin>()

  const { loading, authenticated, login } = useContext(AuthContext)

  if (loading) return <Loading />
  if (authenticated) return <Navigate to="/workflows-group" replace={true} />

  const submit: SubmitHandler<InputsLogin> = async (dataForm) => {
    login(dataForm)
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen place-items-center w-full bg-slate-200 border-slate-400 text-gray-200" >
        <div className="flex flex-col w-full h-screen justify-end items-center px-[15%] py-[15%] gap-3 text-gray-200 bg-slate-900 border-r-4  border-gray-700 ">
          <h1 className="font-normal text-[2rem] text-center" >Login</h1>
          <h2 className="font-normal text-[0.9rem] mb-2 text-center" >Controle e agendamento de Jobs</h2>
          <Input
            placeholder="Username"
            autoComplete="Username"
            {...register("username", { required: true })}
            className="bg-gray-800 text-center text-gray-100 h-10"
          />
          {errors.username && <span>Campo usuário é requerido</span>}
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="bg-gray-800 text-center text-gray-100 h-10"
          />
          {errors.password && <span>Campo senha é requerido</span>}
          <Button
            type="submit"
            className="w-full hover:bg-gray-900 bg-gray-800 h-10"
          >
            Login
          </Button>
          <Link
            className="hover:cursor-pointer hover:underline hover:text-underline-offset-1 "
            to={'/login'}
          >Esqueci a senha
          </Link>
          <Toaster position="bottom-left" />
        </div>
        <div className="md:col-span-2 flex justify-center items-center w-full h-full ">
          <img className="lg:w-[100%] lg:h-[100%]" />
        </div>
        <div>
        </div>
      </div>
    </form >
  )
}