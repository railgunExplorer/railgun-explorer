import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// For some reason, useSearchParams not always return the first query param.
const urlParams = new URLSearchParams(window.location.search);
const initialParams: Record<string, string | null> = {};
urlParams.forEach((value, key) => {
  initialParams[key] = value;
});

export const useConsumeQueryParams = () => {
  const [, setSearchParams] = useSearchParams();
  const [params, setParams] =
    useState<Record<string, string | null>>(initialParams);

  useEffect(() => {
    setParams(initialParams);

    urlParams.forEach((_, key) => {
      urlParams.delete(key);
    });
    setSearchParams(urlParams, { replace: true });
  }, [setSearchParams]);

  const getInitialQueryParam = (paramName: string): string | null => {
    return params[paramName] || null;
  };

  return getInitialQueryParam;
};
