import { Avatar, Button, Input, Stack } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { NodeFormControlWrapper } from "./NodeFormControlWrapper";

export interface ProfilePictureNodeProps extends SelfServiceUiNodeInputProps {
  maxHeight?: number;
  maxWidth?: number;
}

export const ProfilePictureNode = ({
  flowType,
  isSubmitting,
  maxHeight = 250,
  maxWidth = 250,
  node,
  onChange,
  value,
}: ProfilePictureNodeProps) => {
  const [objectUrl, setObjectUrl] = useState<string | undefined>();
  const { label, node_type, type, onclick, ...attributes } = node.attributes;

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const newFile = Array.from(e.target.files)[0];
    if (!newFile) {
      return;
    }

    setObjectUrl(URL.createObjectURL(newFile));
  }, []);

  // Make sure to always clean up any object URLs created.
  useEffect(
    () => () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    },
    [objectUrl],
  );

  useEffect(() => {
    if (objectUrl) {
      // Creates a new image element, assigning the objectUrl as it's `src`,
      // and once it's been loaded we use a canvas element to resize the image
      // and generate a data URL, which is what will be used as the final
      // value to be sent to the server.
      const image = new Image();
      const onImageLoad = () => {
        const canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        if (canvas.width > maxWidth) {
          canvas.width = maxWidth;
          canvas.height = canvas.width * (image.height / image.width);
        }

        if (canvas.height > maxHeight) {
          canvas.height = maxHeight;
          canvas.width = canvas.height * (image.width / image.height);
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");
          onChange(dataUrl);
        }
      };
      image.addEventListener("load", onImageLoad);
      image.src = objectUrl;
      return () => image.removeEventListener("load", onImageLoad);
    }
  }, [objectUrl, onChange, maxHeight, maxWidth]);

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
    >
      <Stack direction={{ base: "column", sm: "row" }} alignItems="center">
        <Avatar src={value} size="xl" mr="5" />
        <Stack spacing="5" direction="column">
          <Button
            leftIcon={<FaUpload />}
            as="label"
            type="button"
            size="sm"
            {...attributes}
          >
            <FormattedMessage
              id="auth.selfServiceUi.profilePictureNode.uploadButton.label"
              defaultMessage="Change photo"
            />
            <Input
              isDisabled={node.attributes.disabled}
              type="file"
              display="none"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          <Button
            leftIcon={<FaTrash />}
            colorScheme="red"
            variant="outline"
            size="sm"
            type="button"
            onClick={() => onChange("")}
          >
            <FormattedMessage
              id="auth.selfServiceUi.profilePictureNode.deleteButton.label"
              defaultMessage="Delete"
            />
          </Button>
        </Stack>
      </Stack>
    </NodeFormControlWrapper>
  );
};
