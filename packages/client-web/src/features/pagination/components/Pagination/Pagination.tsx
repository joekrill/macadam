import {
  ButtonGroup,
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
import { PaginationButton, PaginationButtonProps } from "./PaginationButton";
import { QueryStringPaginationButton } from "./QueryStringPaginationButton";
import { usePaginationPages } from "./usePaginationPages";

export interface PaginationProps<
  ButtonComponentProps extends object = ButtonProps,
> extends FlexProps {
  ButtonComponent?: React.ElementType<
    PaginationButtonProps & ButtonComponentProps
  >;
  useQueryStringPagination?: boolean;
  currentPage: number;
  totalPages?: number;
  maxSiblings?: number;
  size?: ButtonProps["size"];
  colorScheme?: ButtonProps["colorScheme"];
  buttonProps?: ButtonComponentProps;
}

export const Pagination = ({
  useQueryStringPagination,
  ButtonComponent = useQueryStringPagination
    ? QueryStringPaginationButton
    : PaginationButton,
  buttonProps,
  currentPage,
  maxSiblings,
  totalPages,
  colorScheme = "blue",
  size,
  ...props
}: PaginationProps) => {
  const defaultMaxSiblings =
    useBreakpointValue({ base: 0, sm: 1, md: 2, lg: 4 }) || 0;

  const pages = usePaginationPages({
    currentPage,
    totalPages,
    maxSiblings:
      typeof maxSiblings === "number" ? maxSiblings : defaultMaxSiblings,
  });

  const spacerColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.100`,
  );

  const isDisabled = !Number.isFinite(totalPages) || totalPages === 0;

  return (
    <Flex w="full" alignItems="center" justifyContent="center" {...props}>
      <ButtonGroup
        as={HStack}
        colorScheme={colorScheme}
        isDisabled={isDisabled}
        size={size}
      >
        <ButtonComponent
          key="prev"
          isDisabled={isDisabled || currentPage === 1}
          pageNumber={currentPage - 1}
          variant="ghost"
          {...buttonProps}
        >
          <Icon as={FaChevronLeft} boxSize={4} />
          <VisuallyHidden>
            <FormattedMessage
              id="pagination.previousPage.label"
              defaultMessage="Previous Page"
            />
          </VisuallyHidden>
        </ButtonComponent>
        {pages.map((page, i) =>
          page < 0 ? (
            <Icon
              key={`${i}-${page}`}
              as={HiOutlineDotsHorizontal}
              color={spacerColor}
              opacity={0.4}
            />
          ) : (
            <ButtonComponent
              key={page}
              isDisabled={isDisabled}
              pageNumber={page}
              variant={currentPage === page ? "solid" : "ghost"}
              {...buttonProps}
            >
              <FormattedNumber value={page} />
            </ButtonComponent>
          ),
        )}

        <ButtonComponent
          key="next"
          isDisabled={isDisabled || currentPage === totalPages}
          pageNumber={currentPage + 1}
          variant="ghost"
          {...buttonProps}
        >
          <Icon as={FaChevronRight} boxSize={4} />
          <VisuallyHidden>
            <FormattedMessage
              id="pagination.nextPage.label"
              defaultMessage="Next Page"
            />
          </VisuallyHidden>
        </ButtonComponent>
      </ButtonGroup>
    </Flex>
  );
};
