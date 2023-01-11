let apiHost = "";

export const getApiHost = () => apiHost;

export const setApiHost = (value: string | undefined) => {
  apiHost = value || "";
};
