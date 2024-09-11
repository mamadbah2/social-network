"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationBar from "@/components/uiperso/NavigationBar";
import { WithAuth } from "@/components/uiperso/PrivateRoute";
import SideBarList from "@/components/uiperso/sidebarlist";
import { PostProvider } from "@/lib/hooks/postctx";
import { MessageWebSocketCtx, WebSocketCtx, WsProvider } from "@/lib/hooks/usewebsocket";
import { mapMessage, mapNotification } from "@/lib/modelmapper";
import { Toaster } from "@/components/ui/toaster"
import React from "react";
import ChatInterface from "@/components/uiperso/ChatInterface";
function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WsProvider uri="/chat" mapper={mapMessage} context={MessageWebSocketCtx}>
      <WsProvider uri="/notification" mapper={mapNotification} context={WebSocketCtx}>
        <PostProvider>
          <div className="flex flex-col gap-2 bg-muted w-full h-screen p-5 pb-10 overflow-hidden">
            <header>
              <NavigationBar />
            </header>
            <main className="flex h-full">
              <aside className="bg-background h-full rounded-lg">
                <SideBarList />
              </aside>
              <ScrollArea className="h-full w-full">
                <section className="flex-1 w-full max-h-96 bg-muted">
                  {children}
                </section>
              </ScrollArea>
              <aside className="bg-background h-full rounded-lg">
                <ChatInterface isOpen />
              </aside>
            </main>
          </div>
          <Toaster />
        </PostProvider>
      </WsProvider>
    </WsProvider>
  );
}

export default WithAuth(MainLayout);
