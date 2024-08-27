import SocialMediaLayout from "@/app/socialMediaLayout";
import ProfileComponent from "@/components/uiperso/ProfileComponent";

export default function Page({ params }: { params: { id: string } }) {
  console.log("userid", params.id);
  return <ProfileComponent id={params.id} />;
}
