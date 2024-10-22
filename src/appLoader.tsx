const appLoader = async () => {
  const response = await fetch(process.env.REACT_APP_RAILGUN_PROVIDERS_JSON);
  if (!response.ok) {
    throw new Error("Failed to fetch railway providers");
  }
  const railwayConfig = await response.json();
  return { railwayConfig };
};
