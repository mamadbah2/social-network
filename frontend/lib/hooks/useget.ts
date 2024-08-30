import useSWR, { mutate } from "swr"

const fetcher = async (url: string): Promise<any> => {

    const data = await fetch(url, { credentials: 'include' })

    return data.json()
}

const useGetData = <T>(uri: string, mapper?:(obj:any)=>T ) => {
    const { data, error, isLoading } = useSWR("http://localhost:4000" + uri, fetcher, {
        revalidateOnFocus: true,     // Ne pas refetch lorsque l'utilisateur revient sur la page
        revalidateOnReconnect: false, // Ne pas refetch lorsque la connexion est rétablie
        refreshInterval: 0,           // Ne pas refetch à intervalle régulier
        dedupingInterval: 0, // Désactiver la déduplication pour forcer la revalidation
    })

    // const expect= mapper(data?.Datas)
    const expect = mapper ? mapper(data?.Datas) : data?.Datas;
    const errorPerso = data?.Errors;
    
    return {
        expect,
        error,
        errorPerso,
        isLoading,
        mutate : () => mutate("http://localhost:4000" + uri, true)
    };
}

export default useGetData;