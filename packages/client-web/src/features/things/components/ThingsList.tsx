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
import { useCallback, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { HiPlusSm, HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Link as ReactRouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthCan } from "../../auth/components/AuthCan";
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
  const location = useLocation();
  const urlParams = useUrlSearchParams();
  const { page, getPageTo } = usePageUrlParam();
  const owned = !!useUrlSearchParam("mine");
  const { setRules, rules, paramValue: sort } = useSortByUrlParam<Thing>();
  const [searchInput, setSearchInput] = useState(
    urlParams.get("search")?.trim()
  );

  const { data, isFetching, error, refetch } = thingsApi.useListThingsQuery({
    page,
    owned,
    sort,
    search: urlParams.get("search")?.trim(),
  });

  const updateUrlParam = useCallback(
    (key: string, value?: string) => {
      if (value && value.trim()) {
        urlParams.set(key, value.trim());
      } else {
        urlParams.delete(key);
      }
      urlParams.delete(DEFAULT_PAGE_PARAM_NAME);
      const query = `?${urlParams.toString()}`;

      if (location.search !== query) {
        navigate(`/things/${query}`);
      } else {
        refetch();
      }
    },
    [urlParams, navigate, location, refetch]
  );

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage id="thingsList.title" defaultMessage="Things" />
        <IconButton
          ml="3"
          isRound
          size="sm"
          aria-label={formatMessage({
            id: "thingsList.refreshButton.ariaLabel",
            defaultMessage: "Refresh",
          })}
          variant="outline"
          icon={<HiRefresh />}
          onClick={() => updateUrlParam("search", searchInput)}
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
          <FormControl
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              updateUrlParam("search", searchInput);
            }}
          >
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                rounded="md"
                type="search"
                value={searchInput || ""}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                placeholder={formatMessage({
                  id: "thingsList.search.placeholder",
                  defaultMessage: "Filter by name or description...",
                })}
              />
            </InputGroup>
          </FormControl>
          <Select
            rounded="md"
            size="sm"
            width="10em"
            value={owned ? "mine" : ""}
            onChange={(e) => {
              updateUrlParam(
                "mine",
                e.target.value === "mine" ? "1" : undefined
              );
            }}
          >
            <option value="">
              {formatMessage({
                id: "thingsList.ownFilter.all",
                defaultMessage: "All Things",
              })}
            </option>
            <option value="mine">
              {formatMessage({
                id: "thingsList.ownFilter.mine",
                defaultMessage: "My Things",
              })}
            </option>
          </Select>
        </HStack>
        <AuthCan action="create" subject="Thing">
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
        </AuthCan>
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
