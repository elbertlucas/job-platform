
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { useContext } from "react"
import AuthContext, { InputsLogin } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import Loading from "@/components/loading"
import { ActivityIcon } from "lucide-react"

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
      <div className="flex h-screen justify-center items-center bg-gradient-to-br from-slate-800 from-20% via-slate-900 via-50% to-slate-950 to-90% w-full" >
        <div className="flex flex-col w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3 h-screen justify-center items-center gap-3 text-gray-200 p-8 m-4">
          <div className="flex items-center gap-3 max-w-60 my-20">
            <ActivityIcon className="size-24" />
            <label className="text-4xl font-semibold">Job Platform</label>
          </div>
          <h1 className="font-bold text-xl text-left w-full" >Login</h1>
          <Input
            placeholder="Username"
            autoComplete="Username"
            {...register("username", { required: true })}
            className="bg-gray-800 text-center text-gray-100 h-10"
          />
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="bg-gray-800 text-center text-gray-100 h-10"
          />
          <Button
            type="submit"
            className="w-full hover:bg-gray-900 bg-gray-800 h-10"
          >
            Login
          </Button>
          {errors.username && <span className="fixed bottom-32 right-14 text-red-300 font-semibold text-xl">Campo usuário é requerido</span>}
          {errors.password && <span className="fixed bottom-24 right-14 text-red-300 font-semibold text-xl">Campo senha é requerido</span>}
          <Toaster position="bottom-left" />
        </div>
      </div>
    </form >
  )
}