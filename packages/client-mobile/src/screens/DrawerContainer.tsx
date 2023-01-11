import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Box, Text } from "native-base";
export type DrawerContainerProps = DrawerContentComponentProps;

export const DrawerContainer = (props: DrawerContainerProps) => (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    <DrawerItem label="Help" onPress={() => {}} />
    <Box
      width={300}
      height={300}
      flex={1}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
    >
      <Text>This is the drawer</Text>
    </Box>
  </DrawerContentScrollView>
);
