'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SecurityLayout from "../securelayout"
import React from "react"
import usePostData from "@/lib/hooks/usepost"
import { setSessionToken } from "@/lib/cookie"

export default function Login() {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const [resp, err] = await usePostData('/login', new FormData(e.currentTarget))
        setSessionToken(resp.Value)
        console.log("Login Success");
    }

    return <SecurityLayout>
        <form onSubmit={handleSubmit} className="max-w-[500px] flex flex-wrap gap-4 bg-white p-5 justify-center rounded-lg" >
            <h1 className="font-bold text-4xl" >Sign In</h1>
            <Input name="emailNickname" type="text" placeholder="Enter your nickname or email" />
            <Input name="password" type="password" placeholder="Enter your password" />
            <Button className="w-full"> Submit </Button>
        </form>
    </SecurityLayout>
}