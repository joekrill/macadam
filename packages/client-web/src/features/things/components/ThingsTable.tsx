import { Icon, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { FaLock, FaUnlock } from "react-icons/fa";
import { FormattedDate, FormattedMessage } from "react-intl";
import { Thing } from "../../api/schemas/things";
import { RouterLink } from "../../routing/components/RouterLink";

export interface ThingsTableProps {
  data?: Thing[];
}

export const ThingsTable = ({ data }: ThingsTableProps) => (
  <Table>
    <Thead>
      <Tr>
        <Th>
          <FormattedMessage
            id="thingsTable.nameHeader.label"
            defaultMessage="Name"
          />
        </Th>
        <Th>
          <FormattedMessage
            id="thingsTable.descriptionHeader.label"
            defaultMessage="Description"
          />
        </Th>
        <Th>
          <FormattedMessage
            id="thingsTable.createdHeader.label"
            defaultMessage="Created"
          />
        </Th>
        <Th>
          <FormattedMessage
            id="thingsTable.privateHeader.label"
            defaultMessage="Private"
          />
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      {data?.map((thing) => (
        <Tr key={thing.id}>
          <Td>
            <RouterLink to={`/things/${thing.id}`}>{thing.name}</RouterLink>
          </Td>
          <Td>{thing.description}</Td>
          <Td>
            <FormattedDate dateStyle="full" value={parseISO(thing.createdAt)} />
          </Td>
          <Td>
            {" "}
            <Icon
              h="1rem"
              w="1rem"
              as={thing.private ? FaLock : FaUnlock}
              color={thing.private ? "red.600" : "green.300"}
            />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
