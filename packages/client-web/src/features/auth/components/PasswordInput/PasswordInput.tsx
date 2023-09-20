import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import * as React from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useIntl } from "react-intl";

export interface PasswordInputProps extends InputProps {}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>((props, ref) => {
  const { formatMessage } = useIntl();
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const label = formatMessage(
    {
      id: "auth.passwordInput.togglePasswordVisibility.label",
      description:
        "The hint text shown when hovering over the button that toggles the visibility of the users password.",
      defaultMessage:
        "{action, select, hide {Mask} show {Reveal} other {}} password",
    },
    { action: isOpen ? "hide" : "show" },
  );

  const mergeRef = useMergeRefs(inputRef, ref);

  const onClickReveal = () => {
    onToggle();
    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      const length = input.value.length * 2;
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length);
      });
    }
  };

  return (
    <InputGroup>
      <Input
        ref={mergeRef}
        autoComplete="current-password"
        {...props}
        type={isOpen ? "text" : "password"}
      />
      <InputRightElement>
        <IconButton
          bg="transparent !important"
          variant="ghost"
          aria-label={label}
          title={label}
          icon={isOpen ? <HiEyeOff /> : <HiEye />}
          onClick={onClickReveal}
        />
      </InputRightElement>
    </InputGroup>
  );
});

PasswordInput.displayName = "PasswordInput";
