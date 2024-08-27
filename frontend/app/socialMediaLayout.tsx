"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationBar from "@/components/uiperso/NavigationBar";
import SideBarList from "@/components/uiperso/sidebarlist";

export default function SocialMediaLayout({
  section,
}: {
  section: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 bg-muted w-full h-screen p-5">
      <header>
        <NavigationBar />
      </header>
      <main className="flex h-full">
        <aside className="bg-background h-full rounded-lg">
          <SideBarList />
        </aside>
        <ScrollArea className="h-full w-full">
          <section className="flex-1 w-full max-h-96 bg-muted">
            {section}
          </section>
        </ScrollArea>
      </main>
    </div>
  );
}
