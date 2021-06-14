import { UiContainer } from "../types";
import { SelfServiceUiNode } from "./SelfServiceUiNode";

export interface SelfServiceUiProps {
  ui: UiContainer;
}

export const SelfServiceUi = ({ ui }: SelfServiceUiProps) => (
  <form action={ui.action} method={ui.method}>
    {ui.nodes.map((node, index) => (
      <SelfServiceUiNode key={index} node={node} />
    ))}
    {ui.messages?.map((message) => (
      <div>{message.text}</div>
    ))}
  </form>
);
