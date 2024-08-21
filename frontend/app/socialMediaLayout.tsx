"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function SocialMediaLayout({
  header,
  aside,
  section,
}: {
  header: React.ReactNode;
  aside: React.ReactNode;
  section: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 bg-muted w-full h-screen px-5">
      <header>{header}</header>
      <main className="flex">
        <aside className="bg-background h-full">{aside}</aside>
        <section className="flex-1 bg-muted">
          <ScrollArea className="max-h-max">{section}</ScrollArea>
        </section>
      </main>
    </div>
  );
}
