import { Message } from "@/models/message"

// Extract needed properties from  the message model.
type ChatProps = Pick<Message, 'sender' | 'content' | 'date'>

export default function ChatBubble({
    sender,
    content = 'No Message',
    date = new Date().toISOString().slice(0, 10),
}: ChatProps) {
    return (
        <fieldset>
            <legend>{sender?.nickname || sender?.firstname}</legend>
            <p>{content}</p>
            <h6>{date}</h6>
        </fieldset>
    )
}