import { useEffect } from "react";
import { UiNodeScript } from "../../schemas/flows/ui";

export interface SelfServiceUiNodeScriptProps {
  node: UiNodeScript;
}

export const SelfServiceUiNodeScript = ({
  node,
}: SelfServiceUiNodeScriptProps) => {
  const { async, crossorigin, id, integrity, referrerpolicy, src, type } =
    node.attributes;

  useEffect(() => {
    const script = document.createElement("script");

    script.async = async;
    script.src = src;
    script.crossOrigin = crossorigin;
    script.integrity = integrity;
    script.referrerPolicy = referrerpolicy;
    script.type = type;
    script.setAttribute("data-testid", `node/script/${id}`);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [async, crossorigin, id, integrity, referrerpolicy, src, type]);

  return null;
};
