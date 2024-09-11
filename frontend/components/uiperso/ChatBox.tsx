import { useState } from 'react'
import { Send } from 'lucide-react'

interface Message {
  id: number
  text: string
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now(), text: inputText }])
      setInputText('')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Contact</h2>
      </div>
      <div className="h-96 overflow-y-auto bg-gray-50 p-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start mb-4">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">Murielle</p>
              <p className="mt-1 bg-white p-2 rounded-lg shadow">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Envoyer un message"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}