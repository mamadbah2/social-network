"use client";

import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/sidebarlist";
import handAuth from "@/lib/utils";
import SocialMediaLayout from "./socialMediaLayout";

export default function Home() {
  handAuth();

  return (
    <SocialMediaLayout header={<NavigationBar />} aside={<SideBarList />} />
  );
}
