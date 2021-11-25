import { Avatar, AvatarProps } from "@chakra-ui/react";
import { useSession } from "../../../auth/hooks/useSession";

export interface CurrentUserAvatarProps extends Omit<AvatarProps, "src"> {}

// TODO: Add avatar to Kratos traits and consume here.
export const CurrentUserAvatar = (props: CurrentUserAvatarProps) => {
  const { fullName, email } = useSession();
  return <Avatar {...props} name={fullName || email} />;
};
