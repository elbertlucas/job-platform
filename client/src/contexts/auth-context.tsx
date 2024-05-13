import useAuth from "@/hooks/useAuth";
import { User } from "@/hooks/useUsers";
import { createContext } from "react";

export type InputsLogin = {
    username: string
    password: string
}

type AuthContext = {
    login: (data: InputsLogin) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    authenticated: boolean,
    user: User | undefined
}

const AuthContext = createContext({} as AuthContext);

export const AuthProvider = ({ children }: any) => {
    const auth = useAuth()
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;