<<<<<<< HEAD
import { resp } from "@/models/resp.model"
import { User } from "@/models/user.model"
import useSWR from "swr"
import { mapUser } from "../modelmapper"
=======
'use client'

import useSWR from "swr";
>>>>>>> 131b734914d860342830de5b6773b3bbd9f5cadb

const fetcher = async (url: string): Promise<any> => {

<<<<<<< HEAD
    const data = await fetch(url, { credentials: 'include' })

    return data.json()
}

const useGetData = <T>(uri: string, mapper:(obj:any)=>T ) => {
    const { data, error, isLoading } = useSWR("http://localhost:4000" + uri, fetcher, {
        revalidateOnFocus: false,     // Ne pas refetch lorsque l'utilisateur revient sur la page
        revalidateOnReconnect: false, // Ne pas refetch lorsque la connexion est rétablie
        refreshInterval: 0,           // Ne pas refetch à intervalle régulier
    })

    // const expect= mapper(data?.Datas)
    const expect = data?.Datas ? mapper(data?.Datas) : [];
=======
const useGetData = (url:string) => {
    console.log(url)
    const { data, error, isLoading} = useSWR(url, fetcher)
>>>>>>> 131b734914d860342830de5b6773b3bbd9f5cadb

    return {
        expect,
        error,
        isLoading
    };
}

export default useGetData;