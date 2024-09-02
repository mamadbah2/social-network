'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setSessionToken } from "@/lib/cookie"
import postData from "@/lib/hooks/usepost"
import React from 'react'
import SecurityLayout from "../securelayout"
import { useRouter, redirect } from "next/navigation"
import Link from "next/link"

export let socketNotif: WebSocket;

export default function Login() {
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const target = e.currentTarget
        const [resp, err] = await postData('/login', new FormData(e.currentTarget))
        if (Object.keys(err).length != 0) {
            Object.keys(err).forEach((key) => {
                target.querySelector(`[name=${key}]`)?.classList.add('border-red-500')
                setTimeout(() => {
                    target.querySelector(`[name=${key}]`)?.classList.remove('border-red-500')
                }, 2000)
            })
        } else if (Object.keys(resp).length != 0 && Object.keys(err).length == 0) {
            setSessionToken(resp?.Cookie?.Value)
            localStorage.setItem('userID', `${resp?.UserId}`)
            localStorage.setItem('cookie', `${resp?.Cookie?.Value}`)
            router.push('/')
        }
    }

    return <SecurityLayout>
        <form onSubmit={handleSubmit} className="max-w-[500px] flex flex-wrap gap-4 bg-white p-5 justify-center rounded-lg" >
            <h1 className="font-bold text-4xl" >Sign In</h1>
            <Input name="emailNickname" type="text" placeholder="Enter your nickname or email" />
            <Input name="password" type="password" placeholder="Enter your password" />
            <Button className="w-full"> Submit </Button>
            <p className="text-gray-600 text-sm">
                You don't have an account?
                <Link href="/register" className="text-blue-500 hover:text-blue-700 underline">
                    Register
                </Link>
            </p>
        </form>
    </SecurityLayout>
}