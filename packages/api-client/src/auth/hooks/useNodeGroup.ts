import { useMemo } from "react";
import { UiNode } from "../schemas/flows/ui";

export const useNodeGroup = (nodes: Array<UiNode> = [], group?: string) =>
  useMemo(
    () =>
      group
        ? nodes.filter(
            (node) => node.group === group || node.group === "default"
          )
        : nodes,
    [nodes, group]
  );
