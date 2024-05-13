import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { cronOptions, diasOptions, horaOptions, horasOptions, typeOptions } from "@/utils/_";
import { mutate } from "swr";
import { api } from "@/lib/api";
import { Input } from "./ui/input";
import { toast } from "sonner";

type FormCreatetaskProps = {
  label: string,
  cron_time: string,
  hours: string,
  hours_label: string,
  day: string,
  day_label: string,
  typeOptions?: typeOptions
}

const createTask = async (label: string, cronTime: string, workflowSelected: string) => {
  try {
    const input = {
      workflow_id: workflowSelected,
      label: label,
      cron_time: cronTime,
    }
    await api.post("/tasks", input);
    mutate('/workflow')
    toast.success('Tarefa agendada')
  } catch (error: any) {
    toast.error('erro ao agendar tarefa', { description: `${JSON.stringify(error?.response?.data?.message)}` })
  }
}

interface Props {
  workflowSelected: string
}

export default function SchedulerTasks({ workflowSelected }: Props) {
  const { handleSubmit: handleSubmitFormCreateTask, register, setValue, reset } = useForm<FormCreatetaskProps>();
  const onSubmitFormCreateTask = (data: FormCreatetaskProps) => {
    const { label, cron_time, typeOptions, hours, hours_label, day, day_label } = data
    if (typeOptions == 'SEMANAL') {
      const label = day_label + hours_label
      const cron_time = hours + day

      createTask(label, cron_time, workflowSelected)
      reset()
    } else {
      createTask(label, cron_time, workflowSelected)
      reset()
    }
  };
  return (

    <div className="flex flex-col w-full justify-center items-center gap-2 shadow-lg">
      <div>
        Selecione o Modo
      </div>
      <form onSubmit={handleSubmitFormCreateTask(onSubmitFormCreateTask)} className="flex w-full">
        <Tabs defaultValue="intervalo" className="flex flex-col justify-center w-full">
          <TabsList className="bg-secundary">
            <TabsTrigger value="intervalo">Intervalo</TabsTrigger>
            <TabsTrigger value="diario">Diário</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
          </TabsList>
          <TabsContent
            value="intervalo"
            className="flex items-center w-full m-0 p-0"
          >
            <Select
              onValueChange={value => {
                setValue("cron_time", JSON.parse(value).cron_time)
                setValue("label", JSON.parse(value).label)
              }}
            >
              <SelectTrigger className="bg-slate-700 text-center text-md text-white cursor-pointer ">
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent
                className="bg-slate-700 text-center text-md text-white max-h-60">
                {cronOptions.map(option => (
                  <SelectItem
                    className="cursor-pointer"
                    value={JSON.stringify(option)}
                  >{option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              onClick={() => setValue('typeOptions', "INTERVALO")}
              className="w-20"
            >Agendar
            </Button>
          </TabsContent>
          <TabsContent
            value="diario"
            className="flex items-center w-full m-0 p-0"
          >
            <Select
              onValueChange={value => {
                setValue("cron_time", JSON.parse(value).cron_time)
                setValue("label", JSON.parse(value).label)
              }}
            >
              <SelectTrigger className="bg-slate-700 text-center text-md text-white cursor-pointer ">
                <SelectValue placeholder="Selecione a hora" />
              </SelectTrigger>
              <SelectContent
                className="bg-slate-700 text-center text-md text-white max-h-60">
                {horasOptions.map(option => (
                  <SelectItem
                    className="cursor-pointer"
                    value={JSON.stringify(option)}
                  >{option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              onClick={() => setValue('typeOptions', "DIÁRIO")}
              className="w-20"
            >Agendar
            </Button>
          </TabsContent>
          <TabsContent
            value="semanal"
            className="flex items-center w-full m-0 p-0"
          >
            <Select
              onValueChange={value => {
                setValue("day", JSON.parse(value).cron_time)
                setValue("day_label", JSON.parse(value).label)
              }}
            >
              <SelectTrigger className="bg-slate-700 text-center text-md text-white cursor-pointer ">
                <SelectValue placeholder="Selecione o dia da semana" />
              </SelectTrigger>
              <SelectContent
                className="bg-slate-700 text-center text-md text-white max-h-60">
                {diasOptions.map(option => (
                  <SelectItem
                    className="cursor-pointer"
                    value={JSON.stringify(option)}
                  >{option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              defaultValue=""
              onValueChange={value => {
                setValue("hours", JSON.parse(value).cron_time)
                setValue("hours_label", JSON.parse(value).label)
              }}
            >
              <SelectTrigger className="bg-slate-700 text-center text-md text-white cursor-pointer ">
                <SelectValue placeholder="Selecione a hora" />
              </SelectTrigger>
              <SelectContent
                className="bg-slate-700 text-center text-md text-white max-h-60">
                {horaOptions.map(option => (
                  <SelectItem
                    className="cursor-pointer"
                    value={JSON.stringify(option)}
                  >{option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              onClick={() => setValue('typeOptions', "SEMANAL")}
              className="w-20"
            >Agendar
            </Button>
          </TabsContent>
          <TabsContent
            value="personalizado"
            className="flex items-center w-full m-0 p-0"
          >
            <Input
              className="flex bg-slate-700 text-center text-md text-white"
              type="text"
              placeholder="Digite um Titulo"
              {...register('label')}
            />
            <Input
              className="flex bg-slate-700 text-center text-md text-white"
              type="text"
              placeholder="digite código cron válido"
              {...register('cron_time')}
            />
            <Button
              type="submit"
              onClick={() => setValue('typeOptions', "PERSONALIZADO")}
              className="w-20"
            >Agendar
            </Button>
          </TabsContent>
        </Tabs>
      </form>
    </div >
  )
}


