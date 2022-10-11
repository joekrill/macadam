import { UiNode } from "../schemas/flows/ui";

/**
 * Returns a list of a all available group names found in a given set of nodes.
 */
export const useNodeGroupNames = (nodes?: Array<UiNode>): Array<string> =>
  Array.from(new Set(nodes?.map((node) => node.group)));
