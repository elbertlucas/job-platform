import Container from "@/components/container"
import ErrorComponent from "@/components/error"
import Header from "@/components/header"
import Loading from "@/components/loading"
import { useForm } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AuthContext from "@/contexts/auth-context"
import { useFetch } from "@/hooks/useFetch"
import { CalendarClockIcon, PlayIcon, PlusCircleIcon, Power, PowerOff, ShieldAlertIcon, StopCircleIcon, Trash2 } from "lucide-react"
import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { WorkflowType } from "@/models/workflow";
import { context } from "@/models/context";
import Tasks from "@/components/tasks";
import useWorkflow, { FormCreateWorkflowProps } from "@/hooks/useWorkflow";

export default function Workflow() {
  const { authenticated, loading, logout } = useContext(AuthContext)
  const { data: workflows, error, isLoading, mutate } = useFetch<WorkflowType[]>('/workflow')
  const { data: contexts } = useFetch<context[]>('/context')
  const hook = useWorkflow()
  const [openModalCreateContext, setOpenModalCreateContext] = useState(false);
  const { handleSubmit: handleSubmitFormCreateWorkflow, register: registerFormCreateWorkflow } = useForm<FormCreateWorkflowProps>();
  const [contextSelected, setContextSelected] = useState(contexts?.[0]?.id);
  const [workflowSelected, setWorkflowSelected] = useState('');

  const onSubmitFormCreateContext = (data: FormCreateWorkflowProps) => {
    setOpenModalCreateContext(false)
    hook.create(data, contextSelected, mutate)
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
            <TableCaption className="my-4">Lista de workflows</TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="w-auto">Tarefa</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[15%]">Agendado</TableHead>
                <TableHead colSpan={4} className="w-[30%] p-2">
                  <Dialog open={openModalCreateContext}>
                    <DialogTrigger asChild onClick={() => setOpenModalCreateContext(true)}>
                      <div className="flex bg-green-700 rounded-md shadow-md h-10 text-center justify-center items-center gap-3 hover:bg-green-900 hover:cursor-pointer text-white">
                        <PlusCircleIcon />
                        <Label className="hover:cursor-pointer">Criar tarefa</Label>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-slate-200 text-slate-800 shadow-lg">
                      <form onSubmit={handleSubmitFormCreateWorkflow(onSubmitFormCreateContext)}>
                        <DialogHeader>
                          <DialogTitle>Criar tarefa</DialogTitle>
                          <DialogDescription className="text-slate-600">
                            Workflows group agrupa por tema um conjunto de workflow para facilitar a execução dos jobs em uma única ação
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 w-full">
                          <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="name">
                              Nome:
                            </Label>
                            <Input type="text" {...registerFormCreateWorkflow('name', { required: true })} className="col-span-5" />
                            <Label htmlFor="context_id">
                              Grupo:
                            </Label>
                            <Select
                              defaultValue={contexts?.[0]?.id}
                              onValueChange={value => setContextSelected(value)}
                            >
                              <SelectTrigger className="col-span-5">
                                <SelectValue placeholder="Grupo" />
                              </SelectTrigger>
                              <SelectContent>
                                {contexts?.map(context => (
                                  <SelectItem value={context.id}>{context.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              type="button"
                              onClick={() => setOpenModalCreateContext(false)}
                              variant="destructive"
                              className="w-20"
                            >Fechar</Button>
                          </DialogClose>
                          <Button type="submit" className="w-20">Criar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows?.map((workflow, index) => (
                <TableRow key={workflow.id} className={index % 2 === 0 ? "bg-slate-200" : "bg-slate-100"}>
                  <TableCell>{workflow.name}</TableCell>
                  <TableCell>{workflow.active ? "Ativo" : "Desativado"}</TableCell>
                  <TableCell>{workflow.scheduled ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    {workflow.logs.length > 0 ?
                      <div className="w-full flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <StopCircleIcon className="hover:cursor-pointer" />
                      </div>
                      :
                      <Dialog>
                        <DialogTrigger className="w-full flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                          <PlayIcon className="hover:cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent className="w-auto flow flow-col gap-4 bg-slate-200 text-slate-800 shadow-lg">
                          <DialogDescription className="flex justify-center text-slate-800 items-center px-2 gap-4">
                            <ShieldAlertIcon />
                            <Label>Deseja iniciar a execução do job?</Label>
                          </DialogDescription>
                          <DialogClose className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="destructive"
                              className="w-32"
                            >Voltar</Button>
                            <Button
                              type="button"
                              onClick={() => hook.execute(workflow.id, mutate)}
                              className="w-32">Iniciar</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    }
                  </TableCell>
                  <TableCell>
                    {workflow.active ?
                      <div
                        onClick={() => hook.deactivateWorkflow(workflow.id, mutate)}
                        className="flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <PowerOff
                          className="hover:cursor-pointer"
                        />
                      </div>
                      :
                      <div
                        onClick={() => hook.activateWorkflow(workflow.id, mutate)}
                        className="flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                        <Power
                          className="hover:cursor-pointer"
                        />
                      </div>
                    }
                  </TableCell>
                  <Dialog >
                    <DialogTrigger asChild>
                      <TableCell
                        onClick={() => setWorkflowSelected(workflow.id)}
                        className="justify-items-end w-full">
                        <div className="flex bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-slate-500 hover:cursor-pointer text-white">
                          <CalendarClockIcon className="hover:cursor-pointer" />
                        </div>
                      </TableCell>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col max-w-[1200px] bg-slate-200 text-slate-800 shadow-lg">
                      <Tasks workflow={workflow} workflowSelected={workflowSelected} />
                    </DialogContent>
                  </Dialog>
                  <TableCell className="justify-items-end">
                    <Dialog>
                      <DialogTrigger className="flex w-full bg-slate-700 rounded-md shadow-md h-10 text-center justify-center items-center hover:bg-red-500 hover:cursor-pointer text-white">
                        <Trash2 className="hover:cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="w-auto flex flex-col  gap-4 bg-slate-200 text-slate-800 shadow-lg">
                        <DialogDescription className="flex justify-center items-center px-2 gap-4 text-red-600">
                          <ShieldAlertIcon />
                          <Label>Essa ação é irrevesivel deseja realmente deletar esse workflow?</Label>
                        </DialogDescription>
                        <DialogClose className=" flex justify-end items-center gap-2">
                          <Button
                            type="button"
                            className="w-32"
                          >Voltar</Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => hook.drop(workflow.id, mutate)}
                            className="w-32">Confirmar</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell colSpan={4}>Quantidade</TableCell>
              <TableCell colSpan={3} className="text-center">{workflows?.length}</TableCell>
            </TableFooter>
          </Table>
          <Toaster position="bottom-left" />
        </div>
      </>
    </Container >
  )
}