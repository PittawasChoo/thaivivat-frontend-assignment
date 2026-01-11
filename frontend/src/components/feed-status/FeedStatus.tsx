import { FadeLoader } from "react-spinners";

import { Message, LoadingRow, SpinnerContainer } from "./FeedStatus.styles";

type FeedStatusProps = {
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    hasAnyPosts: boolean;
};

const FeedStatus = ({ loading, error, hasMore, hasAnyPosts }: FeedStatusProps) => {
    return (
        <>
            {error && <Message variant="error">{error}</Message>}

            {!hasMore && hasAnyPosts && <Message variant="info">No more posts</Message>}

            {loading && (
                <LoadingRow>
                    <SpinnerContainer>
                        <FadeLoader color="#aaaaaa" height={10} width={2} margin={-2} />
                    </SpinnerContainer>
                </LoadingRow>
            )}
        </>
    );
};

export default FeedStatus;
