import {
  As,
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  HStack,
  Icon,
  useBreakpointValue,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { ComponentProps } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { usePaginationPages } from "./usePaginationPages";

export interface PaginationProps extends FlexProps {
  currentPage: number;
  totalPages?: number;
  maxSiblings?: number;
  isDisabled?: boolean;
  size?: ButtonProps["size"];
  colorScheme?: ButtonProps["colorScheme"];
  buttonProps?: (page: number) => ComponentProps<typeof Button>;
}

export const Pagination = ({
  buttonProps,
  currentPage,
  maxSiblings,
  totalPages,
  colorScheme = "blue",
  isDisabled: isDisabledProp,
  size,
  ...props
}: PaginationProps) => {
  const isDisabled = totalPages === 0 || isDisabledProp;
  const sharedProps = {
    colorScheme,
    isDisabled,
    size,
    as: undefined as As<any> | undefined,
  };

  const defaultMaxSiblings =
    useBreakpointValue({ base: 0, sm: 1, md: 2, lg: 4 }) || 0;
  const pages = usePaginationPages({
    currentPage,
    totalPages,
    maxSiblings:
      typeof maxSiblings === "number" ? maxSiblings : defaultMaxSiblings,
  });
  const spacerColor = useColorModeValue(
    `${colorScheme}.700`,
    `${colorScheme}.200`
  );

  return (
    <Flex w="full" alignItems="center" justifyContent="center" {...props}>
      <HStack>
        <Button
          key="prev"
          variant="ghost"
          {...sharedProps}
          {...(buttonProps ? buttonProps(currentPage - 1) : {})}
          isDisabled={currentPage === 1 || isDisabled}
        >
          <Icon as={FaChevronLeft} boxSize={4} />
          <VisuallyHidden>
            <FormattedMessage
              id="pagination.previousPage.label"
              defaultMessage="Previous Page"
            />
          </VisuallyHidden>
        </Button>
        {pages.map((page, i) =>
          page < 0 ? (
            <Icon
              key={`${i}-${page}`}
              as={HiOutlineDotsHorizontal}
              color={spacerColor}
            />
          ) : (
            <Button
              variant={currentPage === page ? "solid" : "ghost"}
              rounded="md"
              key={page}
              {...sharedProps}
              {...(buttonProps ? buttonProps(page) : {})}
            >
              <FormattedNumber value={page} />
            </Button>
          )
        )}

        <Button
          key="next"
          variant="ghost"
          {...sharedProps}
          {...(buttonProps ? buttonProps(currentPage + 1) : {})}
          isDisabled={currentPage === totalPages || isDisabled}
        >
          <Icon as={FaChevronRight} boxSize={4} />
          <VisuallyHidden>
            <FormattedMessage
              id="pagination.nextPage.label"
              defaultMessage="Next Page"
            />
          </VisuallyHidden>
        </Button>
      </HStack>
    </Flex>
  );
};
