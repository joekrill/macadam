import {
  Button,
  ButtonProps,
  Checkbox,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaMicrosoft,
  FaTwitch,
} from "react-icons/fa";
import { LocaleSelect } from "../../../i18n/components/LocaleSelect/LocaleSelect";
import { UiNodeInput } from "../../schemas/flows/ui";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { SelfServiceUiNodeInputWrapper } from "./SelfServiceUiNodeInputWrapper";
const OIDC_ATTRIBUTES: Record<string, ButtonProps> = {
  discord: {
    leftIcon: <FaDiscord />,
    colorScheme: "purple",
  },
  facebook: {
    leftIcon: <FaFacebook />,
    colorScheme: "facebook",
  },
  github: {
    leftIcon: <FaGithub />,
    colorScheme: "gray",
  },
  google: {
    leftIcon: <FaGoogle />,
    colorScheme: "red",
  },
  microsoft: {
    leftIcon: <FaMicrosoft />,
    colorScheme: "blue",
  },
  twitch: {
    leftIcon: <FaTwitch />,
    colorScheme: "twitter",
  },
};

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
        <SelfServiceUiNodeInputWrapper
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node}
        >
          <Checkbox
            {...attributes}
            borderColor="gray.300"
            isChecked={typeof value === "boolean" ? value : false}
            onChange={(e) => onChange(e.target.checked)}
            isDisabled={attributes.disabled || isSubmitting}
          />
        </SelfServiceUiNodeInputWrapper>
      );
    }
    case "button": {
      return (
        <Button
          {...attributes}
          colorScheme="blue"
          type="button"
          isDisabled={attributes.disabled}
          isLoading={isSubmitting}
          value={value || ""}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onclick) {
              const run = new Function(onclick); // eslint-disable-line no-new-func
              run();
            }
            onChange(attributes.value);
          }}
        >
          {node.meta?.label?.text || "Submit"}
        </Button>
      );
    }
    case "submit": {
      const provider =
        node.group === "oidc"
          ? ((node.meta.label?.context as any)?.provider as string)
          : undefined;
      const oidcAttributes = (provider && OIDC_ATTRIBUTES[provider]) || {};

      return (
        <Button
          {...attributes}
          colorScheme="blue"
          {...oidcAttributes}
          type="submit"
          isDisabled={attributes.disabled}
          isLoading={isSubmitting}
          value={value || ""}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(attributes.value);
          }}
        >
          {node.meta?.label?.text || "Submit"}
        </Button>
      );
    }
    case "password":
    case "email":
    case "text":
    default: {
      const commonProps = {
        borderColor: "gray.400",
        onChange: (e) => onChange(e.target.value),
        isDisabled: attributes.disabled || isSubmitting,
        value: value || "",
      } as Pick<InputProps, "borderColor" | "isDisabled" | "value"> & {
        onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
      };

      let children: React.ReactChild;

      if (attributes.type === "password") {
        children = <PasswordInput {...commonProps} />;
      } else if (attributes.name === "traits.locale") {
        children = <LocaleSelect {...commonProps} includeDefaultOption />;
      } else {
        children = <Input {...commonProps} />;
      }

      return (
        <SelfServiceUiNodeInputWrapper
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node}
        >
          {children}
        </SelfServiceUiNodeInputWrapper>
      );
    }
  }
};
