import { Button, Flex, Text } from "@chakra-ui/react";
import * as style from './style'
interface Props {
    handleOnclick: Function,
}

const UploadHeader = (props: Props) => {

    return (
        <Flex {...style.uploadHeaderFlexStyle}>

            <Text {...style.submitFileTextStyle}>Submit File</Text>
            <Button
                {...style.uploadHeaderButtonStyle}
                onClick={() => props.handleOnclick()}
            >History</Button>
        </Flex>
    );
};

export default UploadHeader;
