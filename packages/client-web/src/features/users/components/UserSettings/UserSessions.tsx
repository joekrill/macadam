import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export const UserSessions = () => {
  // const sessions = appApi.useGetSessionsQuery();
  const sessions = {
    data: {
      data: [] as Array<{
        id: string;
        active: boolean;
        createdAt: string;
        expiresAt: string;
      }>,
    },
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Active</Th>
          <Th>Created</Th>
          <Th>Expires </Th>
        </Tr>
      </Thead>
      <Tbody>
        {sessions.data?.data.map((row) => (
          <Tr>
            <Td>{row.id}</Td>
            <Td>{String(row.active)}</Td>
            <Td>{row.createdAt}</Td>
            <Td>{row.expiresAt}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
