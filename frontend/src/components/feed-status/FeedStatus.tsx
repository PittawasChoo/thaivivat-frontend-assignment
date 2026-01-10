import React from "react";
import { FadeLoader } from "react-spinners";

const FeedStatus = (props: {
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    hasAnyPosts: boolean;
}) => {
    const { loading, error, hasMore, hasAnyPosts } = props;

    return (
        <>
            {error && <div style={styles.error}>{error}</div>}
            {!hasMore && hasAnyPosts && <div style={styles.info}>No more posts</div>}
            {loading && (
                <div style={styles.loadingRow}>
                    <div style={styles.spinnerContainer}>
                        <FadeLoader color="#aaaaaa" height={10} width={2} margin={-2} />
                    </div>
                </div>
            )}
        </>
    );
};

const styles: Record<string, React.CSSProperties> = {
    info: {
        textAlign: "center",
        opacity: 0.9,
        padding: "10px 14px",
        borderRadius: 999,
        background: "rgba(20,20,20,0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
    },
    loadingRow: {
        display: "flex",
        justifyContent: "center",
    },
    spinnerContainer: {
        marginLeft: "18px",
        marginTop: "10px",
    },
    error: {
        color: "salmon",
        textAlign: "center",
        padding: "10px 14px",
        borderRadius: 999,
        background: "rgba(20,20,20,0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
    },
};

export default FeedStatus;
