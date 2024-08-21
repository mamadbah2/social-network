import useSWR from "swr"

const fetcher = (url:string)=>fetch(url, {credentials:'include'}).then((res)=> res.json())

const useGetData = (uri:string) => {
    const { data, error, isLoading} = useSWR("http://localhost:4000"+uri, fetcher, {
        revalidateOnFocus: false,     // Ne pas refetch lorsque l'utilisateur revient sur la page
        revalidateOnReconnect: false, // Ne pas refetch lorsque la connexion est rétablie
        refreshInterval: 0,           // Ne pas refetch à intervalle régulier
    })

    return {
        data,
        error,
        isLoading
    };
}

export default useGetData;