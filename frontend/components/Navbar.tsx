import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Flex,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import ErrorModal, { ModalMessage } from "./Modal/errorModal";
import * as style from "./style";

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    const { onOpen, isOpen, onClose } = useDisclosure();
    const [modalMessage, setModalMessage] = useState<ModalMessage>(
        {} as ModalMessage
    );
    const signOut = async () => {
        try {
            await axios.delete("users/");
            setUser({
                username: "",
                isLoggedIn: false,
                quota: {
                    image: 0,
                    video: 0,
                },
            });
            router.push(`/`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                onOpen();
                if (error.response?.status === 403) {
                    setModalMessage({
                        modaltitle: "Logout failed",
                        modalmessage: error.response.data.detail,
                    });
                } else {
                    setModalMessage({
                        modaltitle: "Connection Error",
                        modalmessage:
                            "Please ensure that your network is connected.",
                    });
                }
            } else {
                onOpen();
                setModalMessage({
                    modaltitle: "Something went wrong",
                    modalmessage: "Something went wrong",
                });
            }
        }
    };

    return (
        <>
            <Flex direction={"row"} {...style.flexStyle}>
                <Image {...style.deepGiLogo} />
                <Menu>
                    <MenuButton fontWeight={"700"}>
                        Hello, {user.username} <ChevronDownIcon />
                    </MenuButton>
                    <MenuList {...style.menuListStyle}>
                        <MenuItem {...style.menuItemStyle} onClick={signOut}>
                            <Image {...style.signoutIconStyle} />
                            <span> Sign out</span>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            {isOpen ? (
                <ErrorModal
                    isshow={isOpen}
                    onclose={onClose}
                    {...modalMessage}
                ></ErrorModal>
            ) : (
                <></>
            )}
        </>
    );
};

export default Navbar;
