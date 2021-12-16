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
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ApiErrorAlert } from "../../api/components/ApiErrorAlert";
import { useValidationError } from "../../api/hooks/useValidationError";
import { SaveButton } from "../../forms/components/SaveButton";
import { thingsApi } from "../thingsApi";
import { CreateThingParams, createThingParamsSchema } from "../thingsSchemas";

export const ThingForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState, setError } =
    useForm<CreateThingParams>({
      resolver: zodResolver(createThingParamsSchema),
      defaultValues: {
        isPrivate: false,
      },
    });
  const { errors, isValid } = formState;
  const [submit, { error, isLoading, isSuccess, data }] =
    thingsApi.useCreateThingMutation();
  const validationError = useValidationError(error);

  useEffect(() => {
    if (isSuccess && data?.data.id) {
      navigate(`/things/${data.data.id}`);
    }
  }, [isSuccess, data, navigate]);

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
    <form onSubmit={handleSubmit(submit)}>
      <VStack alignItems="flex-start">
        <FormControl
          isInvalid={!!errors.name}
          isDisabled={isLoading}
          isRequired
        >
          <FormLabel>
            <FormattedMessage id="thingForm.name.label" defaultMessage="Name" />
          </FormLabel>
          <Input placeholder="Name" {...register("name")} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} isDisabled={isLoading}>
          <FormLabel>
            <FormattedMessage
              id="thingForm.description.label"
              defaultMessage="Description"
            />
          </FormLabel>
          <Textarea {...register("description")} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={!!errors.isPrivate}
          isDisabled={isLoading}
          py="3"
        >
          <Checkbox {...register("isPrivate")}>
            <FormattedMessage
              id="thingForm.isPrivate.label"
              defaultMessage="Private"
            />
          </Checkbox>
          <FormErrorMessage>{errors.isPrivate?.message}</FormErrorMessage>
        </FormControl>
        <SaveButton isLoading={isLoading} isDisabled={!isValid} />
        {error && !validationError && <ApiErrorAlert error={error} mt="2" />}
      </VStack>
    </form>
  );
};
