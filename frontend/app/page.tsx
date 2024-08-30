'use client'

import NavigationBar from "@/components/uiperso/NavigationBar";
import SocialMediaLayout from "./socialMediaLayout";
import handAuth from "@/lib/utils";

export default function Home() {
  handAuth();
  
  return (
    <SocialMediaLayout
      header={<NavigationBar />}
    />
  );
}
