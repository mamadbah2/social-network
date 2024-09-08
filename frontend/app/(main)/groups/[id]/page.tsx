"use client";

import { useState, useEffect } from "react";
import GroupBarComponent from "@/components/uiperso/GroupBar";
import AddMemberComponent from "@/components/uiperso/AddMember";
import postData from "@/lib/hooks/usepost";
import CreatePostGroupModal from "@/components/uiperso/CreatePostGroupModal";
import EventModal from "@/components/uiperso/EventModal";
import PostCard from "@/components/uiperso/PostCard";
import EventCard from "@/components/uiperso/EventCard";
import { usePostContext } from "@/lib/hooks/postctx";
import useGetData from "@/lib/hooks/useGet";
import { mapGroup, mapUser } from "@/lib/modelmapper";
import { Group } from "@/models/group.model";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { Event } from "@/models/event.model";

export default function Home({ params }: { params: { id: string } }) {
  const groupID = params.id;
  
  // Fetching group and users data
  const { expect: group, error: errGroups } = useGetData<Group[]>(`/groups?id=${groupID}`, mapGroup);
  const { expect: allUsers, error: errUser } = useGetData<User[]>(`/users`, mapUser);
  
  const { postTable, setPostTable } = usePostContext();  // For post context management
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Handlers for modals
  const handleCreatePostModalOpen = () => setIsCreatePostModalOpen(true);
  const handleCreatePostModalClose = () => setIsCreatePostModalOpen(false);
  const handleOpenEventModal = () => setIsEventModalOpen(true);
  const handleCloseEventModal = () => setIsEventModalOpen(false);
console.log('group', group)
  // Loading and Error handling
  if (!group || group.length === 0 || !allUsers || allUsers.length === 0) {
    return <div className="space-y-4"><p>Loading...</p></div>;
  }

  // if (errGroups || errUser) {
  //   return <div className="space-y-4"><p>Error loading data</p></div>;
  // }

  const posts = group[0]?.posts || [];
  const events = group[0]?.events || [];
  console.log('group[0]', group[0])
  const handleAddMembers = async (selectedUserIds: number[]) => {
    if (selectedUserIds.length > 0) {
      const formData = new FormData();
      selectedUserIds.forEach((id) => {
        formData.append("MembersSelected", id.toString());
      });
      const [resp, err] = await postData(`/groupMembers?id=${groupID}`, formData, false);
      console.log(resp, err);
      setShowAddMemberForm(false);
    }
  };

  const handleCancel = () => setShowAddMemberForm(false);

  return (
    <>
      <GroupBarComponent
        imgSrc="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg"
        groupName={group[0]?.name || "Loading..."}
        createdAt={group[0]?.createdAt.toString() || "Loading..."}
        descriptionLink={group[0]?.description || "Loading..."}
        creator={
          !!(
            group[0]?.creator?.id &&
            typeof window !== "undefined" &&
            localStorage.getItem("userID") === group[0].creator.id.toString()
          )
        }
        setShowForm={setShowAddMemberForm}
        handleCreatePost={handleCreatePostModalOpen}
        handleCreateEvent={handleOpenEventModal}
      />

      <div className="relative">
        {showAddMemberForm && (
          <AddMemberComponent
            users={allUsers}
            onSave={handleAddMembers}
            onCancel={handleCancel}
          />
        )}

        <CreatePostGroupModal
          isOpen={isCreatePostModalOpen}
          group_Id={groupID}
          onClose={handleCreatePostModalClose}
        />

        <EventModal
          isOpen={isEventModalOpen}
          onClose={handleCloseEventModal}
          GroupId={groupID}
        />

        <div className="space-y-4 pl-3 pt-24">
          {posts.map((post: Post) => (
            <PostCard
              key={post.id}
              author={post.author?.id}
              postId={post.id}
              username={post.author?.nickname || 'username'}
              firstname={post.author?.firstname || 'firstname'}
              lastname={post.author?.lastname || 'lastname'}
              avatarSrc={post.author?.profilePicture || 'avatarSrc'}
              date={post.createdAt.toDateString()}
              title={post.title}
              content={post.content}
              imageSrc={post.imageSrc || 'imgSrc'}
              likes={post.numberLike}
              dislikes={post.numberDislike}
              comments={post.comments?.length || 2}
            />
          ))}

          {events.map((event: Event) => (
            <EventCard
              key={event.Id}
              username={event.Creator.firstname}
              avatarSrc=""
              date={event.Date}
              time={event.Time}
              title={event.Title}
              description={event.Description}
              imageSrc=""
              onJoin={() => console.log("Join event")}
              onDismiss={() => console.log("Dismiss event")}
            />
          ))}
        </div>
      </div>
    </>
  );
}