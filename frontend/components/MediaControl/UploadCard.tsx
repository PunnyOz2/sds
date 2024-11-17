import {
    Box,
    Button,
    Flex,
    HStack,
    Image,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { InferenceState, UploadMetaData } from "./state";
import * as style from "./style";

interface Props {
    metadata: UploadMetaData;
    setShowContent: Function;
    setContentId: Function;
}

const UploadCard = (props: Props) => {
    const stringToDate = (dateString: string) => {
        let monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const date = new Date(dateString);
        let day = date.getDate();

        let monthIndex = date.getMonth();
        let monthName = monthNames[monthIndex];

        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes: string | number = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;

        let strTime = hours + ":" + minutes + " " + ampm;
        return `${strTime}, ${day} ${monthName} ${year}`;
    };

    const viewOnClickHandler = () => {
        props.setShowContent(props.metadata.filename);
        props.setContentId(props.metadata.id);
    };

    const downloadOnClickHandler = async () => {
        try {
            const res = await axios.get(
                `/inference/files/${props.metadata.id}/`,
                {
                    params: {
                        download: 1,
                    },
                    responseType: "blob",
                }
            );

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([res.data]));
            link.setAttribute("download", props.metadata.filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <HStack {...style.uploadCardHStackStyle}>
            <VStack {...style.uploadCardVStackStyle}>
                <Text {...style.filenameTextStyle}>
                    {props.metadata.filename}
                </Text>
                <Box {...style.uploadTimeStyle}>
                    {stringToDate(props.metadata.uploadTime)}
                </Box>
            </VStack>
            {props.metadata.state == InferenceState.FAILED && (
                <span>Error</span>
            )}
            {props.metadata.state == InferenceState.SUCCEEDED && (
                <Box>
                    <Button {...style.viewButtonStyle} onClick={() => viewOnClickHandler()}>
                        <Image src="view_icon.png" {...style.buttonIconStyle} />
                        View
                    </Button>
                    <Button {...style.downloadButtonStyle} onClick={() => downloadOnClickHandler()}>
                        <Image src="download_icon.png" {...style.buttonIconStyle} />
                        Download Result
                    </Button>
                </Box>
            )}
            {props.metadata.state == InferenceState.PROCESSING && (
                <Flex>
                    <Text {...style.processingTextStyle}>
                        Processing the file
                    </Text>
                    <Spinner speed="1s"></Spinner>
                </Flex>
            )}

            {props.metadata.state == InferenceState.FAILED && (
                <Flex cursor={"default"}>
                    <Text {...style.failedTextStyle}>
                        Something went wrong, please upload the new file
                    </Text>
                </Flex>
            )}
        </HStack>
    );
};

export default UploadCard;
