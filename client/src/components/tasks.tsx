import { api } from "@/lib/api";
import SchedulerTasks from "./scheduler-tasks";
import { Button } from "./ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { WorkflowType } from "@/models/workflow";
import { mutate } from "swr";
import { toast } from "sonner";

interface props {
    workflow: WorkflowType
    workflowSelected: string
}

export default function Tasks({ workflow, workflowSelected }: props) {

    const dropTask = async (taskid: string) => {
        try {
            await api.delete(`/tasks/${taskid}`);
            mutate('/workflow')
            toast.success('agendamento deletado')
        } catch (error: any) {
            toast.error('erro ao deletar agendamento', {
                description: `${JSON.stringify(error?.response?.data?.message)}`
            })
        }
    }

    const deactivateTask = async (taskid: string) => {
        try {
            await api.post(`/tasks/deactivate/${taskid}`);
            mutate('/workflow')
            toast.success('agendamento desativado')
        } catch (error: any) {
            toast.error('erro ao desativar agendamento', {
                description: `${JSON.stringify(error?.response?.data?.message)}`
            })
        }
    }

    const activateTask = async (taskid: string) => {
        try {
            await api.post(`/tasks/activate/${taskid}`);
            mutate('/workflow')
            toast.success('agendamento reativado')
        } catch (error: any) {
            toast.error('erro ao reativar agendamento', {
                description: `${JSON.stringify(error?.response?.data?.message)}`
            })
        }
    }


    return (
        <>
            <DialogHeader>
                <DialogTitle>Agendamento de tarefas</DialogTitle>
            </DialogHeader>
            <SchedulerTasks workflowSelected={workflowSelected} />
            {
                workflow.tasks.map(task => (
                    <div className="flex gap-2 justify-around items-center w-full p-4 my-2 shadow-lg rounded-md">
                        <div className="flex flex-col w-full gap-1">
                            <Label >
                                NOME:
                            </Label>
                            <Label className="text-md uppercase">
                                {task.name}
                            </Label>
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <Label>
                                AGENDAMENTO:
                            </Label>
                            <Label className="text-md">
                                {task.label}
                            </Label>
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <Label>
                                Código:
                            </Label>
                            <Label className="text-lg">
                                {task.cron_time}
                            </Label>
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <Label >
                                STATUS:
                            </Label>
                            <Label className="text-lg">
                                {task.active ? 'ATIVO' : 'INATIVO'}
                            </Label>
                        </div>
                        {
                            task.active ?
                                <Button
                                    type="button"
                                    onClick={() => deactivateTask(task.id)}
                                >Inativar
                                </Button>
                                : <Button
                                    type="button"
                                    onClick={() => activateTask(task.id)}
                                >Ativar
                                </Button>
                        }
                        <Button
                            type="button"
                            onClick={() => dropTask(task.id)}
                            variant="destructive"
                        >Excluir
                        </Button>
                    </div>
                ))
            }
            <DialogFooter>
                <DialogClose>
                    <Button
                        type="button"
                        className="w-40"
                    >Fechar</Button>
                </DialogClose>
            </DialogFooter>
        </>
    )
}




