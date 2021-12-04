import {
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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { usePagination } from "./usePagination";

export interface PaginationProps extends FlexProps {
  currentPage: number;
  totalPages?: number;
  maxSiblings?: number;
  isDisabled?: boolean;
  size?: ButtonProps["size"];
  colorScheme?: ButtonProps["colorScheme"];
}

export const Pagination = ({
  currentPage,
  maxSiblings,
  totalPages,
  colorScheme = "blue",
  isDisabled,
  size,
  ...props
}: PaginationProps) => {
  const buttonProps = { colorScheme, isDisabled, size };
  const defaultMaxSiblings =
    useBreakpointValue({ base: 0, sm: 1, md: 2, lg: 4 }) || 0;
  const pages = usePagination({
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
          key="first"
          variant="ghost"
          {...buttonProps}
          isDisabled={currentPage === 1 || isDisabled}
        >
          <Icon as={FaChevronLeft} boxSize={4} />
          <VisuallyHidden>
            <FormattedMessage
              id="pagination.previousPage"
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
              {...buttonProps}
            >
              <FormattedNumber value={page} />
            </Button>
          )
        )}

        <Button
          key="last"
          variant="ghost"
          {...buttonProps}
          isDisabled={currentPage === totalPages || isDisabled}
        >
          <Icon as={FaChevronRight} boxSize={4} />
          <VisuallyHidden>
            <FormattedMessage
              id="pagination.nextPage"
              defaultMessage="Next Page"
            />
          </VisuallyHidden>
        </Button>
      </HStack>
    </Flex>
  );
};
