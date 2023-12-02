import { Button, ButtonProps } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export interface SaveButtonProps extends ButtonProps {}

export const SaveButton = ({ children, ...props }: SaveButtonProps) => (
  <Button
    minWidth={{ base: "full", sm: "xs" }}
    leftIcon={<FaSave />}
    type="submit"
    colorScheme="blue"
    {...props}
  >
    {children || (
      <FormattedMessage
        id="forms.saveButton.text"
        description="The text to show for the 'Save' button used by forms across the app when saving changes to an entity"
        defaultMessage="Save"
      />
    )}
  </Button>
);
