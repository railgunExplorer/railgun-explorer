import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useConsumeQueryParam = <T extends string | null>(
  paramName: string
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(paramName);
  const [paramValue] = useState<T>(value as T);

  useEffect(() => {
    if (paramValue) {
      searchParams.delete(paramName);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, paramName, paramValue]);

  return paramValue;
};
