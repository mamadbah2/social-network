import { resp } from "@/models/resp.model"
import { User } from "@/models/user.model"
import useSWR from "swr"
import { mapUser } from "../modelmapper"

const fetcher = async (url: string): Promise<any> => {

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

    return {
        expect,
        error,
        isLoading
    };
}

export default useGetData;