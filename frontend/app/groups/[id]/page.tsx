"use client";

import { useParams } from "next/navigation";
import SocialMediaLayout from "@/app/socialMediaLayout";
import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/SideBarList";
import PostCard from "@/components/uiperso/SocialMediaPost";
import useGetData from "@/lib/hooks/useget";
import { mapGroup } from "@/lib/modelmapper";
import { Group } from "@/models/group.model";
import { Post } from "@/models/post.model";
import GroupBarComponent from "@/components/uiperso/GroupBar";

// Example post data

export default function Home() {
  const { expect: group, error: errGroups } = useGetData<Group[]>(
    `/groups?id=${useParams().id}`,
    mapGroup
  );
  if (!group || group.length == 0) {
    console.log("LOADING");
    return (
      <SocialMediaLayout
        header={<NavigationBar />}
        aside={<SideBarList />}
        section={
          <div className="space-y-4">
            <p>LOADING.....</p>
          </div>
        }
      />
    );
  }

  const posts = group && group.length > 0 ? group[0].Posts || [] : [];

  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList />}
      section={
        <>
        <div className="space-y-4 pl-3">
          <GroupBarComponent
            imgSrc="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg"
            groupName={group && group.length > 0 ? group[0].Name : "Loading..."}
            createdAt={
              group && group.length > 0
                ? group[0].CreatedAt.toString()
                : "Loading..."
            }
            descriptionLink={
              group && group.length > 0 ? group[0].Description : "Loading..."
            }
            creator={
              !!(
                group &&
                group.length > 0 &&
                group[0].Creator?.Id &&
                localStorage.getItem("userID") ===
                  group[0].Creator?.Id.toString()
              )
            }
          />
            {" "}
            {posts.map((post: Post) => (
              <PostCard
                key={post.id}
                username={post.author?.nickname || ""}
                avatarSrc={"/iron"}
                date={post.createdAt.toString()}
                title={post.title}
                content={post.content}
                imageSrc={"/img"}
                likes={post.numberLike}
                shares={24}
                comments={30}
              />
            ))}
          </div>
        </>
      }
    />
  );
}
