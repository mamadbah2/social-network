import { useEffect, useState } from "react"
import { mutate } from 'swr';

async function postData(uri: string, data: FormData, enctyped: boolean) {
    let init: RequestInit
    if (enctyped) {
        init = { method: 'POST', credentials: "include", body: data }
    } else {
        init = {
            method: 'POST', headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }, credentials: "include", body: convertFormat(data)
        }
    }
    const response = await fetch("http://localhost:4000" + uri, init)
    console.log(response);
    
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


const usePostData = async (uri: string, data: FormData, enctyped = false) => {
    try {
        const response = await postData(uri, data, enctyped)

        mutate(uri, response, false);
        return [
            response.Datas,
            response.Errors
        ]
    } catch (err: any) {
        return [null, err]
    }
}

export default usePostData;