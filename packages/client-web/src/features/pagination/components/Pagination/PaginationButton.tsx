import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";

export interface PaginationButtonProps extends ButtonProps {
  pageNumber: number;
}

export const PaginationButton = forwardRef<PaginationButtonProps, "button">(
  ({ pageNumber: _pageNumber, ...props }, ref) => (
    <Button ref={ref} rounded="md" {...props} />
  )
);
