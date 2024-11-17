import { VStack, StackDivider, styled, Text, Center, Image } from "@chakra-ui/react";
import FileUploader from "./FileUploader";
import { UploadMetaData } from "./state";
import UploadCard from "./UploadCard";
import * as style from "./style"
interface Props {
    uploadMetaDatas: UploadMetaData[];
    onFileAccepted: Function;
    showUploader: boolean;
    setShowContent: Function;
    setContentId: Function;
}

const UploadPanel = (props: Props) => {
    const createUploadCard = (upload: UploadMetaData) => {
        const uploadCardProps = {
            metadata: upload,
            setShowContent: props.setShowContent,
            setContentId: props.setContentId,
        };
        return <UploadCard key={upload.id} {...uploadCardProps}></UploadCard>;
    };

    const createUploadCards = (uploads: UploadMetaData[]) => {
        return uploads.map((upload) => {
            return createUploadCard(upload);
        });
    };

    const fileUploaderProps = {
        onFileAccepted: props.onFileAccepted,
    };
    return (
        <>
            {!props.showUploader && (
                <VStack
                    divider={
                        <StackDivider {...style.stackDividerStyle} />
                    }
                    overflowY={props.uploadMetaDatas.length === 0 ? "hidden" : "scroll"}
                    {...style.uploadPanelVStackStyle}
                >
                    {props.uploadMetaDatas.length > 0 &&
                        createUploadCards(props.uploadMetaDatas)
                    }

                    {props.uploadMetaDatas.length === 0 &&
                        <Center><Image alt="No History" src="no_history.svg" ></Image></Center>
                    }
                </VStack>
            )}

            {props.showUploader && (
                <FileUploader {...fileUploaderProps} />
            )}
        </>
    );
};

export default UploadPanel;
