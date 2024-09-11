import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: number
  text: string
  sender: string
}

type Contact = {
  id: number
  name: string
  avatar: string
}

export default function ChatInterface({
    isOpen
}: {
    isOpen: boolean
}) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')

  if (!isOpen) return null

  const contacts: Contact[] = [
    { id: 1, name: 'Murielle', avatar: '/placeholder.svg' },
    { id: 2, name: 'Sow', avatar: '/placeholder.svg' },
    { id: 3, name: 'Adiane', avatar: '/placeholder.svg' },
    { id: 4, name: 'Barry', avatar: '/placeholder.svg' },
    { id: 5, name: 'Cherif', avatar: '/placeholder.svg' },
  ]

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact)
    // In a real app, you'd fetch messages for this contact here
    setMessages([])
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage.trim(),
        sender: 'user'
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
    }
  }

  return (
    <div className=" z-50 flex flex-col h-[700px] w-[350px] max-w-md mx-auto border rounded-lg overflow-hidden bg-white">
      <div className="border-b max-h-[200px] overflow-scroll ">
        <ScrollArea className="h-full">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedContact?.id === contact.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleContactClick(contact)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              <span className="ml-3">{contact.name}</span>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          {messages.map(message => (
            <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : ''}`}>
              <span className="inline-block bg-blue-500 text-white rounded-lg py-2 px-3">
                {message.text}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t flex">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 mr-2"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  )
}