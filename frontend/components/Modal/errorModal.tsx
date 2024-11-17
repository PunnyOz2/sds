import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
interface errorModalProps {
    isshow: boolean;
    modaltitle: string;
    modalmessage: string;
    onclose: () => void;
}

export interface ModalMessage {
    modaltitle: string;
    modalmessage: string;
}

export const ErrorModal = (props: errorModalProps) => {
    return (
        <>
            <Modal isOpen={props.isshow} onClose={props.onclose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.modaltitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{props.modalmessage}</ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ErrorModal;
