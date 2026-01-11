// views/pages/error/page-not-found/PageNotFound.tsx
import { useNavigate } from "react-router-dom";

import {
    Actions,
    Desc,
    ErrorContainer,
    GhostBtn,
    PrimaryBtn,
    Title,
    Wrap,
} from "./PageNotFound.styles";

export default function PageNotFound() {
    const navigate = useNavigate();

    return (
        <Wrap>
            <ErrorContainer>
                <Title>Sorry, this page isn't available.</Title>
                <Desc>The link may be broken, or the page may have been removed.</Desc>

                <Actions>
                    <PrimaryBtn type="button" onClick={() => navigate("/")}>
                        Go to Home
                    </PrimaryBtn>
                    <GhostBtn type="button" onClick={() => navigate(-1)}>
                        Go Back
                    </GhostBtn>
                </Actions>
            </ErrorContainer>
        </Wrap>
    );
}
