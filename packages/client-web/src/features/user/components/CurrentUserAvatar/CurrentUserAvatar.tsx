import { Avatar, AvatarProps } from "@chakra-ui/react";
import { useSession } from "@macadam/api-client";

export interface CurrentUserAvatarProps extends Omit<AvatarProps, "src"> {}

// TODO: Add avatar to Kratos traits and consume here.
export const CurrentUserAvatar = (props: CurrentUserAvatarProps) => {
  const { identity } = useSession();
  return (
    <Avatar
      {...props}
      name={identity?.traits?.name || identity?.traits?.email || ""}
      src={identity?.traits?.picture || undefined}
    />
  );
};
