import { api } from "@/lib/api";
import { toast } from "sonner"
import { ScopedMutator } from "swr/_internal";

export interface FormCreateWorkflowProps {
	name: string;
}

export default function useWorkflow() {


	const create = async (dataForm: FormCreateWorkflowProps, contextSelected: string, mutate: ScopedMutator) => {
		try {
			const createContext = {
				name: dataForm.name,
				context_id: contextSelected
			}
			if (!createContext.context_id) throw new Error()
			await api.post('/workflow', { ...createContext });
			mutate('/workflow')
			toast.success('Tarefa criada')
		} catch (error: any) {
			toast.error('Erro ao criar tarefa',
				{ description: `${JSON.stringify(error?.response?.data?.message)}` })
		}
	}

	const execute = async (workflowId: string, mutate: ScopedMutator) => {
		try {
			await api.get(`/tasks/${workflowId}`);
			mutate('/workflow')
			toast.success('tarefas em execução confira seção de logs para mais detalhes!')
		} catch (error: any) {
			toast.error('Erro ao executar tarefa',
				{ description: `${JSON.stringify(error?.response?.data?.message)}` })
		}
	}


	const drop = async (workflowId: string, mutate: ScopedMutator) => {
		try {
			await api.delete(`/workflow/${workflowId}`);
			mutate('/workflow')
			toast.success('Tarefa deletada')
		} catch (error: any) {
			toast.error('Erro ao deletar tarefa',
				{ description: `${JSON.stringify(error?.response?.data?.message)}` })
		}
	}

	const deactivateWorkflow = async (workflowId: string, mutate: ScopedMutator) => {
		try {
			await api.post(`/workflow/deactivate/${workflowId}`);
			mutate('/workflow')
			toast.success('Tarefa desativada')
		} catch (error: any) {
			toast.error('Erro ao desativar tarefa',
				{ description: `${JSON.stringify(error?.response?.data?.message)}` })
		}
	}

	const activateWorkflow = async (workflowId: string, mutate: ScopedMutator) => {
		try {
			await api.post(`/workflow/activate/${workflowId}`);
			mutate('/workflow')
			toast.success('Tarefa reativada')
		} catch (error: any) {
			toast.error('Erro ao reativar tarefa',
				{ description: `${JSON.stringify(error?.response?.data?.message)}` })
		}
	}


	return {
		execute,
		drop,
		deactivateWorkflow,
		activateWorkflow,
		create
	}
}