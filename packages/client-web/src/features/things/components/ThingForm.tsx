import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateThingParams,
  createThingParamsSchema,
  Thing,
  useValidationError,
} from "@macadam/api-client";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { ApiErrorAlert } from "../../api/components/ApiErrorAlert";
import { SaveButton } from "../../forms/components/SaveButton";

export interface ThingFormProps {
  error?: FetchBaseQueryError | SerializedError;
  onSubmit: SubmitHandler<CreateThingParams>;
  isLoading: boolean;
  defaultValues?: Partial<Thing>;
}

export const ThingForm = ({
  defaultValues = {},
  error,
  isLoading,
  onSubmit,
}: ThingFormProps) => {
  const { register, handleSubmit, formState, setError } =
    useForm<CreateThingParams>({
      resolver: zodResolver(createThingParamsSchema),
      defaultValues: {
        isPublic: true,
        ...defaultValues,
      },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start">
        <FormControl
          isInvalid={!!errors.name}
          isDisabled={isLoading}
          isRequired
        >
          <FormLabel>
            <FormattedMessage
              id="things.thingForm.name.label"
              defaultMessage="Name"
            />
          </FormLabel>
          <Input placeholder="Name" {...register("name")} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} isDisabled={isLoading}>
          <FormLabel>
            <FormattedMessage
              id="things.thingForm.description.label"
              defaultMessage="Description"
            />
          </FormLabel>
          <Textarea {...register("description")} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={!!errors.isPublic}
          isDisabled={isLoading}
          py="3"
        >
          <Checkbox {...register("isPublic")}>
            <FormattedMessage
              id="things.thingForm.isPublic.label"
              defaultMessage="Public"
            />
          </Checkbox>
          <FormErrorMessage>{errors.isPublic?.message}</FormErrorMessage>
        </FormControl>
        <SaveButton isLoading={isLoading} isDisabled={!isValid} />
        {error && !validationError && <ApiErrorAlert error={error} mt="2" />}
      </VStack>
    </form>
  );
};
