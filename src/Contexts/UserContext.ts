import {createContext, useContext} from "react";


interface UserContextType {
    login: () => Promise<void>;
    register: () => Promise<void>;
    verifyCode: () => Promise<void>;

    isAuthenticated: boolean;


}

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser() must be used within a UserProvider');
    }
    return context;
};
