import { useState, useEffect } from "react";
import querystring from "querystring"
import { api } from "@/lib/api";
import { InputsLogin } from "@/contexts/auth-context";
import { toast } from "sonner"
import { User } from "./useUsers";

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<undefined | User>()
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
            api.get('/me').then((user: { data: unknown }) => {
                setUser(user?.data as User)
                setAuthenticated(true);
            }).catch(() => {
                setAuthenticated(false);
                localStorage.removeItem("token");
                api.defaults.headers.common.Authorization = undefined;
            })
        }
        setLoading(false);
    }, []);

    async function login(data: InputsLogin) {
        try {
            const formData = querystring.stringify({
                grant_type: 'password',
                username: data.username,
                password: data.password,
            });

            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };
            const response = await api.post('/login', formData, config)
            api.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
            const res = await api.get('/me')
            setUser(res.data)
            localStorage.setItem('token', response.data.access_token)
            setAuthenticated(true);
            setLoading(false)
        } catch (error) {
            toast.error('Usuário e/ou senha inválidos')
        }
    }

    async function logout() {
        setAuthenticated(false);
        setUser(undefined)
        localStorage.removeItem("token");
        api.defaults.headers.common.Authorization = undefined;
    }

    return {
        login,
        logout,
        loading,
        authenticated,
        user
    };
}