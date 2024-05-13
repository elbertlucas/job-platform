import { useState } from "react";
import { api } from "@/lib/api"
import { toast } from "sonner"
import { logs } from "@/models/logs"
import axios from "axios"
import { ScopedMutator } from "swr/_internal";
import { DateRange } from "react-day-picker";

export default function useLogs() {
	const [loadingAnimation, setLoadingAnimation] = useState(false)

	const formatLogs = (logs: never[] | logs[]) => {
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

		return {
			contexts,
			status,
			workflow
		}
	}

	const reload = (date: DateRange | undefined, mutate: ScopedMutator) => {
		mutate(`/logs/?from=${date?.from}&to=${date?.to}`)
		setLoadingAnimation(true)
		setTimeout(() => setLoadingAnimation(false), 500)
	}

	const dropLog = async (date: DateRange | undefined, mutate: ScopedMutator) => {
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

	const dropLogById = async (date: DateRange | undefined, logId: string, mutate: ScopedMutator) => {
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

	return {
		reload,
		dropLogById,
		dropLog,
		loadingAnimation,
		formatLogs
	}
}