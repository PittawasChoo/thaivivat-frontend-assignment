import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            background: string;
            text: string;
            border: string;
            primary: string;
            secondary: string;
        };
    }
}
