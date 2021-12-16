import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { HiPlusSm, HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../errors/components/ErrorAlert/ErrorAlert";
import { Pagination } from "../../pagination/components/Pagination/Pagination";
import {
  DEFAULT_PAGE_PARAM_NAME,
  usePageUrlParam,
} from "../../pagination/hooks/usePageUrlParam";
import { useUrlSearchParam } from "../../routing/hooks/useUrlSearchParam";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { useSortByUrlParam } from "../../sorting/hooks/useSortByUrlParam";
import { thingsApi } from "../thingsApi";
import { Thing } from "../thingsSchemas";
import { ThingsTable } from "./ThingsTable";

export const ThingsList = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const urlParams = useUrlSearchParams();
  const { page, getPageTo } = usePageUrlParam();
  const owned = !!useUrlSearchParam("mine");
  const { setRules, rules, paramValue: sort } = useSortByUrlParam<Thing>();

  const { data, isFetching, error, refetch } = thingsApi.useListThingsQuery({
    page,
    owned,
    sort,
  });

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage id="thingsList.title" defaultMessage="Things" />
        <IconButton
          ml="3"
          isRound
          aria-label={formatMessage({
            id: "thingsList.refreshButton.ariaLabel",
            defaultMessage: "Refresh",
          })}
          colorScheme="whiteAlpha"
          variant="outline"
          icon={<HiRefresh />}
          onClick={refetch}
          isLoading={isFetching}
        />
      </Heading>
      <Stack
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        spacing="4"
        my="5"
      >
        <HStack flex="1">
          <FormControl>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                type="search"
                placeholder={formatMessage({
                  id: "thingsList.search.placeholder",
                  defaultMessage: "Filter by name or description...",
                })}
              />
            </InputGroup>
          </FormControl>
          <Select
            size="sm"
            width="10em"
            value={owned ? "mine" : ""}
            onChange={(e) => {
              if (e.target.value === "mine") {
                urlParams.set("mine", "1");
              } else {
                urlParams.delete("mine");
              }
              urlParams.delete(DEFAULT_PAGE_PARAM_NAME);
              navigate(`/things/?${urlParams.toString()}`);
            }}
          >
            <option value="">
              <FormattedMessage
                id="thingsList.ownFilter.all"
                defaultMessage="All Things"
              />
            </option>
            <option value="mine">
              <FormattedMessage
                id="thingsList.ownFilter.mine"
                defaultMessage="My Things"
              />
            </option>
          </Select>
        </HStack>
        <ButtonGroup size="sm" variant="outline">
          <Button
            aria-label={formatMessage({
              id: "thingsList.addButton.ariaLabel",
              defaultMessage: "Add new Thing",
            })}
            leftIcon={<HiPlusSm />}
            to="new"
            as={ReactRouterLink}
          >
            <FormattedMessage
              id="thingsList.addButton.label"
              defaultMessage="New thing"
            />
          </Button>
        </ButtonGroup>
      </Stack>
      {error && <ErrorAlert my="5" onRetryClick={refetch} error={error} />}
      {data && (
        <ThingsTable
          data={data.data}
          onSortByChange={setRules}
          sortBy={rules}
        />
      )}
      {data && (
        <Pagination
          p="3"
          buttonProps={(page) => ({
            as: ReactRouterLink,
            to: getPageTo(page),
          })}
          currentPage={page}
          totalPages={data?.pagination.totalPages}
        />
      )}
    </Box>
  );
};
