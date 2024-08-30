import ChatBubble from './ChatBubble';
import { Message } from '@/models/message';
import { User } from '@/models/user.model';

// const router = useRouter()

export const Chatbox = (receiver: User, messages: Message[]) => {
    return (
        <fieldset>
            <legend>{receiver.nickname || receiver.firstname}</legend>
            <div>
                {messages?.map(message => (
                    <ChatBubble
                        sender={message.sender}
                        content={message.content}
                        date={message.date}
                    />
                ))}
            </div>
            <form onSubmit={send}>
                <textarea></textarea>
                <button type="submit">Send</button>
            </form>
        </fieldset>
    )
}
