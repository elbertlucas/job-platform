import { api } from "@/lib/api"
import { useFetch } from "./useFetch"
import { toast } from "sonner"

export type UserCreate = {
    username: string
    password: string
    confirm_password: string
    admin: boolean
}

export type User = {
    id: string
    username: string
    active: boolean
    password: string
    role: 'admin' | 'user'
    create_at: string
    update_at: string
}

export function useUsers() {
    const { data, error, isLoading, mutate } = useFetch<User[]>('/users')

    const create = async (userCreate: UserCreate) => {
        if (userCreate.password != userCreate.confirm_password) {
            toast.error('Senhas não correspondem')
        } else {
            try {
                const role = userCreate.admin ? 'admin' : 'user'
                await api.post('/users', { ...userCreate, active: true, role });
                mutate('/users')
                toast.success("Usuário criado")
            } catch (error: any) {
                toast.error('Erro ao criar usuário', {
                    description: JSON.stringify(error?.response?.data)
                })
            }
        }
    }

    const drop = async (userId: string) => {
        try {
            await api.delete(`/users/${userId}`);
            mutate('/users')
            toast.success("Usuário deletado")
        } catch (error: any) {
            toast.error('Erro ao deletar usuário', {
                description: JSON.stringify(error?.response?.data)
            })
        }
    }

    const deactivateUser = async (userId: string) => {
        try {
            await api.post(`/users/deactivate/${userId}`);
            mutate('/users')
            toast.success('usuário desativado')
        } catch (error: any) {
            toast.error('Erro ao desativar usuário',
                { description: `${JSON.stringify(error?.response?.data?.message)}` })
        }
    }

    const activateUser = async (userId: string) => {
        try {
            await api.post(`/users/activate/${userId}`);
            mutate('/users')
            toast.success('usuário reativado')
        } catch (error: any) {
            toast.error('Erro ao reativar usuário',
                { description: `${JSON.stringify(error?.response?.data?.message)}` })
        }
    }

    return {
        users: data,
        error,
        isLoading,
        create,
        drop,
        deactivateUser,
        activateUser
    }
}