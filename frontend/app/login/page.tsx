'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SecurityLayout from "../securelayout"
import useGetData from "@/lib/hooks/useget"
import usePostData from "@/lib/hooks/usepost"

export default function Login() {
    const {data, error} = useGetData('/posts')

    return <SecurityLayout>
        <form className="max-w-[500px] flex flex-wrap gap-4 bg-white p-5 justify-center rounded-lg" >
            <h1 className="font-bold text-4xl" >Sign In</h1>
            <Input name="emailNickname" type="text" placeholder="Enter your nickname or email" />
            <Input type="password" placeholder="Enter your password" />
            <Button className="w-full"> Submit </Button>
        </form>
    </SecurityLayout>
}