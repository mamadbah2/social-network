"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WsProvider } from "@/lib/hooks/usewebsocket";
import { mapNotification } from "@/lib/modelmapper";

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
    <WsProvider uri="/notification" mapper={mapNotification} >
      <div className="flex flex-col gap-2 bg-muted w-full h-screen p-5">
        <header>{header}</header>
        <main className="flex h-full">
          <aside className="bg-background h-full rounded-lg">{aside}</aside>
          <ScrollArea className="h-full w-full">
            <section className="flex-1 w-full max-h-96 bg-muted">
              {section}
            </section>
          </ScrollArea>
        </main>
      </div>
    </WsProvider>
  );
}
