"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import SocialMediaLayout from "@/app/socialMediaLayout";
import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/sidebarlist";
import PostCard from "@/components/uiperso/PostCard";
import useGetData from "@/lib/hooks/useget";
import { mapGroup, mapUser } from "@/lib/modelmapper";
import { Group } from "@/models/group.model";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import GroupBarComponent from "@/components/uiperso/GroupBar";
import AddMemberComponent from "@/components/uiperso/AddMember";
import usePostData from "@/lib/hooks/usepost";

export default function Home() {
  const groupID = useParams().id
  const { expect: group, error: errGroups } = useGetData<Group[]>(
    `/groups?id=${groupID}`,
    mapGroup
  );

  const { expect: Allusers, error: errUser } = useGetData<User[]>(`/users`, mapUser);

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  if (!group || group.length === 0 || !Allusers || Allusers.length === 0) {
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

  const posts = group && group.length > 0 ? group[0].posts || [] : [];

  const handleAddMembers = async (selectedUserIds: number[]) => {
    console.log("Selected User IDs:", selectedUserIds);
    if (selectedUserIds.length > 0) {
      const formData = new FormData();
      selectedUserIds.forEach((id) => {
        formData.append('MembersSelected', id.toString());
      });
      const [resp, err] = await usePostData(`/groupMembers?id=${groupID}`, formData, false)
      console.log(resp, err)
      console.log('group Created');
    }
    setShowAddMemberForm(false);
  };

  const handleCancel = () => {
    setShowAddMemberForm(false);
  };

  return (
    <SocialMediaLayout
      header={<NavigationBar />}
      aside={<SideBarList />}
      groupNav={
        <GroupBarComponent
          imgSrc="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg"
          groupName={group[0]?.name || "Loading..."}
          createdAt={group[0]?.createdAt.toString() || "Loading..."}
          descriptionLink={group[0]?.description || "Loading..."}
          creator={!!(group[0]?.creator?.Id && localStorage.getItem("userID") === group[0]?.creator?.Id.toString())}
          setShowForm={setShowAddMemberForm}
        />
      }
      section={
        <div className="relative">
          {showAddMemberForm && (
            <AddMemberComponent
              users={Allusers}
              onSave={handleAddMembers}
              onCancel={handleCancel}
            />
          )}
          <div className="space-y-4 pl-3 pt-24">
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
                dislikes={34}
                comments={30}
              />
            ))}
          </div>
        </div>
      }
    />
  );
}
