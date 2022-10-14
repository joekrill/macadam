let apiHost = "";

export const getApiHost = () => apiHost;

export const setApiHost = (host: string | undefined) => {
  apiHost = host || "";
};
