import { Center, Flex, Image, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import UploadPanel from "./UploadPanel";
import MediaControlHeader from "./Header/MediaControlHeader";
import QuotaInformation from "./QuotaInformation";
import SamplePanel from "./SamplePanel";
import { MediaControlState, UploadMetaData } from "./state";
import { checkLoggedIn } from "../../context/checkLogin";
import useInterval from "@use-it/interval";
import * as style from "./style";

interface Props {
    setShowContent: Function;
    setContentId: Function;
}

const MediaControl = (props: Props) => {
    const { user, setUser } = useContext(UserContext);
    const [panel, setPanel] = useState(MediaControlState.UPLOAD);
    const initMetadata: UploadMetaData[] = [];
    const [metadata, setMetadata] = useState(initMetadata);

    useEffect(() => {
        refreshOnclickHandler();
    }, []);

    useEffect(() => {
        refreshPanelState();
    }, [metadata]);

    useInterval(() => {
        refreshOnclickHandler();
    }, 5000);

    const refreshPanelState = () => {
        if (panel == MediaControlState.UPLOAD) {
            setPanel(
                user?.quota?.image === 0 && user?.quota?.video === 0
                    ? MediaControlState.OUT_OF_QUOTA
                    : MediaControlState.UPLOAD
            );
        }
    };

    const fetchQuota = async () => {
        const data = await checkLoggedIn();
        if (data) {
            setUser(data);
        }
    };

    const historyOnclickHandler = () => {
        setPanel(MediaControlState.HISTORY);
        refreshOnclickHandler();
    };
    const backOnclickHandler = () => {
        setPanel(
            user?.quota?.image === 0 && user?.quota?.video === 0
                ? MediaControlState.OUT_OF_QUOTA
                : MediaControlState.UPLOAD
        );
    };
    const refreshOnclickHandler = async () => {
        try {
            const resp = (await axios.get("/inference/history/")).data.data;
            const history: UploadMetaData[] = resp.map((x: any) => {
                let data: UploadMetaData = {
                    id: x.id,
                    filename: x.original_file_name,
                    uploadTime: x.start_upload_time,
                    state: parseInt(x.state),
                };

                return data;
            });
            setMetadata(history);
            fetchQuota();
        } catch (error) {
            console.log(error);
        }
    };

    const headerProps = {
        historyOnclickHandler: historyOnclickHandler,
        backOnclickHandler: backOnclickHandler,
        refreshOnclickHandler: refreshOnclickHandler,
        state: panel,
    };

    const onFileAccepted = async (file: any, onOpen: Function, onClose: Function) => {
        const bodyFormData = new FormData();
        try {
            bodyFormData.append("file", file);
            await axios.post("/inference/files/",
                bodyFormData, {
                    onUploadProgress: (progressEvent) => {
                        console.log(progressEvent.loaded / progressEvent.total);
                    }
                });
            await fetchQuota();
            onOpen();
            setTimeout(() => {
                onClose()
            }, 3000)
        } catch {
            console.log("ERROR ONFILE ACCEPTED");
        }
    };

    const uploadPanelProps = {
        uploadMetaDatas: metadata,
        onFileAccepted: onFileAccepted,
        showUploader: panel !== MediaControlState.HISTORY,
        setShowContent: props.setShowContent,
        setContentId: props.setContentId,
    };

    return (
        <Stack spacing={6} direction={"row"} w="full">
            <SamplePanel />
            <Flex {...style.mediaControlFlexStyle}>
                <Stack spacing={0} w="full">
                    <MediaControlHeader {...headerProps}></MediaControlHeader>
                    {panel === MediaControlState.HISTORY && (
                        <UploadPanel {...uploadPanelProps}></UploadPanel>
                    )}
                    {panel === MediaControlState.UPLOAD && (
                        <>
                            <Flex flex={4}>
                                <Stack direction={"row"} w="full" p="5">
                                    <QuotaInformation></QuotaInformation>
                                    <Flex {...style.mediaControlUploadPanelFlexStyle}>
                                        <UploadPanel
                                            {...uploadPanelProps}
                                        ></UploadPanel>
                                    </Flex>
                                </Stack>
                            </Flex>
                        </>
                    )}
                    {panel === MediaControlState.OUT_OF_QUOTA && (
                        <>
                            <Center {...style.outOfQuotaCenterStyle}>
                                <Flex>
                                    <Image src="out_of_quota.png" />
                                </Flex>
                            </Center>
                        </>
                    )}
                </Stack>
            </Flex>
        </Stack>
    );
};

export default MediaControl;
