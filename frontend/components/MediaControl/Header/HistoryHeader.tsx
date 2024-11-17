import { Box, Button, Flex, HStack, Image, Text } from "@chakra-ui/react";
import * as style from './style';
interface Props {
    backOnclickHandler: Function,
    refreshOnclickHandler: Function,
}

const HistoryHeader = (props: Props) => {

    return (
        <Flex
            {...style.flexStyle}
        >
            <HStack width={"50%"} alignItems={"center"}>
                <Button
                    {...style.backButtonStyle}
                    onClick={() => { props.backOnclickHandler() }}
                >
                    <Image src="./back_arrow.png" />
                </Button>
                <Box {...style.iconAndTextWrapBoxStyle}>
                    <Image src="./history_icon.png" />
                    <Text {...style.historyTextStyle}>History</Text>
                </Box>

            </HStack>
            <Button
                {...style.refreshButtonStyle}
                onClick={() => { props.refreshOnclickHandler() }}
            > Refresh </Button>
        </Flex>
    );
};

export default HistoryHeader;
