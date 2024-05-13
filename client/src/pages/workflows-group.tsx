import Container from "@/components/container"
import ErrorComponent from "@/components/error"
import Header from "@/components/header"
import Loading from "@/components/loading"
import { useForm } from 'react-hook-form';
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AuthContext from "@/contexts/auth-context"
import { useFetch } from "@/hooks/useFetch"
import { context, workflow } from "@/models/context"
import { PenSquareIcon, PlayIcon, PlusCircleIcon, Power, PowerOff, ShieldAlertIcon, StopCircleIcon, Trash2 } from "lucide-react"
import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner";
import useWorkflowGroup, { FormCreateContextProps } from "@/hooks/useWorkflowGroup";




export default function WorkflowsGroup() {
  const { authenticated, loading, logout } = useContext(AuthContext)
  const { data: contexts, error, isLoading, mutate } = useFetch<context[]>('/context')
  const hook = useWorkflowGroup()
  const [workflowsAttached, setWorkflowsAttached] = useState<workflow[]>([]);
  const [openModalCreateContext, setOpenModalCreateContext] = useState(false);
  
  const { handleSubmit: handleSubmitFormCreateContext, register: registerFormCreateContext } = useForm<FormCreateContextProps>();

  const onSubmitFormCreateContext = (data: FormCreateContextProps) => {
    setOpenModalCreateContext(false)
    hook.create(data, mutate)
  };

  if (loading) return <Loading />
  if (isLoading) return <Loading />
  if (error) return <ErrorComponent error={error} />
  if (!authenticated) return <Navigate to="/login" replace={true} />

  return (
    <Container >
      <>
        <Header logout={logout} />
        <div className="text-slate-900 bg-slate-200 rounded-lg shadow-lg">
          <Table >
            <TableCaption className="my-4">Lista de Grupo de Tarefas</TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="w-auto">Nome do Grupo</TableHead>
                <TableHead className="w-[15%]">Data criação</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[20%]">Quantidade de Jobs</TableHead>
                <TableHead colSpan={4} className="w-[30%]">
                  <Dialog open={openModalCreateContext}>
                    <DialogTrigger asChild onClick={() => setOpenModalCreateContext(true)}>
                      <div className="flex rounded-md shadow-md h-[2.5rem] text-center justify-center items-center gap-3 bg-green-700 hover:bg-green-900 hover:cursor-pointer text-white">
                        <PlusCircleIcon />
                        <Label className="hover:cursor-pointer">Criar grupo de tarefas</Label>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-slate-200 text-slate-800 shadow-lg">
                      <form onSubmit={handleSubmitFormCreateContext(onSubmitFormCreateContext)}>
                        <DialogHeader>
                          <DialogTitle>Novo grupo de tarefas</DialogTitle>
                          <DialogDescription className="text-slate-600">
                            Grupo de tarefas agrupa por tema para facilitar a execução dos jobs em uma única ação.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6 w-full">
                          <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Nome:
                            </Label>
                            <Input type="text" {...registerFormCreateContext('name', { required: true })} className="col-span-5" />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              type="button"
                              onClick={() => setOpenModalCreateContext(false)}
                              className="w-32"
                            >Fechar</Button>
                          </DialogClose>
                          <Button type="submit" className="w-32 bg-green-700 hover:bg-green-900 hover:cursor-pointer text-white">Criar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contexts?.map((context, index) => (
                <TableRow key={context.id} className={index % 2 === 0 ? "bg-slate-200" : "bg-slate-100"}>
                  <TableCell>{context.name}</TableCell>
                  <TableCell>{format(context.create_at, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell>{context.active ? "Ativo" : "Desativado"}</TableCell>
                  <TableCell>{context.workflow.length}</TableCell>
                  <TableCell >
                    {
                      context.Log.length > 0 ?
                        <div className="w-full h-[2.5rem] flex bg-slate-700 rounded-md shadow-md text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                          <StopCircleIcon className="hover:cursor-pointer " />
                        </div>
                        :
                        <Dialog>
                          <DialogTrigger className="w-full h-[2.5rem] flex bg-slate-700 rounded-md shadow-md  text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                            <PlayIcon className="hover:cursor-pointer" />
                          </DialogTrigger>
                          <DialogContent className="w-auto flow flow-col gap-4 bg-slate-200 text-slate-800 shadow-lg">
                            <DialogDescription className="flex justify-center text-slate-800 items-center px-2 gap-4">
                              <ShieldAlertIcon />
                              <Label className="py-2 text-base">Deseja iniciar a execução dos jobs?</Label>
                            </DialogDescription>
                            <DialogClose className="flex justify-end gap-2">
                              <Button
                                type="button"
                                className="w-32"
                              >Voltar</Button>
                              <Button
                                type="button"
                                onClick={() => hook.execute(context.name, mutate)}
                                className="w-32 bg-green-700 hover:bg-green-900 hover:cursor-pointer text-white">Iniciar</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                    }
                  </TableCell>
                  <TableCell>
                    {context.active ?
                      <div
                        onClick={() => hook.deactivateWorkflowGroup(context.id, mutate)}
                        className="flex bg-slate-700 rounded-md shadow-md h-[2.5rem] text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <PowerOff
                          className="hover:cursor-pointer"
                        />
                      </div>
                      :
                      <div
                        onClick={() => hook.activateWorkflowGroup(context.id, mutate)}
                        className="flex bg-slate-700 rounded-md shadow-md h-[2.5rem] text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <Power
                          className="hover:cursor-pointer"
                        />
                      </div>
                    }
                  </TableCell>
                  <Dialog >
                    <DialogTrigger asChild
                      onClick={() => {
                        hook.setContextName('')
                        setWorkflowsAttached(context.workflow)
                      }}
                    >
                      <TableCell
                        className="justify-items-end w-full">
                        <div className="flex bg-slate-700 rounded-md shadow-md h-[2.5rem] text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                          <PenSquareIcon className="hover:cursor-pointer" />
                        </div>
                      </TableCell>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] bg-slate-200 text-slate-800 shadow-lg">
                      <DialogHeader>
                        <DialogTitle>Editando grupo de tarefas {context.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-2 py-2">
                        <div className="grid grid-cols-12 gap-2 my-4">
                          <Input
                            onChange={e => hook.setContextName(e.target.value)}
                            type="text"
                            className="col-span-10 bg-primary text-secondary"
                            name="context-name"
                            placeholder="Digite o novo nome"
                            value={hook.contextName} />
                          <Button
                            type="button"
                            onClick={() => hook.updateContextName(context.id, mutate)}
                            className="col-span-2"
                          >Alterar nome
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 w-full gap-1 ">
                          <Label className="col-span-2 mb-2 text-center text-base">Tarefas atreladas ao grupo</Label>
                          {workflowsAttached.map((workflow, index) => (
                            <div key={index} className="flex justify-start items-center text-base gap-3 p-2 bg-primary text-secondary rounded-md">
                              <span>{workflow.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose className="flex gap-2">
                          <Button
                            type="button"
                            className="w-32"
                          >Fechar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <TableCell className="justify-items-end">
                    <Dialog>
                      <DialogTrigger className="flex w-full bg-slate-700 rounded-md shadow-md h-[2.5rem] text-center justify-center items-center hover:bg-red-500 hover:cursor-pointer text-white">
                        <Trash2 className="hover:cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="w-auto flex flex-col  gap-4 bg-slate-200 text-slate-800 shadow-lg">
                        <DialogDescription className="flex justify-center items-center px-2 gap-4 text-red-600">
                          <ShieldAlertIcon className="w-40 h-20" />
                          <div className="flex flex-col">
                            <Label className="py-2 text-base">Essa ação é irrevesivel, deseja realmente deletar esse grupo de tarefas?</Label>
                            <Label className="py-2 text-base text-slate-900">Ao confirmar todas as tarefas, agendamentos e logs atrelados a esse grupo serão apagados</Label>
                          </div>
                        </DialogDescription>
                        <DialogClose className=" flex justify-end items-center gap-2">
                          <Button
                            type="button"
                            className="w-32"
                          >Voltar</Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => hook.drop(context.id, mutate)}
                            className="w-32">Confirmar</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Toaster position="bottom-left" />
        </div>
      </>
    </Container >
  )
}