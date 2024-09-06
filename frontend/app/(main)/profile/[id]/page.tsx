import ProfileComponent from "@/components/uiperso/ProfileComponent";

export default function Page({ params }: { params: { id: string } }) {
  return <ProfileComponent id={params.id} />;
}
