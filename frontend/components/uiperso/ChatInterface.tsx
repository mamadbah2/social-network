import { ReactEventHandler, use, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Msg } from '@/models/message.model'
import useGetData from '@/lib/hooks/useGet'
import { mapSimpleUser } from '@/lib/modelmapper'
import { User } from '@/models/user.model'
import { UseMessageWS } from '@/lib/hooks/usewebsocket'





export default function ChatInterface({
  isOpen
}: {
  isOpen: boolean
}) {

  const [selectedContact, setSelectedContact] = useState<User | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const { sendObject: sendMessage, getReceived: getMessages } = UseMessageWS()
  const { expect: user, error: errMe } = useGetData(`/users?id=${localStorage.getItem("userID")}`, mapSimpleUser);
  const myID = parseInt(localStorage.getItem('id') || '0')

  if (!isOpen) return null

  const contacts: User[] = user?.followers || []

  const handleContactClick = (contact: User) => {
    setSelectedContact(contact)
    // In a real app, you'd fetch messages for this contact here
    if (sendMessage({
      type: 'getAllMessagePrivate',
      receiver: user,
      sender: contact
    })) {
      const oldMessages = getMessages()
      if (oldMessages.length > 0) {
        setMessages(getMessages())
      }
      console.log('getMessage() :>> ', getMessages());

      setMessages(getMessages())

    }

  }

  const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (inputMessage.trim() && selectedContact) {
      const newMessage: Msg = {
        id: Date.now(),
        text: inputMessage.trim(),
        type: 'private',
        sender: user || undefined,
        receiver: selectedContact,
        sentAt: new Date().toISOString(),
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      sendMessage(newMessage)
    }
  }

  return (
    <div className=" z-50 flex flex-col h-[700px] w-[350px] max-w-md mx-auto border rounded-lg overflow-hidden bg-white">
      <div className="border-b max-h-[200px] min-h-[100px] overflow-scroll ">
        <ScrollArea className="h-full">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contact.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleContactClick(contact)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={contact.profilePicture} alt={contact.nickname} />
                <AvatarFallback>{contact.nickname[0]}</AvatarFallback>
              </Avatar>
              <span className="ml-3">{contact.nickname}</span>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col h-[400px]">
        <ScrollArea className="flex-1 p-4">
          {messages.map(message => (
            <fieldset key={message.id} className={`mb-2 ${message.sender?.id == myID ? 'text-right' : ''} inline-block bg-blue-100 min-w-[50%] rounded-lg py-2 px-3`}>
              <legend className='text-xs'>{message.sender?.nickname || "Bobo"}</legend>
              <span className="">
                {message.text}
              </span>
            </fieldset>
          ))}
        </ScrollArea>
        <div className="p-4 border-t flex">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button
            onClick={handleSendMessage}
            data-type="user"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}