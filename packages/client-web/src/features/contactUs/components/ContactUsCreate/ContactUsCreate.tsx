import { useSession } from "../../../auth/hooks/useSession";
import { contactUsApi } from "../../contactUsApi";
import { ContactUsForm } from "../ContactUsForm/ContactUsForm";
import { ContactUsSuccessAlert } from "../ContactUsSuccessAlert/ContactUsSuccessAlert";

export const ContactUsCreate = () => {
  const { identity } = useSession();
  const [submit, { error, isLoading, isSuccess }] =
    contactUsApi.useSubmitContactUsMutation();

  if (isSuccess) {
    return <ContactUsSuccessAlert />;
  }

  return (
    <ContactUsForm
      defaultValues={{
        email: identity?.traits?.email || "",
        name: identity?.traits?.name || "",
      }}
      isLoading={isLoading}
      onSubmit={submit}
      error={error}
    />
  );
};
