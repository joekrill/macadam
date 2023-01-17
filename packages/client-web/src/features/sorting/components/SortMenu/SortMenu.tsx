import {
  Button,
  ButtonProps,
  Icon,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps,
} from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";
import { useIntl } from "react-intl";
import { parseSortingRule } from "../../parseSortingRule";
import { serializeSortingRules } from "../../serializeSortingRule";

export type SitesSortField = "updatedAt" | "createdAt" | "name";
export type SitesSortOrder = "+" | "-";

export interface SortMenuProps extends Omit<MenuProps, "children"> {
  fields: Record<string, string>;
  value?: string;
  onChange: (value: string) => void;
  buttonProps?: ButtonProps;
}

export const SortMenu = ({
  fields,
  value,
  onChange,
  buttonProps,
  ...props
}: SortMenuProps) => {
  const { formatMessage } = useIntl();
  const rule = value ? parseSortingRule(value) : { id: "", desc: false };

  return (
    <Menu {...props}>
      <MenuButton
        size="sm"
        as={Button}
        iconSpacing="1em"
        rightIcon={<Icon as={FaCaretDown} />}
        {...buttonProps}
      >
        Sort
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title={formatMessage({
            id: "sorting.sortMenu.sortByGroupTitle",
            defaultMessage: "Sort by",
          })}
          type="radio"
          value={rule.id}
          onChange={(id) =>
            onChange(
              serializeSortingRules({
                ...rule,
                id: id as string,
              })
            )
          }
        >
          {Object.keys(fields).map((field) => (
            <MenuItemOption key={field} value={field}>
              {fields[field]}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
        <MenuOptionGroup
          title={formatMessage({
            id: "sorting.sortMenu.sortOrderGroupTitle",
            defaultMessage: "Sort order",
          })}
          type="radio"
          value={rule.desc ? "desc" : "asc"}
          onChange={(order) =>
            onChange(
              serializeSortingRules({
                ...rule,
                desc: order === "desc",
              })
            )
          }
        >
          <MenuItemOption value="asc">
            {formatMessage({
              id: "sorting.sortMenu.sortOrderAscending",
              defaultMessage: "Ascending",
            })}
          </MenuItemOption>
          <MenuItemOption value="desc">
            {formatMessage({
              id: "sorting.sortMenu.sortOrderDescending",
              defaultMessage: "Descending",
            })}
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
