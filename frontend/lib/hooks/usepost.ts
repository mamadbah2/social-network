import { useState } from "react"

async function postData(url: string, data: FormData, enctyped: boolean) {
    let init: RequestInit
    console.log(data)
    if (enctyped) {
        init = { method: 'POST', body: data }
    } else {
        init = { method: 'POST', headers: {"Content-Type": "application/x-www-form-urlencoded"} , body: convertFormat(data) }
    }
    const response = await fetch("http://localhost:4000" + url, init)

    if (!response.ok) {
        throw new Error("Echec pour POST les données")
    }

    return response.json()

}

export function convertFormat(formData: FormData) {
    // Conversion du format JSON en format URL encoded
    let urlEncode = ""

    for (let [k, v] of formData.entries()) {
        urlEncode += `${k}=${v}&`
    }

    return urlEncode.slice(0, -1)
}

// Ceci fonctionne comme un useState hook
const usePostData = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    const post = async (url: string, data: FormData, enctyped=false) => {
        setIsLoading(true)
        try {
            const response = await postData(url, data, enctyped)
            setData(response)
            setError(response.Errors)
        } catch (err: any) {
            
        } finally {
            setIsLoading(false)
        }
    }

    return { data, error, isLoading, post }
}

export default usePostData;