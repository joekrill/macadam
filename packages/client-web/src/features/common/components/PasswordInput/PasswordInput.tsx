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

export interface PasswordInputProps extends InputProps {}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>((props, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = React.useRef<HTMLInputElement>(null);

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
      <InputRightElement>
        <IconButton
          bg="transparent !important"
          variant="ghost"
          aria-label={isOpen ? "Mask password" : "Reveal password"}
          icon={isOpen ? <HiEyeOff /> : <HiEye />}
          onClick={onClickReveal}
        />
      </InputRightElement>
      <Input
        ref={mergeRef}
        autoComplete="current-password"
        {...props}
        type={isOpen ? "text" : "password"}
      />
    </InputGroup>
  );
});
