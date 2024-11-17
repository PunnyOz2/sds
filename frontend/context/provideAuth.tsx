import axios from "axios";
import React from "react";
import { User, UserContext, useUser } from "./userContext";

type Props = {
    children: React.ReactNode;
};

const ProvideAuth = ({ children }: Props) => {
    const { user, setUser } = useUser();

    const checkLoggedIn = async () => {
        try {
            const res = await axios.get("/users/");
            setUser({
                username: res.data.data.username,
                isLoggedIn: true,
                quota: {
                    image: res.data.data.image_quota,
                    video: res.data.data.video_quota,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        // hydrate on mount
        checkLoggedIn();
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default ProvideAuth;
