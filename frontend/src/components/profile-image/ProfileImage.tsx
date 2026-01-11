import { useNavigate } from "react-router-dom";

import type { User } from "types/user";

type Props = {
    user: User;
    width?: number;
    height?: number;
};

const ProfileImage = ({ user, width = 50, height = 50 }: Props) => {
    const imageWidth = width - 6;
    const imageHeight = height - 6;

    const navigate = useNavigate();

    return (
        <div
            style={{
                ...styles.profileImgContainer,
                ...(user.hasStory ? styles.hasStory : {}),
                width,
                height,
            }}
            onClick={() => navigate(`/profile/${user.username}`)}
        >
            <img
                style={{ ...styles.profileImg, width: imageWidth, height: imageHeight }}
                src={user.avatarUrl}
                alt=""
                aria-hidden="true"
            />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    profileImgContainer: {
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    hasStory: {
        backgroundImage:
            "linear-gradient(45deg, #ffa95f 5%, #f47838 15%, #d92d7a 70%, #962fbf 80%, #4f5bd5 95%)",
    },
    profileImg: {
        borderRadius: "50%",
        border: "4px solid #121b21",
        objectFit: "cover",
    },
};

export default ProfileImage;
