import ErrorComponent from "@/components/error"
import Loading from "@/components/loading"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthContext from "@/contexts/auth-context"
import { UserCreate, useUsers } from "@/hooks/useUsers"
import { PlusCircleIcon, Power, PowerOff, Trash2 } from "lucide-react"
import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import Header from "@/components/header"
import Container from "@/components/container"
import { Label } from "@radix-ui/react-label"


function Admin() {
  const { authenticated, loading, logout } = useContext(AuthContext)
  const { users, error, isLoading, create, drop, activateUser, deactivateUser } = useUsers()
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<UserCreate>()


  if (loading) return <Loading />
  if (isLoading) return <Loading />
  if (error) return <ErrorComponent error={error} />
  if (!authenticated) return <Navigate to="/login" replace={true} />

  const handleOpenCreateModal = () => {
    resetCreate()
    setOpenCreateModal(!openCreateModal)
  }

  const submitCreate: SubmitHandler<UserCreate> = async (dataForm) => {
    create({
      username: dataForm.username,
      password: dataForm.password,
      confirm_password: dataForm.confirm_password,
      admin: dataForm.admin
    })
    resetCreate()
    setOpenCreateModal(!open)
  }

  return (
    <Container>
      <>
        <Header logout={logout} />
        <div className="text-slate-900 bg-slate-200 rounded-lg shadow-lg pb-2">
          <Table>
            <TableCaption>Lista de Usuários</TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="w-[20%]">id</TableHead>
                <TableHead className="w-[15%]">Usuário</TableHead>
                <TableHead className="w-[15%]">Perfil</TableHead>
                <TableHead className="w-[20%]">Ativo</TableHead>
                <TableHead colSpan={3} className="w-[30%]">
                  <div className="flex rounded-md shadow-md h-10 gap-2 bg-green-700 hover:bg-green-900 hover:cursor-pointer text-white">
                    <Dialog open={openCreateModal} onOpenChange={handleOpenCreateModal}>
                      <DialogTrigger asChild>
                        <div className="flex w-full justify-center gap-2 items-center">
                          <PlusCircleIcon />
                          <Label className="hover:cursor-pointer">Criar Usuário</Label>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] bg-slate-200 text-slate-800 shadow-lg">
                        <form onSubmit={handleSubmitCreate(submitCreate)}>
                          <DialogTitle className="">Adicionar um novo usuário</DialogTitle>
                          <DialogDescription className="flex flex-col gap-2 ">
                            <Input
                              placeholder="Username"
                              autoComplete="Username"
                              {...registerCreate("username", { required: true })}
                              className="bg-secundary text-center border border-gray-700 text-primary h-10 mt-8"
                            />
                            {errorsCreate.username && <span className="text-red-500 font-bold">Campo usuário é requerido</span>}
                            <Input
                              type="password"
                              autoComplete="current-password"
                              placeholder="Senha"
                              {...registerCreate("password", { required: true })}
                              className="bg-secundary text-center border-gray-700 text-primary h-10"
                            />
                            {errorsCreate.password && <span className="text-red-500 font-bold">Campo de senha é requerido</span>}
                            <Input
                              type="password"
                              placeholder="Confirmar senha"
                              {...registerCreate("confirm_password", { required: true })}
                              className="bg-secundary text-center border-gray-700 text-primary h-10"
                            />
                            <div className="flex justify-end items-center text-primary gap-2">
                              <label
                                htmlFor="admin"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Usuário admin ?
                              </label>
                              <Input
                                type="checkbox"
                                title="Usuário admin?"
                                id="admin"
                                className="w-8 h-8 rounded-lg"
                                {...registerCreate("admin")} />
                            </div>
                            <Button
                              className="w-full rounded-md shadow-md h-10 gap-2 bg-green-700 hover:bg-green-900 hover:cursor-pointer text-white"
                              type="submit"
                            >
                              Criar
                            </Button>
                          </DialogDescription>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.active ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell>
                    {user.active ?
                      <div
                        onClick={() => deactivateUser(user.id)}
                        className="flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <PowerOff
                          className="hover:cursor-pointer"
                        />
                      </div>
                      :
                      <div
                        onClick={() => activateUser(user.id)}
                        className="flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <Power
                          className="hover:cursor-pointer"
                        />
                      </div>
                    }
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild className="flex w-full py-2 bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-red-500 hover:cursor-pointer text-white">
                        <Trash2 className="hover:cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-slate-200 text-slate-800 shadow-lg">
                        <DialogDescription className="flex flex-col gap-2">
                          <Label className="text-slate-800 text-lg">Deseja excluir o usuário selecionado ?</Label>
                        </DialogDescription>
                        <DialogClose className="flex gap-2">
                          <Button
                            className="w-full rounded-md shadow-md h-10 gap-2 bg-slate-700 hover:bg-slate-900 hover:cursor-pointer text-white"
                            type="submit"
                          >
                            Voltar
                          </Button>
                          <Button
                            className="w-full rounded-md shadow-md h-10 gap-2 bg-red-700 hover:bg-red-900 hover:cursor-pointer text-white"
                            onClick={() => drop(user.id)}
                            type="submit"
                          >
                            Excluir
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Toaster />
        </div>
      </>
    </Container >
  )
}

export default Admin