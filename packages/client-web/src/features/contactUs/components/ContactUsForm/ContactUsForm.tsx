import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";
import { FaRegEnvelope, FaUser } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import { ApiErrorAlert } from "../../../api/components/ApiErrorAlert";
import { useValidationError } from "../../../api/hooks/useValidationError";
import { SaveButton } from "../../../forms/components/SaveButton";
import {
  SubmitContactUsParams,
  submitContactUsParamsSchema,
} from "../../contactUsSchemas";

export interface ContactUsFormProps {
  error?: FetchBaseQueryError | SerializedError;
  defaultValues?: Partial<SubmitContactUsParams>;
  isLoading: boolean;
  onSubmit: SubmitHandler<SubmitContactUsParams>;
}

export const ContactUsForm = ({
  defaultValues,
  error,
  isLoading,
  onSubmit,
}: ContactUsFormProps) => {
  const { register, handleSubmit, formState, setError } =
    useForm<SubmitContactUsParams>({
      resolver: zodResolver(submitContactUsParamsSchema),
      defaultValues,
    });
  const { errors, isValid } = formState;
  const validationError = useValidationError(error);

  useMemo(() => {
    validationError?.issues.forEach((issue) => {
      const [path] = issue.path;
      if (path) {
        // @ts-ignore
        setError(path, { message: issue.message, type: "validate" });
      }
    });
  }, [validationError, setError]);
  const { formatMessage } = useIntl();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={5}>
        <FormControl
          isRequired
          isInvalid={!!errors.name}
          isDisabled={isLoading}
        >
          <FormLabel>
            <FormattedMessage
              id="app.contactUsForm.nameField.label"
              defaultMessage="Name"
            />
          </FormLabel>

          <InputGroup>
            <InputLeftElement children={<FaUser />} />
            <Input
              type="text"
              placeholder={formatMessage({
                id: "app.contactUsForm.nameField.placeholder",
                defaultMessage: "Your Name",
              })}
              {...register("name")}
            />
          </InputGroup>
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={!!errors.email}
          isDisabled={isLoading}
        >
          <FormLabel>
            <FormattedMessage
              id="app.contactUsForm.emailField.label"
              defaultMessage="Email"
            />
          </FormLabel>

          <InputGroup>
            <InputLeftElement children={<FaRegEnvelope />} />
            <Input
              type="email"
              placeholder={formatMessage({
                id: "app.contactUsForm.emailField.placeholder",
                defaultMessage: "Your Email",
              })}
              {...register("email")}
            />
          </InputGroup>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.message}
        >
          <FormLabel>
            <FormattedMessage
              id="app.contactUsForm.messageField.label"
              defaultMessage="Message"
            />
          </FormLabel>

          <Textarea
            placeholder={formatMessage({
              id: "app.contactUsForm.messageField.placeholder",
              defaultMessage: "Your Message",
            })}
            rows={6}
            resize="none"
            {...register("message")}
          />
          <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
        </FormControl>

        <SaveButton
          isLoading={isLoading}
          isDisabled={!isValid}
          leftIcon={<AiOutlineSend />}
        >
          <FormattedMessage
            id="app.contactUsForm.sendButton.label"
            defaultMessage="Send Message"
          />
        </SaveButton>
        {error && !validationError && <ApiErrorAlert error={error} mt="2" />}
      </VStack>
    </form>
  );
};
