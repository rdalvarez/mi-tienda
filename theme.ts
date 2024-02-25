import { theme } from "@chakra-ui/theme";
import { extendTheme } from "@chakra-ui/theme-utils";

export default extendTheme({
    colors:{
        primary: theme.colors['teal']
    },
    styles:{
        global:{
            body:{
                backgroundColor: "primary.50",
            },
        },
    },
});