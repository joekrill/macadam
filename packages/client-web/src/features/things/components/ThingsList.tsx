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
import { thingsApi, useSession } from "@macadam/api-client";
import { useCallback, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { HiPlusSm, HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Link as ReactRouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { IfAuthenticated } from "../../auth/components/IfAuthenticated";
import { IfAuthorized } from "../../auth/components/IfAuthorized";
import { ErrorAlert } from "../../errors/components/ErrorAlert/ErrorAlert";
import { Pagination } from "../../pagination/components/Pagination/Pagination";
import {
  DEFAULT_PAGE_PARAM_NAME,
  usePageUrlParam,
} from "../../pagination/hooks/usePageUrlParam";
import { useUrlSearchParam } from "../../routing/hooks/useUrlSearchParam";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { useSortByUrlParam } from "../../sorting/hooks/useSortByUrlParam";
import { ThingsTable } from "./ThingsTable";

export const ThingsList = () => {
  const { formatMessage } = useIntl();
  const { isLoggedIn, isUnknown } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useUrlSearchParams();
  const page = usePageUrlParam();
  const owned = !!useUrlSearchParam("mine") && isLoggedIn;
  const { setRules, rules, paramValue: sort } = useSortByUrlParam();
  const [searchInput, setSearchInput] = useState(
    urlParams.get("search")?.trim(),
  );

  const { data, isFetching, error, refetch } = thingsApi.useListThingsQuery(
    {
      page,
      owned,
      sort,
      search: urlParams.get("search")?.trim(),
    },
    { skip: isUnknown },
  );

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
    [urlParams, navigate, location, refetch],
  );

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage
          id="things.thingsList.heading"
          description="The heading text shown at the top of the things list"
          defaultMessage="Things"
        />
        <IconButton
          ml="3"
          isRound
          size="sm"
          aria-label={formatMessage({
            id: "things.thingsList.refreshButton.ariaLabel",
            description:
              "The accesible label for the Refresh button for the list of Things",
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
                  id: "things.thingsList.search.placeholder",
                  description:
                    "The placeholder text for the search box filter of the things list",
                  defaultMessage: "Filter by name or description...",
                })}
              />
            </InputGroup>
          </FormControl>
          <IfAuthenticated>
            <Select
              rounded="md"
              size="sm"
              width="10em"
              value={owned ? "mine" : ""}
              onChange={(e) => {
                updateUrlParam(
                  "mine",
                  e.target.value === "mine" ? "1" : undefined,
                );
              }}
            >
              <option value="">
                {formatMessage({
                  id: "things.thingsList.ownFilter.all",
                  description: "The text for the 'All Things' options filter",
                  defaultMessage: "All Things",
                })}
              </option>
              <option value="mine">
                {formatMessage({
                  id: "things.thingsList.ownFilter.mine",
                  description: "The text for the 'My Things' options filter",
                  defaultMessage: "My Things",
                })}
              </option>
            </Select>
          </IfAuthenticated>
        </HStack>
        <IfAuthorized action="create" subject="Thing">
          <ButtonGroup size="sm" variant="outline">
            <Button
              aria-label={formatMessage({
                id: "things.thingsList.addButton.ariaLabel",
                description:
                  "The accesible label for the button to add a new thing shown at the top of the list of Things",
                defaultMessage: "Add new Thing",
              })}
              leftIcon={<HiPlusSm />}
              to="new"
              as={ReactRouterLink}
            >
              <FormattedMessage
                id="things.thingsList.addButton.text"
                description="The text of the button for adding a new Thing"
                defaultMessage="New thing"
              />
            </Button>
          </ButtonGroup>
        </IfAuthorized>
      </Stack>
      {error && <ErrorAlert my="5" onRetryClick={refetch} error={error} />}
      {data && (
        <ThingsTable
          data={data.data}
          onSortingChange={setRules}
          sorting={rules?.map((rule) => ({
            ...rule,
            desc: rule.desc ?? false,
          }))}
        />
      )}
      {data && (
        <Pagination
          p="3"
          useQueryStringPagination
          currentPage={page}
          totalPages={data?.pagination.totalPages}
        />
      )}
    </Box>
  );
};
