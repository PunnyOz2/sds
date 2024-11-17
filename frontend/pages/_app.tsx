import "../styles/globals.css";
//import "../styles/Dino.css"
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import axios from "axios";
import ProvideAuth from "../context/provideAuth";
import theme from "../theme";


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ProvideAuth>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </ProvideAuth>
    );
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default MyApp;
