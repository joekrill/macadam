import { UiNodeButtonInput, UiNodeInput } from "../../schemas/flows/ui";
import { ButtonNode } from "./nodes/ButtonNode";
import { CheckboxNode } from "./nodes/CheckboxNode";
import { LocaleSelectNode } from "./nodes/LocaleSelectNode";
import { OidcButtonNode } from "./nodes/OidcButtonNode";
import { PasswordNode } from "./nodes/PasswordNode";
import { ProfilePictureNode } from "./nodes/ProfilePictureNode";
import { TextInputNode } from "./nodes/TextInputNode";

export interface SelfServiceUiNodeInputProps {
  node: UiNodeInput;
  isSubmitting: boolean;
  value?: any;
  onChange: (newValue: any) => void;
  flowType?: string;
}

export const SelfServiceUiNodeInput = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: SelfServiceUiNodeInputProps) => {
  const { label, node_type: _, onclick, ...attributes } = node.attributes;

  switch (attributes.type) {
    case "hidden": {
      return <input {...attributes} value={attributes.value || true} />;
    }
    case "checkbox": {
      return (
        <CheckboxNode
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node}
          onChange={onChange}
          value={value}
        />
      );
    }
    case "submit":
    case "button": {
      const ButtonComponent =
        node.group === "oidc" ? OidcButtonNode : ButtonNode;

      return (
        <ButtonComponent
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node as UiNodeButtonInput}
          onChange={onChange}
          value={value}
        />
      );
    }
    case "password":
      return (
        <PasswordNode
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node as UiNodeButtonInput}
          onChange={onChange}
          value={value}
        />
      );
    case "email":
    case "text":
    default: {
      if (attributes.name === "traits.locale") {
        return (
          <LocaleSelectNode
            flowType={flowType}
            isSubmitting={isSubmitting}
            node={node as UiNodeButtonInput}
            onChange={onChange}
            value={value}
          />
        );
      }

      if (attributes.name === "traits.picture") {
        return (
          <ProfilePictureNode
            flowType={flowType}
            isSubmitting={isSubmitting}
            node={node as UiNodeButtonInput}
            onChange={onChange}
            value={value}
          />
        );
      }

      return (
        <TextInputNode
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node as UiNodeButtonInput}
          onChange={onChange}
          value={value}
        />
      );
    }
  }
};
