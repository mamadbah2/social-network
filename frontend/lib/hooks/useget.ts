import useSWR, { mutate } from "swr";

const fetcher = async (url: string): Promise<any> => {
  const data = await fetch(url, { credentials: "include", cache: "no-cache" });

  return data.json();
};

const useGetData = <T>(uri: string, mapper?: (obj: any) => T) => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:4000" + uri,
    fetcher
  );

  // const expect= mapper(data?.Datas)
  const expect = mapper ? mapper(data?.Datas) : data?.Datas;
  const errorPerso = data?.Errors;

  return {
    expect,
    error,
    errorPerso,
    isLoading,
    mutate: () => mutate("http://localhost:4000" + uri, true),
  };
};

export default useGetData;
