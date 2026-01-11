import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Verified from "assets/icons/verified.png";
import { getUserByUsername, getPostsByUserUsername } from "apis/usersApi";
import { formatToShortNumber } from "utils/number";

import ProfileImage from "components/profile-image/ProfileImage";

import type { Post } from "types/post";

import {
    Actions,
    Divider,
    EmptyBox,
    EmptyState,
    Grid,
    GridImg,
    GridItem,
    Header,
    HeaderRight,
    Name,
    Page,
    PrimaryButton,
    SecondaryButton,
    Stats,
    TopRow,
    Username,
    UsernameRow,
    VerifiedIcon,
} from "./Profile.styles";

export default function Profile() {
    const { username = "" } = useParams();

    const userQuery = useQuery({
        queryKey: ["userByUsername", username],
        enabled: !!username,
        queryFn: ({ signal }) => getUserByUsername(username, signal),
    });

    const postsQuery = useQuery({
        queryKey: ["postsByUsername", username],
        enabled: !!username,
        queryFn: ({ signal }) => getPostsByUserUsername(username, signal),
    });

    const loading = userQuery.isLoading || postsQuery.isLoading;
    const error =
        (userQuery.isError && ((userQuery.error as any)?.message ?? "Error")) ||
        (postsQuery.isError && ((postsQuery.error as any)?.message ?? "Error")) ||
        null;

    const user = userQuery.data ?? null;
    const posts: Post[] = postsQuery.data ?? [];

    if (loading) return <Page>Loading profile…</Page>;
    if (error) return <Page>Error: {error}</Page>;
    if (!user) return <Page>User not found</Page>;

    return (
        <Page>
            <Header>
                <ProfileImage user={user} width={120} height={120} />

                <HeaderRight>
                    <TopRow>
                        <UsernameRow>
                            <Username>{user.username}</Username>
                            {user.isVerified && (
                                <VerifiedIcon src={Verified} alt="Verified" aria-hidden="true" />
                            )}
                        </UsernameRow>

                        <Actions>
                            <PrimaryButton>Follow</PrimaryButton>
                            <SecondaryButton>Message</SecondaryButton>
                        </Actions>
                    </TopRow>

                    {user.name && <Name>{user.name}</Name>}

                    <Stats>
                        <div>
                            <b>{formatToShortNumber(user.postsCount)}</b> posts
                        </div>
                        <div>
                            <b>{formatToShortNumber(user.followersCount)}</b> followers
                        </div>
                        <div>
                            <b>{formatToShortNumber(user.followingsCount)}</b> following
                        </div>
                    </Stats>
                </HeaderRight>
            </Header>

            <Divider />

            <Grid>
                {posts.map((p) => {
                    const cover = p.imageUrls?.[0];
                    return (
                        <GridItem key={p.id} title={p.caption ?? ""}>
                            {cover ? (
                                <GridImg src={cover} alt="" aria-hidden="true" draggable={false} />
                            ) : (
                                <EmptyBox>No image</EmptyBox>
                            )}
                        </GridItem>
                    );
                })}
            </Grid>

            {posts.length === 0 && <EmptyState>No posts yet.</EmptyState>}
        </Page>
    );
}
