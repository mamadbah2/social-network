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
import { mapGroup, mapSimpleUser, mapUser } from "@/lib/modelmapper";
import { Group } from "@/models/group.model";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { Event } from "@/models/event.model";
import PostSection from "@/components/uiperso/PostSection";
import UseWS from "@/lib/hooks/usewebsocket";
import { Notification } from "@/models/notification.model";

export default function Home({ params }: { params: { id: string } }) {
  const groupID = params.id;

  const { sendObject: sendNotification } = UseWS();

  // Fetching group and users data
  const { expect: group, error: errGroups } = useGetData<Group[]>(
    `/groups?id=${groupID}`,
    mapGroup
  );
  const { expect: allUsers, error: errUser } = useGetData<User[]>(
    `/users`,
    mapUser
  );
  const { expect: user, error: errMe } = useGetData(
    `/users?id=${localStorage.getItem("userID")}`,
    mapSimpleUser
  );

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Handlers for modals
  const handleCreatePostModalOpen = () => setIsCreatePostModalOpen(true);
  const handleCreatePostModalClose = () => setIsCreatePostModalOpen(false);
  const handleOpenEventModal = () => setIsEventModalOpen(true);
  const handleCloseEventModal = () => setIsEventModalOpen(false);

  // Loading and Error handling
  if (!group || group.length === 0 || !allUsers || allUsers.length === 0) {
    return (
      <div className="space-y-4">
        <p>Loading...</p>
      </div>
    );
  }

  // if (errGroups || errUser) {
  //   return <div className="space-y-4"><p>Error loading data</p></div>;
  // }

  const UpdatedPosts = group[0]?.posts || [];
  const events = group[0]?.events || [];
  const handleAddMembers = (selectedUserIds: number[]) => {
    const myId = parseInt(localStorage.getItem("userID") || "0");
    const entityId = group[0].id;

    if (selectedUserIds.length > 0) {
      // Send notification to each selected user
      selectedUserIds.forEach((receiverID) => {
        let notif: Notification = {
          content: "wants to join his group",
          approuved: false,
          entityType: "group-invitation",
          entityId,
          sender: { id: myId },
          receiver: { id: receiverID },
        };
        sendNotification(notif);
      });

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
        descriptionLink={group[0]?.description || ""}
        creator={
          !!(
            group[0]?.creator?.id &&
            typeof window !== "undefined" &&
            localStorage.getItem("userID") === group[0].creator.id.toString()
          )
        }
        isMember={
          !!group[0].members.find(
            (m) => m.id.toString() === localStorage.getItem("userID")
          )
        }
        members={group[0].members}
        groupId={group[0].id}
        authorId={group[0].creator?.id}
        setShowForm={setShowAddMemberForm}
        handleCreatePost={handleCreatePostModalOpen}
        handleCreateEvent={handleOpenEventModal}
      />

      <div className="relative pt-24">
        {showAddMemberForm && (
          <AddMemberComponent
            users={
              user?.followers?.filter(
                (u) => !group[0].members.find((m) => m.id === u.id)
              ) || []
            }
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

        <div className="space-y-4 pl-3">
          <PostSection
            posts={UpdatedPosts}
            isLock={
              !group[0].members.find(
                (m) => m.id.toString() === localStorage.getItem("userID")
              )
            }
          />

          {events.map((event: Event) => (
            <EventCard
              key={event.Id}
              eventID={`${event.Id}`}
              userID={localStorage.getItem("userID") || "0"}
              username={event.Creator.firstname}
              avatarSrc=""
              date={event.Date}
              time={event.Time}
              title={event.Title}
              dislikes={event.NumberDislike}
              likes={event.NumberLike}
              description={event.Description}
              imageSrc=""
              isLock = {
                !group[0].members.find(
                  (m) => m.id.toString() === localStorage.getItem("userID")
                )
              }
              onJoin={() => console.log("Join event")}
              onDismiss={() => console.log("Dismiss event")}
            />
          ))}
        </div>
      </div>
    </>
  );
}
