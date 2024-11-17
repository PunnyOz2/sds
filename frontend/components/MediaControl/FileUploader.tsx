import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Center, useColorModeValue, Image, Flex, useDisclosure, Modal, ModalBody, ModalOverlay, ModalContent, VStack, Text } from "@chakra-ui/react";
import * as style from "./style";

interface Props {
    onFileAccepted: Function;
}

const FileUploader = (props: Props) => {
    const { onOpen, isOpen, onClose } = useDisclosure();

    const onDrop = useCallback((acceptedFiles:any) => {
        props.onFileAccepted(acceptedFiles[0], onOpen, onClose);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/jpeg, video/mp4",
        maxFiles: 1,
        multiple: false,
    });

    const activeBg = useColorModeValue("gray.100", "gray.600");

    return (
        <Center
            {...style.fileUploaderStyle}
            bg={isDragActive ? activeBg : "transparent"}
            _hover={{ bg: activeBg }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <Flex>
                <Image src="upload_background.png" />
            </Flex>
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
                size="sm"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody alignSelf={"center"}>
                        <Center marginY={"10px"}>
                            <VStack>
                                <Text>Upload Succeeded</Text>
                                <Image {...style.modalImageStyle} />
                            </VStack>
                        </Center>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Center>

    );
};

export default FileUploader;
