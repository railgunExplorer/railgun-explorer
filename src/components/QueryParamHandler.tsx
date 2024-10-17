import React, { useEffect, useState, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const allowedParams = ["viewingKey"] as const;

type AllowedParam = (typeof allowedParams)[number];

type QueryParams = {
  [K in AllowedParam]?: string | null;
};

const QueryParamContext = createContext<QueryParams>({});

export const useQueryParams = () => useContext(QueryParamContext);

interface QueryParamHandlerProps {
  children: React.ReactNode;
}

const QueryParamHandler: React.FC<QueryParamHandlerProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params: QueryParams = {};

    allowedParams.forEach((param) => {
      if (searchParams.has(param)) {
        params[param] = searchParams.get(param);
      }
    });

    setQueryParams(params);

    if (Object.keys(params).length > 0) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <QueryParamContext.Provider value={queryParams}>
      {children}
    </QueryParamContext.Provider>
  );
};

export default QueryParamHandler;
