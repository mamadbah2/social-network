import useSWR from "swr"

const fetcher = (url:string)=>fetch(url).then((res)=> res.json())

const useGetData = (url:string) => {
    const { data, error, isLoading} = useSWR(url, fetcher)

    return {
        data,
        error,
        isLoading
    };
}

export default useGetData;