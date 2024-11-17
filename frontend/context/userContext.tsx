import { createContext, useState } from "react";

export interface User {
    isLoggedIn: Boolean;
    username: String;
    quota: {
        image: number;
        video: number;
    }
}

export const useUser = () => {
    const [user, setUser] = useState<User>({} as User);
    return {
        user,
        setUser
    };
};
export const UserContext = createContext({} as ReturnType<typeof useUser>);