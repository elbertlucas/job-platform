import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner"
import { ScopedMutator } from "swr/_internal";

export interface FormCreateContextProps {
  name: string;
}

export default function useWorkflowGroup() {
  const [contextName, setContextName] = useState('');

  const updateContextName = async (contexId: string, mutate: ScopedMutator) => {
    try {
      await api.patch(`/context/${contexId}`, { name: contextName });
      mutate('/context')
      toast.success('Nome alterado')
    } catch (error: any) {
      toast.error('erro ao alterar nome', {
        description: `${JSON.stringify(error?.response?.data?.message)}`
      })
    }
  };

  const create = async (createContext: FormCreateContextProps, mutate: ScopedMutator) => {
    try {
      await api.post('/context', { ...createContext });
      mutate('/context')
      toast.success('Grupo criado')
    } catch (error: any) {
      toast.error('erro ao criar grupo', {
        description: `${JSON.stringify(error?.response?.data?.message)}`
      })
    }
  }

  const drop = async (contextId: string, mutate: ScopedMutator) => {
    try {
      await api.delete(`/context/${contextId}`);
      mutate('/context')
      toast.success('Grupo deletado')
    } catch (error: any) {
      toast.error('erro ao deletar grupo', {
        description: `${JSON.stringify(error?.response?.data?.message)}`
      })
    }
  }

  const execute = async (contextName: string, mutate: ScopedMutator) => {
    try {
      await api.post(`/context/${contextName}`);
      mutate('/context')
      toast.success('Grupo de tarefas em execução confira seção de logs para mais detalhes!')
    } catch (error: any) {
      toast.error('erro ao executar grupo de tarefas  ', {
        description: `${JSON.stringify(error?.response?.data?.message)}`
      })
    }
  }

  const deactivateWorkflowGroup = async (workflowId: string, mutate: ScopedMutator) => {
    try {
      await api.post(`/context/deactivate/${workflowId}`);
      mutate('/context')
      toast.success('Grupo desativado')
    } catch (error: any) {
      toast.error('erro ao desativar grupo', {
        description: `${JSON.stringify(error?.response?.data?.message)}`
      })
    }
  }

  const activateWorkflowGroup = async (workflowId: string, mutate: ScopedMutator) => {
    try {
      await api.post(`/context/activate/${workflowId}`);
      mutate('/context')
      toast.success('Grupo reativado!')
    } catch (error: any) {
      toast.error('erro ao reativar grupo', {
        description: `${JSON.stringify(error?.response?.data?.message)}`
      })
    }
  }

  return {
    updateContextName,
    create,
    activateWorkflowGroup,
    deactivateWorkflowGroup,
    execute,
    drop,
    contextName,
    setContextName
  }

}