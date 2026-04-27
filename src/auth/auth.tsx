import { createContext, useContext } from "react";
import type AuthContextType from "react";

// Minimaliste - only set hardcoded without setter
type AuthContextType = 
{
    isallowToEdit: boolean;
    isallowToCreate: boolean;
    isallowToDelete: boolean;
    isAllowToBook: boolean;
    AdherentUserId?: string;
    AdherentUserName?: string;
};

const AuthContext = createContext<AuthContextType>(
    { 
        isallowToEdit: true,
        isallowToCreate: true,
        isallowToDelete: true,
        isAllowToBook: true
    }
);

export const useAuth = () => 
    useContext(AuthContext);