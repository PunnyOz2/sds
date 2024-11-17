import {
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    Stack,
    useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import ErrorModal, { ModalMessage } from "../Modal/errorModal";

const LoginControl = () => {
    //state for username & password form has changed.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const isUsernameEmpty = username === "";
    const isPasswordEmpty = password === "";
    const [invalidData, setInvalidData] = useState(false);

    //state for login modal error
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [modalMessage, setModalMessage] = useState<ModalMessage>(
        {} as ModalMessage
    );

    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    const handleUsernameChange = (e: FormEvent<HTMLInputElement>) => {
        if (!usernameChanged) {
            setUsernameChanged(true);
        }
        setUsername(e.currentTarget.value);
    };
    const handlePasswordChange = (e: FormEvent<HTMLInputElement>) => {
        if (!passwordChanged) {
            setPasswordChanged(true);
        }
        setPassword(e.currentTarget.value);
    };

    const handleLoginButton = async () => {
        try {
            const resp = await axios.post("/users/login/", {
                username: username,
                password: password,
            });
            if (resp.status === 200) {
                router.push(`/inference`);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    setInvalidData(true);
                } else {
                    onOpen();
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
            <Stack spacing={4} w={"full"} px={"10"}>
                <FormControl
                    id="username"
                    isInvalid={
                        (isUsernameEmpty || invalidData) && usernameChanged
                    }
                >
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    {isUsernameEmpty && (
                        <FormErrorMessage>
                            Please enter your username
                        </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl
                    id="password"
                    isInvalid={
                        (isPasswordEmpty || invalidData) && passwordChanged
                    }
                >
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {isPasswordEmpty && (
                        <FormErrorMessage>
                            Please enter your password
                        </FormErrorMessage>
                    )}
                    {invalidData && (
                        <FormErrorMessage>
                            Invalid Username or Password
                        </FormErrorMessage>
                    )}
                </FormControl>
                <Button
                    bg={"#2543CE"}
                    color={"white"}
                    w={"40%"}
                    onClick={handleLoginButton}
                >
                    Login
                </Button>
            </Stack>
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

export default LoginControl;
