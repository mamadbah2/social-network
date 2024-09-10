"use client";

import CreateGroupForm from "@/components/uiperso/CreateGroupModal";
import GroupBarComponent from "@/components/uiperso/GroupBar";
import PostSection from "@/components/uiperso/PostSection";
import { WithAuth } from "@/components/uiperso/PrivateRoute";
import { usePostContext } from "@/lib/hooks/postctx";
import useGetData from "@/lib/hooks/useGet";
import postData from "@/lib/hooks/usepost";
import { mapPost } from "@/lib/modelmapper";
import { Post } from "@/models/post.model";
import React, { useState, useEffect } from "react";

function Home() {
  const { expect: posts } = useGetData<Post[]>("/groupHomePage", mapPost);
  const { postTable, setPostTable } = usePostContext();
  const [updatedPost, setUpdatedPost] = useState<Post[] | null>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (posts) {
      setPostTable(posts);
      setUpdatedPost(posts);
    }
  }, [posts, setPostTable]);

  useEffect(() => {
    setUpdatedPost(postTable);
  }, [postTable]);

  const handleSave = async (name: string, description: string) => {

    const formData = new FormData();
    formData.append("GroupName", name);
    formData.append("GroupDescrp", description);
    const [resp, err] = await postData("/groups", formData, false);

    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <>
      <GroupBarComponent
        imgSrc="https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/ac505d57a46e24dd96712263d89a150cb443af288c025ff2.jpg"
        groupName=""
        createdAt=""
        descriptionLink=""
        creator={false}
        setShowForm={setShowForm}
      />
      {showForm && <CreateGroupForm onSave={handleSave} onCancel={handleCancel} />}
      <PostSection posts={updatedPost} />
    </>
  );
}

export default WithAuth(Home);
