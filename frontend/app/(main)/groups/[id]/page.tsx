"use client";

import { useState } from "react";
import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/sidebarlist";
import PostCard from "@/components/uiperso/PostCard";
import { mapGroup, mapUser } from "@/lib/modelmapper";
import { Group } from "@/models/group.model";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import GroupBarComponent from "@/components/uiperso/GroupBar";
import AddMemberComponent from "@/components/uiperso/AddMember";
import postData from "@/lib/hooks/usepost";
import CreatePostGroupModal from "@/components/uiperso/CreatePostGroupModal";
import EventModal from "@/components/uiperso/EventModal";
import { Event } from "@/models/event.model";
import EventCard from "@/components/uiperso/EventCard";
import useGetData from "@/lib/hooks/useGet";

export default function Home({ params }: { params: { id: string } }) {
  const groupID = params.id;
  const { expect: group, error: errGroups } = useGetData<Group[]>(
    `/groups?id=${groupID}`,
    mapGroup
  );

  const { expect: Allusers, error: errUser } = useGetData<User[]>(
    `/users`,
    mapUser
  );

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const handleCreatePostModalOpen = () => setIsCreatePostModalOpen(true);
  const handleCreatePostModalClose = () => setIsCreatePostModalOpen(false);
  const handleOpenEventModal = () => setIsEventModalOpen(true);
  const handleCloseEventModal = () => setIsEventModalOpen(false);

  if (!group || group.length === 0 || !Allusers || Allusers.length === 0) {
    console.log("LOADING");
    return (
      <div className="space-y-4">
        <p>LOADING.....</p>
      </div>
    );
  }

  const posts = group && group.length > 0 ? group[0].posts || [] : [];
  const events = group && group.length > 0 ? group[0].events || [] : [];
  console.log(events);

  const handleAddMembers = async (selectedUserIds: number[]) => {
    console.log("Selected User IDs:", selectedUserIds);
    if (selectedUserIds.length > 0) {
      const formData = new FormData();
      selectedUserIds.forEach((id) => {
        formData.append("MembersSelected", id.toString());
      });
      const [resp, err] = await postData(
        `/groupMembers?id=${groupID}`,
        formData,
        false
      );
      console.log(resp, err);
      console.log("group Created");
    }
    setShowAddMemberForm(false);
  };

  const handleCancel = () => {
    setShowAddMemberForm(false);
  };

  return (
    <>
        <GroupBarComponent
          imgSrc="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg"
          groupName={group[0]?.name || "Loading..."}
          createdAt={group[0]?.createdAt.toString() || "Loading..."}
          descriptionLink={group[0]?.description || "Loading..."}
          creator={
            !!(
              group[0].creator?.id &&
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
              users={Allusers}
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
            {events.map((e: Event) => (
              <EventCard
                username={e.Creator.firstname}
                avatarSrc=""
                date={e.Date}
                time={e.Time}
                title={e.Title}
                description={e.Description}
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
