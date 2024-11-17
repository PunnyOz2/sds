import { Flex, FlexProps, Spinner, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import MediaContent from "../components/MediaContent/MediaContent";
import MediaControl from "../components/MediaControl/MediaControl";
import Navbar from "../components/Navbar";
import { checkLoggedIn } from "../context/checkLogin";
import { UserContext } from "../context/userContext";

const Inferece: NextPage = () => {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);
    const [showContent, setShowContent] = useState("");
    const [contentId, setContentId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuota = async () => {
            const data = await checkLoggedIn();
            if (data) {
                setUser(data);
                setIsLoading(false);
            } else {
                router.push(`/inference`);
            }
        };
        fetchQuota();
    }, []);

    const NavbarProps: FlexProps = {
        flex: 3,
        borderBottom: "1px solid #E5E5E5",
        background: "white",
    };

    const MediaContentProps: FlexProps = {
        flex: 85,
        p: 6,
        background: "#DEE3EA1A",
    };

    const MediaControlProps: FlexProps = {
        flex: 5,
        p: 6,
        background: "#F9FBFE",
    };

    const FooterProps: FlexProps = {
        flex: 2,
        bg: "#1653A9",
        alignItems: "center",
        px: "12",
        color: "white",
        justify: "space-between",
        fontWeight: "300",
        fontSize: "14px",
        bottom: 0,
    };

    const mediaContentProps = {
        showContent: showContent,
        contentId: contentId,
    };

    const mediaControlProps = {
        setShowContent: setShowContent,
        setContentId: setContentId,
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Head>
                        <title>DeepGI Inference</title>
                    </Head>
                    <Flex direction={"column"} minH={"100vh"}>
                        <Flex {...NavbarProps}>
                            <Navbar />
                        </Flex>
                        <Flex {...MediaContentProps}>
                            <MediaContent {...mediaContentProps} />
                        </Flex>
                        <Flex maxHeight={"308px"} {...MediaControlProps}>
                            <MediaControl {...mediaControlProps} />
                        </Flex>
                        <Flex {...FooterProps}>
                            <Text> ©️ 2021 DeepGI. All rights reserved.</Text>
                            <Text> Not for clinical use.</Text>
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    );
};

export default Inferece;
