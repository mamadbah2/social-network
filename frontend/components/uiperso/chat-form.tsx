// import React from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const ChatForm = () => (
    <form onSubmit={() => {
        // TODO: UseWS()
    }}>
        // TODO: <Emoji />
        <Textarea />
        <Button type="submit">Send</Button>
    </form>
)

export default ChatForm