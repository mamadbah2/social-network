"use client";
import useGetData from "@/lib/hooks/useget";
import { mapSimpleUser } from "@/lib/modelmapper";
// import { mapSimpleUser } from "@/lib/modelmapper";
export default function ProfileComponent({ id }: { id: string }) {
  const { expect: user, error: errUser } = useGetData(
    `/users?id=${id}`,
    mapSimpleUser
  );

  console.log(user);

  return (
    <div>
      <h1>Profile Page {id}</h1>
    </div>
  );
}
