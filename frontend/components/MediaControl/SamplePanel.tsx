import {
    Box,
    Button,
    Flex,
    Image,
    Select,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import ErrorModal, { ModalMessage } from "../Modal/errorModal";
import * as style from './style';

const SamplePanel = () => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [modalMessage, setModalMessage] = useState<ModalMessage>(
        {} as ModalMessage
    );
    const downloadSampleHandler = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_SAMPLE_URL}`,
                {
                    responseType: "blob",
                    withCredentials: false,
                }
            );

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([res.data]));
            link.setAttribute("download", "polyp_samples.zip");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                onOpen();
                setModalMessage({
                    modaltitle: "Connection Error",
                    modalmessage:
                        "Please ensure that your network is connected.",
                });
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
            <Flex flex={1} bg={"white"} borderRadius={"12px"} p={6}>
                <Flex direction={"column"} justify={"space-between"}>
                    <Box cursor={"default"}>
                        <Text {...style.demoTextStyle}>
                            Here for a Demo version?
                        </Text>
                        <Text {...style.downloadSampleTextStyle}>
                            Download the sample photo to try processing here!
                        </Text>
                    </Box>
                    <Stack spacing={2}>
                        <Text {...style.selectSampleTextStyle}>
                            Select Sample
                        </Text>
                        <Select
                            placeholder="Polyp Detection"
                            fontSize={"16"}
                        ></Select>
                        <Button
                            {...style.downloadSampleButtonStyle}
                            onClick={downloadSampleHandler}
                        >
                            <Image src={"./image_icon.png"} />
                            Download Sample
                        </Button>
                    </Stack>
                </Flex>
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

export default SamplePanel;
