import { Box, Flex, Grid, GridItem, HStack, styled, Text, VStack } from "@chakra-ui/react"
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import * as style from './style'

const QuotaInformation = () => {
    const { user, setUser } = useContext(UserContext)

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    })

    return (
        <Flex flex={2} direction={"column"} maxW={"220px"}>
            <Text {...style.todayQuotaTextStyle}>Today's Quota</Text>
            <Text {...style.todayDateStyle}>{formattedDate}</Text>
            <Grid {...style.gridStyle}>
                <GridItem {...style.gridItemLabelStyle}>Image</GridItem>
                <GridItem {...style.gridItemInfoStyle}>
                    <Box {...style.quotaInfoBoxStyle}>
                        {user?.quota?.image ?? 0}/10 files
                    </Box>
                </GridItem>
                <GridItem {...style.gridItemLabelStyle}>Video</GridItem>
                <GridItem {...style.gridItemInfoStyle}>
                    <Box {...style.quotaInfoBoxStyle}>
                        {user?.quota?.video ?? 0}/30 seconds
                    </Box>
                </GridItem>
            </Grid>
        </Flex>
    )
};

export default QuotaInformation;