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
import {
  SubmitContactUsParams,
  submitContactUsParamsSchema,
  useValidationError,
} from "@macadam/api-client";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";
import { FaRegEnvelope, FaUser } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import { ApiErrorAlert } from "../../../api/components/ApiErrorAlert";
import { SaveButton } from "../../../forms/components/SaveButton";

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
        // @ts-ignore: TODO fix this
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
              id="contactUs.form.nameField.label"
              description="The label to display for the name field of the Contact Us form"
              defaultMessage="Name"
            />
          </FormLabel>

          <InputGroup>
            <InputLeftElement>
              <FaUser />
            </InputLeftElement>
            <Input
              type="text"
              placeholder={formatMessage({
                id: "contactUs.form.nameField.placeholder",
                description:
                  "The placeholder text to display when the name field of the Contact Us form is empty",
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
              id="contactUs.form.emailField.label"
              description="The label to display for the email field of the Contact Us form"
              defaultMessage="Email"
            />
          </FormLabel>

          <InputGroup>
            <InputLeftElement>
              <FaRegEnvelope />
            </InputLeftElement>
            <Input
              type="email"
              placeholder={formatMessage({
                id: "contactUs.form.emailField.placeholder",
                description:
                  "The placeholder text to display when the email field of the Contact Us form is empty",
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
              id="contactUs.form.messageField.label"
              description="The label to display for the message field of the Contact Us form"
              defaultMessage="Message"
            />
          </FormLabel>

          <Textarea
            placeholder={formatMessage({
              id: "contactUs.form.messageField.placeholder",
              description:
                "The placeholder text to display when the message field of the Contact Us form is empty",
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
            id="contactUs.form.sendButton.text"
            description="The text to display for the Send button of the Contact Us form"
            defaultMessage="Send Message"
          />
        </SaveButton>
        {error && !validationError && <ApiErrorAlert error={error} mt="2" />}
      </VStack>
    </form>
  );
};
