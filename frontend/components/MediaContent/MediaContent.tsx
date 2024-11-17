import { Flex, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as style from "./style";

interface Props {
    showContent: string;
    contentId: string;
}

const MediaContent = (props: Props) => {
    const [content, setContent] = useState(
        <Image src="media_content_picture.svg" {...style.defaultImageStyle}></Image>
    );

    useEffect(() => {
        return setContent(getContent());
    }, [props.showContent]);

    const getContent = () => {
        if (props.showContent !== "") {
            if (props.showContent.split(".")[1] === "mp4") {
                return (
                    <video
                        style={{ maxHeight: "50vh" }}
                        controls
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/inference/files/${props.contentId}/?download=0`}
                    ></video>
                );
            } else {
                return (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/inference/files/${props.contentId}/?download=0`}
                        maxH={"50vh"}
                    />
                );
            }
        }
        return <Image src="media_content_picture.svg" {...style.defaultImageStyle}></Image>;
    };

    return (
        <Flex {...style.flexStyle}>
            {content}
        </Flex>
    );
};

export default MediaContent;
