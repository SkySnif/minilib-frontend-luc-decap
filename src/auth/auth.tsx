import { createContext, useContext } from "react";
import type AuthContextType from "react";

// Minimaliste - only set hardcoded without setter
type AuthContextType = 
{
    isallowToEdit: boolean;
    isallowToDelete: boolean;
    isAllowToBook: boolean;
    AdherentUserName?: string;
};

const AuthContext = createContext<AuthContextType>(
    { 
        isallowToEdit: true,
        isallowToDelete: true,
        isAllowToBook: true
    }
);

export const useAuth = () => 
    useContext(AuthContext);