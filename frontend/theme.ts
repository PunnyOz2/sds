import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                background: "#F9FBFE",
            },
        },
    },
    fonts: {
        body: "Noto Sans",
    },
    components: {
        Button: {
            baseStyle: {
            borderRadius: "2",
            },
        },
    },
});

export default theme;
