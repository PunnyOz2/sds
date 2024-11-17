import { Flex, FlexProps, Stack, StackProps } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import LoginControl from "../components/auth/loginControl";
import { checkLoggedIn } from "../context/checkLogin";
import { UserContext } from "../context/userContext";

const Home: NextPage = () => {
    const { setUser } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        const firstTime = async () => {
            const data = await checkLoggedIn();
            if (data) {
                setUser(data);
                router.push(`/inference`);
            }
        };
        firstTime();
    }, []);

    const stackProps: StackProps = {
        m: "auto",
        minW: "4xl",
        spacing: "0",
        direction: "row",
        align: "center",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        background: "white",
    };

    const loginBackgroundProps: FlexProps = {
        flex: 1,
        minH: "2xl",
        backgroundImage: "login_background.png",
        backgroundSize: "cover",
        borderRadius: "12px 0px 0px 12px",
    };
    return (
        <>
            <Head>
                <title>DeepGI Demo Application</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Flex minH={"100vh"}>
                <Stack {...stackProps}>
                    <Flex {...loginBackgroundProps}></Flex>
                    <Flex flex={1}>
                        <LoginControl></LoginControl>
                    </Flex>
                </Stack>
            </Flex>
        </>
    );
};

export default Home;

