"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/models/user.model";

interface UserInfoState {
  user?: User | null;
}

export default function UserInfo({ user }: UserInfoState) {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">View User Info</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
          <div />
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" value={user?.firstname} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" value={user?.lastname} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" value={user?.dateOfBirth?.toString()} readOnly />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" value={user?.nickname} readOnly />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="about">About Me</Label>
            <Textarea id="about" value={user?.aboutMe} readOnly />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
