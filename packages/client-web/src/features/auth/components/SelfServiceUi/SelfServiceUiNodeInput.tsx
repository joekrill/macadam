import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaLinkedin,
  FaMicrosoft,
  FaSlack,
  FaTwitter,
} from "react-icons/fa";
import { UiNodeInput } from "../../schemas/flows/ui";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { RecoveryLink } from "../RecoveryLink";

const OIDC_ATTRIBUTES: Record<string, ButtonProps> = {
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
  linkedin: {
    leftIcon: <FaLinkedin />,
    colorScheme: "linkedin",
  },
  slack: {
    leftIcon: <FaSlack />,
    colorScheme: "purple",
  },
  twitter: {
    leftIcon: <FaTwitter />,
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

/**
 * A mapping of a field's `name` attribute to the desired label.
 * Kratos sents inconsistent labels (if any) for various forms. Until that's
 * fixed or improved, this give us more consistency.
 *
 * TODO: Localize these labels.
 */
const LABELS: Record<string, string> = {
  password: "Password",

  /**
   * Kratos uses "ID" here (because it's possible to have multiple, so I guess
   * it doesn't distinguish). But we know we always want an email address.
   */
  password_identifier: "E-Mail",

  // The "recovery" flow doesn't provide a label, for some reason.
  email: "E-Mail",
};

export const SelfServiceUiNodeInput = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: SelfServiceUiNodeInputProps) => {
  const { meta, messages } = node;
  const { label, node_type: _, onclick, ...attributes } = node.attributes;
  const errors = messages?.filter((message) => message.type === "error") || [];

  switch (attributes.type) {
    case "hidden": {
      return <input {...attributes} value={attributes.value || true} />;
    }
    case "checkbox":
      return null;
    // TODO: How to handle checkbox
    // case "checkbox": {
    //   return (
    //     <>
    //       <input type="hidden" value="false" name="traits.path.to.my.boolean" />
    //       <input
    //         type="checkbox"
    //         value="true"
    //         name="traits.path.to.my.boolean"
    //       />
    //     </>
    //   );
    // }
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
          {meta?.label?.text || "Submit"}
        </Button>
      );
    }
    case "submit": {
      const provider =
        node.group === "oidc"
          ? ((meta.label?.context as any)?.provider as string)
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
          {meta?.label?.text || "Submit"}
        </Button>
      );
    }
    case "password":
    case "email":
    case "text":
    default: {
      const InputComponent =
        attributes.type === "password" ? PasswordInput : Input;
      return (
        <FormControl
          isInvalid={errors.length > 0}
          isRequired={attributes.required}
          isDisabled={attributes.disabled || isSubmitting}
        >
          <FormLabel>
            {LABELS[attributes.name] ||
              meta?.label?.text ||
              label?.text ||
              attributes.name}
          </FormLabel>
          <InputComponent
            {...attributes}
            borderColor="gray.300"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={attributes.disabled || isSubmitting}
          />
          {messages
            ?.filter((message) => message.type === "info")
            .map((message) => (
              <FormHelperText key={message.id}>{message.text}</FormHelperText>
            ))}
          {errors.map((message) => (
            <FormErrorMessage key={message.id}>{message.text}</FormErrorMessage>
          ))}
          {flowType === "login" && attributes.type === "password" && (
            <FormHelperText key="forgot-password">
              <RecoveryLink />
            </FormHelperText>
          )}
        </FormControl>
      );
    }
  }
};
