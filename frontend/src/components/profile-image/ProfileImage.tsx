import { useNavigate } from "react-router-dom";

import type { User } from "types/user";

import { Container, Avatar } from "./ProfileImage.styles";

type ProfileImageProps = {
    user: User;
    width?: number;
    height?: number;
    clickable?: boolean;
};

const ProfileImage = ({ user, width = 50, height = 50, clickable = true }: ProfileImageProps) => {
    const navigate = useNavigate();

    const imageWidth = width - 6;
    const imageHeight = height - 6;

    return (
        <Container
            $width={width}
            $height={height}
            $hasStory={user.hasStory}
            $clickable={clickable}
            onClick={clickable ? () => navigate(`/profile/${user.username}`) : undefined}
        >
            <Avatar
                src={user.avatarUrl}
                alt=""
                aria-hidden="true"
                $width={imageWidth}
                $height={imageHeight}
            />
        </Container>
    );
};

export default ProfileImage;
