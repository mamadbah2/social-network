"use client";

import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/sidebarlist";
import HandAuth from "@/lib/utils";
import SocialMediaLayout from "./socialMediaLayout";

export default function Home() {
  HandAuth();

  return (
    <SocialMediaLayout header={<NavigationBar />} aside={<SideBarList />} />
  );
}
