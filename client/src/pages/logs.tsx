import Container from "@/components/container"
import { ptBR } from "date-fns/locale";
import ErrorComponent from "@/components/error"
import Header from "@/components/header"
import Loading from "@/components/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthContext from "@/contexts/auth-context"
import { useFetch } from "@/hooks/useFetch"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { logs } from "@/models/logs"
import { statusLogBackgroudColor } from "@/utils/_"
import axios from "axios"
import { format } from "date-fns"
import { CalendarIcon, RefreshCcwIcon, ShieldAlertIcon, Trash2Icon, TrashIcon } from "lucide-react"
import { useContext, useState } from "react"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"
import { Navigate } from "react-router-dom"
import { Toaster, toast } from "sonner"

export default function Logs({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { authenticated, loading, logout } = useContext(AuthContext)
  const [loadingAnimation, setLoadingAnimation] = useState(false)
  const [filter, setFilter] = useState({
    status: 'ALL',
    workflowId: 'ALL',
    contextId: 'ALL'
  })
  const [date, setDate] = useState<DateRange>()
  const { data: logs, error, isLoading, mutate } = useFetch<logs[]>(`/logs/?from=${date?.from}&to=${date?.to}`)

  if (loading) return <Loading />
  if (isLoading) return <Loading />
  if (error) return <ErrorComponent error={error} />
  if (!authenticated) return <Navigate to="/login" replace={true} />

  const uniqueContextKeys = new Set();
  const uniqueStatusKeys = new Set();
  const uniqueWorkflowKeys = new Set();
  const contexts: { id: string, description: string }[] = []
  const status: { id: string, description: string }[] = []
  const workflow: { id: string, description: string }[] = []
  for (const log of logs) {
    const contextId = log.workflow.context_id
    const statusId = log.status
    const workflowId = log.workflow.id
    if (!uniqueContextKeys.has(contextId)) {
      uniqueContextKeys.add(contextId);
      contexts.push({ id: contextId, description: log.context.name });
    }
    if (!uniqueStatusKeys.has(statusId)) {
      uniqueStatusKeys.add(statusId);
      status.push({ id: statusId, description: log.status });
    }
    if (!uniqueWorkflowKeys.has(workflowId)) {
      uniqueWorkflowKeys.add(workflowId);
      workflow.push({ id: workflowId, description: log.workflow.name });
    }
  }
  const reload = () => {
    mutate(`/logs/?from=${date?.from}&to=${date?.to}`)
    setLoadingAnimation(true)
    setTimeout(() => setLoadingAnimation(false), 500)
  }

  const dropLog = async () => {
    try {
      await api.delete(`/logs`);
      mutate(`/logs/?from=${date?.from}&to=${date?.to}`)
      toast.success('todos logs foram deletados')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error('erro ao deletar logs', {
          description: `${JSON.stringify(error?.response?.data?.message)}`
        })
      } else {
        toast.error('erro ao deletar logs', {
          description: 'Internal Server Error'
        })
        console.log(error)
      }
    }
  }

  const dropLogById = async (logId: string) => {
    try {
      await api.delete(`/logs/${logId}`);
      mutate(`/logs/?from=${date?.from}&to=${date?.to}`)
      toast.success('log deletado')
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error('erro ao deletar logs', {
          description: `${JSON.stringify(error?.response?.data?.message)}`
        })
      } else {
        toast.error('erro ao deletar logs', {
          description: 'Internal Server Error'
        })
        console.log(error)
      }
    }
  }

  return (
    <Container>
      <>
        <Header logout={logout} />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <div className={cn("grid gap-2", className)}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[16rem] justify-start text-center font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Selecione a data inicial e final</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    locale={ptBR}
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate as SelectRangeEventHandler}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Select
              defaultValue={undefined}
              onValueChange={value => setFilter({ ...filter, contextId: value })}
            >
              <SelectTrigger className="w-[12rem] hover:bg-slate-100">
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  key={'ALL'}
                  value='ALL'>
                  Selecione o grupo
                </SelectItem>
                {contexts.map(context => (
                  <SelectItem key={context.id} value={context.id}>{context.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              defaultValue={undefined}
              onValueChange={value => setFilter({ ...filter, status: value })}
            >
              <SelectTrigger className="w-[12rem] hover:bg-slate-100">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  key={'ALL'}
                  value='ALL'>
                  Selecione o status
                </SelectItem>
                {status.map(status => (
                  <SelectItem key={status.id} value={status.id}>{status.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              defaultValue={undefined}
              onValueChange={value => setFilter({ ...filter, workflowId: value })}
            >
              <SelectTrigger className="w-[12rem] hover:bg-slate-100">
                <SelectValue placeholder="Selecione a tarefa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  key={'ALL'}
                  value='ALL'>
                  Selecione a tarefa
                </SelectItem>
                {workflow.map(workflow => (
                  <SelectItem key={workflow.id} value={workflow.id}>{workflow.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reload}
              className="flex w-40 text-center text-white justify-center items-center bg-green-700 rounded-md shadow-md hover:bg-green-900 hover:cursor-pointer">
              <RefreshCcwIcon
                onClick={reload}
                className={`${loadingAnimation ? 'animate-spin' : ''} w-full p-2 h-10`} />
            </button>
            <Dialog>
              <DialogTrigger className="w-40 flex rounded-md shadow-md h-10 text-center justify-center items-center hover:cursor-pointer text-white">
                <TrashIcon className="bg-white h-10 rounded-md text-red-600 shadow-md w-40 p-2 hover:bg-red-900 hover:cursor-pointer hover:text-white" />
              </DialogTrigger>
              <DialogContent className="w-auto flow flow-col gap-4 bg-slate-200 text-slate-800 shadow-lg">
                <DialogDescription className="flex justify-center text-slate-800 items-center px-2 gap-4">
                  <ShieldAlertIcon />
                  <Label>Limpar todos os logs?</Label>
                </DialogDescription>
                <DialogClose className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-32"
                  >Voltar</Button>
                  <Button
                    type="button"
                    onClick={dropLog}
                    className="w-32">Confirmar</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="text-slate-900 bg-slate-200 rounded-lg shadow-lg">
          <Table>
            <TableCaption className="my-4">Logs de execução</TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="w-[15%]">Workflow Group</TableHead>
                <TableHead className="w-[15%]">task</TableHead>
                <TableHead className="w-[10%]">Codigo</TableHead>
                <TableHead className="w-[15%]">Inicio</TableHead>
                <TableHead className="w-[15%]">Fim</TableHead>
                <TableHead className="w-auto ">Info</TableHead>
                <TableHead className="w-[10%] text-center">Status</TableHead>
                <TableHead className="w-[5%] text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...logs.filter(log =>
                (filter.status === 'ALL' || log.status === filter.status) &&
                (filter.workflowId === 'ALL' || log.workflow.id === filter.workflowId) &&
                (filter.contextId === 'ALL' || log.workflow.context_id === filter.contextId)
              )].map((log, index) => (
                <TableRow
                  key={log.id}
                  className={index % 2 === 0 ? "bg-slate-200" : "bg-slate-100"}>
                  <TableCell>{log.context?.name}</TableCell>
                  <TableCell>{log.workflow.name}</TableCell>
                  <TableCell>{log.code}</TableCell>
                  <TableCell>{format(log.start_at, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell>{log.finish_at ? format(log.finish_at, 'dd/MM/yyyy HH:mm:ss') : "-"}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${statusLogBackgroudColor(log.status)} rounded-md text-md w-20 justify-center `}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    onClick={() => dropLogById(log.id)}
                    className="flex justify-center items-center hover:text-red-600 hover:cursor-pointer">
                    <Trash2Icon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell colSpan={7}>Quantidade</TableCell>
              <TableCell >{logs?.length}</TableCell>
            </TableFooter>
          </Table>
        </div>
        <Toaster position="bottom-left" />
      </>
    </Container >
  )
}