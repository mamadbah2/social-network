"use client";

import { ReactEventHandler, use, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Msg } from "@/models/message.model";
import useGetData from "@/lib/hooks/useGet";
import { mapSimpleUser } from "@/lib/modelmapper";
import { User } from "@/models/user.model";
import { UseMessageWS } from "@/lib/hooks/usewebsocket";
import { Group } from "@/models/group.model";
import { SmileIcon } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

let lastSelectedContact: User | Group | null = null;

export default function ChatInterface({ isOpen }: { isOpen: boolean }) {
  const [selectedContact, setSelectedContact] = useState<User | Group | null>(
    null
  );
  const [showPicker, setShowPicker] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const {
    sendObject: sendMessage,
    getReceived: getMessages,
    isModified,
  } = UseMessageWS();
  const { expect: user, error: errMe } = useGetData(
    `/users?id=${localStorage.getItem("userID")}`,
    mapSimpleUser
  );
  const myID = parseInt(localStorage.getItem("userID") || "0");

  if (!isOpen) return null;

  const contacts: User[] = [
    ...(user?.followers || []),
    ...(user?.followed?.filter(
      (u) => !user?.followers?.find((f) => f.id == u.id)
    ) || []),
  ];
  const contactGroup: Group[] = user?.groups || [];

  const handleContactClick = (contact: User | Group) => {
    setSelectedContact(contact);
    lastSelectedContact = contact;
    console.log("contact :>> ", contact);
    let toSendMsg: Msg;
    const forPass: Partial<User> = {
      id: contact.id,
    };
    // In a real app, you'd fetch messages for this contact here
    if ("firstname" in contact) {
      toSendMsg = {
        id: 0,
        type: "getAllMessagePrivate",
        content: "getAllMessagePrivate",
        sentAt: new Date().toISOString(),
        receiver: user || undefined,
        sender: forPass || undefined,
      };
    } else {
      toSendMsg = {
        id: 0,
        type: "getAllMessageGroup",
        content: "getAllMessageGroup",
        sentAt: new Date().toISOString(),
        receiver: forPass || undefined,
        sender: user || undefined,
      };
    }
    if (sendMessage(toSendMsg)) {
      setTimeout(() => {
        const oldMessages = getMessages<Msg>();
        console.log("oldMessages :>> ", oldMessages);
        if (
          oldMessages.length > 0 &&
          oldMessages[0].content != "getAllMessagePrivate" &&
          oldMessages[0].content != "getAllMessageGroup"
        ) {
          setMessages(oldMessages);
        } else {
          setMessages([]);
        }
      }, 500);
    }
  };

  useEffect(() => {
    let lastId: number = 0;
    const timer = setInterval(() => {
      const instantMsg = getMessages<Msg>();
      if (instantMsg.length == 1 && lastId != instantMsg[0].id) {
        if (
          getMessages<Msg>()[0].content != "getAllMessagePrivate" &&
          getMessages<Msg>()[0].content != "getAllMessageGroup"
        ) {
          if (instantMsg[0].type == "private") {
            if (lastSelectedContact?.id == instantMsg[0].sender?.id) {
              setMessages((prev) => [...prev, ...getMessages<Msg>()]);

              lastId = instantMsg[0].id;
            }
          } else if (instantMsg[0].type == "group") {
            if (lastSelectedContact?.id == instantMsg[0].receiver?.id) {
              setMessages((prev) => [...prev, ...getMessages<Msg>()]);
              lastId = instantMsg[0].id;
            }
          }
        }
      }
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputMessage.trim() && selectedContact) {
      const forPass: Partial<User> = {
        id: selectedContact.id,
      };
      let newMessage: Msg;
      if ("lastname" in selectedContact) {
        newMessage = {
          id: Date.now(),
          content: inputMessage.trim(),
          type: "private",
          sender: user || undefined,
          receiver: forPass,
          sentAt: new Date().toISOString(),
        };
      } else {
        newMessage = {
          id: Date.now(),
          content: inputMessage.trim(),
          type: "group",
          sender: user || undefined,
          receiver: forPass,
          sentAt: new Date().toISOString(),
        };
      }
      setMessages([...messages, newMessage]);
      setInputMessage("");
      sendMessage(newMessage);
    }
  };

  const addEmoji = (emoji: any) => {
    setInputMessage(inputMessage + emoji.native);
  };

  return (
    <div className=" z-50 flex flex-col h-[700px] w-[350px] max-w-md mx-auto border rounded-lg overflow-hidden bg-white">
      <div className="border-b max-h-[200px] min-h-[100px] overflow-scroll ">
        {contacts.length != 0 && contactGroup.length != 0 && !selectedContact && (<h3 className='text-center'> Please Select one conversation for start ...</h3>)}
        {contacts.length == 0 && contactGroup.length == 0 && (<h3 className='text-center'>Enter in one group or follow one User</h3>)}
        <ScrollArea className="h-full">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contact.id ? "bg-gray-200" : ""
                }`}
              onClick={() => handleContactClick(contact)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={contact.profilePicture}
                  alt={contact.firstname}
                />
                <AvatarFallback>{contact.firstname[0]}</AvatarFallback>
              </Avatar>
              <span className="ml-3">{contact.firstname}</span>
            </div>
          ))}
          {contactGroup.map((contactGr) => (
            <div
              key={contactGr.id + 1000}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contactGr.id ? "bg-gray-200" : ""
                }`}
              onClick={() => handleContactClick(contactGr)}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>{contactGr.name[0]}</AvatarFallback>
              </Avatar>
              <span className="ml-3">{contactGr.name} - Group</span>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col h-[400px]">
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <fieldset
              key={message.id}
              className={`mb-2 ${message.sender?.id == myID ? "bg-gray-100" : "bg-blue-100"
                } inline-block min-w-[60%] rounded-lg py-2 px-3`}
            >
              <legend className="text-xs">{message.sender?.firstname}</legend>
              <span className="">{message.content}</span>
            </fieldset>
          ))}
        </ScrollArea>
        {selectedContact && (<div className="p-4 border-t flex">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setShowPicker(!showPicker)}
            >
              <SmileIcon className="h-4 w-4" />
              <span className="sr-only">Add emoji</span>
            </Button>

            {showPicker && (
              <div className=" absolute bottom-10  z-50">
                <Picker onEmojiSelect={addEmoji} data={data} />
              </div>
            )}
          </div>
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button onClick={handleSendMessage} data-type="user">
            Send
          </Button>
        </div>)}
      </div>
    </div>
  );
}
