'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import postData from "@/lib/hooks/usepost"
import { useState } from "react"
import SecurityLayout from "../securelayout"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"

export default function Register() {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [date, setDate] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [file, setFile] = useState(undefined)
    const [privacy, setPrivacy] = useState(false)

    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (!privacy) formData.append("privacy", "public")
        const [resp, err] = await postData('/register', formData, true)
        if (Object.keys(err).length == 0) {
            console.log('data :>> ', resp);
            router.push('/login')
        }
        console.log('error :>> ', err);
    }

    return <SecurityLayout>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-[500px] flex flex-wrap gap-4 bg-white p-5 justify-between rounded-lg text-center  " >
            <h1 className="block font-bold text-4xl w-full" >Sign In</h1>
            <div className="flex justify-between w-full gap-4">
                <Input type="text" name="firstname" placeholder="Enter your firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                <Input type="text" name="lastname" placeholder="Enter your lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </div>
            <Input type="text" name="nickname" placeholder="Enter your nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <Input type="mail" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input type="date" name="dateOfBirth" value={date} onChange={(e) => setDate(e.target.value)} />
            <Textarea placeholder="About Me" name="aboutMe" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} />
            <Input type="file" value={file} />
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" onClick={()=> {setPrivacy(!privacy);}} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Private account
                    </label>
                </div>
            </div>
            <Button type="submit" className="w-full" > Sign In </Button>
        </form>
    </SecurityLayout>
}