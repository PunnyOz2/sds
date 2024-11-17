import { Flex } from "@chakra-ui/react";
import { MediaControlState } from "../state";
import HistoryHeader from "./HistoryHeader";
import UploadHeader from "./UploadHeader";

interface Props {
    historyOnclickHandler: Function;
    backOnclickHandler: Function;
    refreshOnclickHandler: Function;
    state: MediaControlState;
}

const MediaControlHeader = (props: Props) => {
    const uploadHeaderProps = {
        handleOnclick: props.historyOnclickHandler,
    };
    const historyHeaderProps = {
        backOnclickHandler: props.backOnclickHandler,
        refreshOnclickHandler: props.refreshOnclickHandler,
    };
    return (
        <Flex maxH={"60px"}>
            {props.state === MediaControlState.UPLOAD && (
                <UploadHeader {...uploadHeaderProps} />
            )}

            {props.state === MediaControlState.HISTORY && (
                <HistoryHeader {...historyHeaderProps} />
            )}
        </Flex>
    );
};

export default MediaControlHeader;
