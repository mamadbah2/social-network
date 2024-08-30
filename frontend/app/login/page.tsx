'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setSessionToken } from "@/lib/cookie"
import usePostData from "@/lib/hooks/usepost"
import React from 'react'
import SecurityLayout from "../securelayout"
import { useRouter } from "next/navigation"

export let socketNotif : WebSocket;

export default function Login() {
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const [resp, err] = await usePostData('/login', new FormData(e.currentTarget))
        console.log('resp :>> ', resp);
        if (resp != null) {
            setSessionToken(resp?.Cookie.Value)
            localStorage.setItem('userID', `${resp?.UserId}`)
            console.log("Login Success :>>", resp?.Cookie.Value);
            router.push('/')
        } else {
            alert("Error to log : Try to restart backend")
        }
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