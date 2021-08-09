import { z } from "zod";

export const uiTextSchema = z.object({
  /**
   * The message\'s context. Useful when customizing messages.
   * @type {object}
   * @memberof UiText
   */
  context: z.unknown().nullish(),

  id: z.number(),
  /**
   * The message text. Written in american english.
   * @type {string}
   * @memberof UiText
   */
  text: z.string(),

  type: z.string(),
});

export type UiText = z.infer<typeof uiTextSchema>;

/**
 * This might include a label and other information that can optionally be used to render UIs.
 * @export
 * @interface Meta
 */
export const metaSchema = z.object({
  label: uiTextSchema.nullish(),
});

export const uiNodeAnchorAttributesSchema = z.object({
  type: z.literal("anchor"),

  /**
   * The link\'s href (destination) URL.  format: uri
   */
  href: z.string(),
  title: uiTextSchema,
});

export const uiNodeImageAttributesSchema = z.object({
  type: z.literal("image"),
  /**
   * The image\'s source URL.  format: uri
   */
  src: z.string(),
});

/**
 * InputAttributes represents the attributes of an input node
 */
export const uiNodeInputAttributesSchema = z.object({
  /**
   * Sets the input\'s disabled field to true or false.
   */
  disabled: z.boolean(),

  label: uiTextSchema.nullish(),

  /**
   * The input\'s element name.
   */
  name: z.string(),

  /**
   * The input's pattern.
   */
  pattern: z.string().optional(),

  /**
   * Mark this input field as required.
   */
  required: z.boolean().optional(),

  type: z.union([
    z.literal("hidden"),
    z.literal("text"),
    z.literal("password"),
    z.literal("submit"),
    z.literal("checkbox"),
    z.literal("email"),
  ]),
  // type: z.string(),

  /**
   * The input\'s value.
   */
  value: z.any().nullable(),
});

export const uiNodeTextAttributesSchema = z.object({
  type: z.literal("text"),

  text: uiTextSchema,
});

export const uiNodeAttributesSchema = z.union([
  uiNodeAnchorAttributesSchema,
  uiNodeImageAttributesSchema,
  uiNodeInputAttributesSchema,
  uiNodeTextAttributesSchema,
]);

/**
 * Nodes are represented as HTML elements or their native UI equivalents. For example, a node can be an `<img>` tag, or an `<input element>` but also `some plain text`.
 */
export const uiNodeCommonSchema = z.object({
  group: z.string(),
  messages: z.array(uiTextSchema).nullish(),
  meta: metaSchema,
});

export const uiNodeAnchorSchema = uiNodeCommonSchema.extend({
  type: z.literal("anchor"),
  attributes: uiNodeAnchorAttributesSchema,
});

export const uiNodeImageSchema = uiNodeCommonSchema.extend({
  type: z.literal("image"),
  attributes: uiNodeImageAttributesSchema,
});

export const uiNodeInputSchema = uiNodeCommonSchema.extend({
  type: z.literal("input"),
  attributes: uiNodeInputAttributesSchema,
});

export type UiNodeInput = z.infer<typeof uiNodeInputSchema>;

export const uiNodeTextSchema = uiNodeCommonSchema.extend({
  type: z.literal("text"),
  attributes: uiNodeTextAttributesSchema,
});

export const uiNodeSchema = z.union([
  uiNodeAnchorSchema,
  uiNodeImageSchema,
  uiNodeInputSchema,
  uiNodeTextSchema,
]);

export type UiNode = z.infer<typeof uiNodeSchema>;

/**
 * Container represents a HTML Form. The container can work with both HTTP Form and JSON requests
 */
export const uiContainerSchema = z.object({
  /**
   * Action should be used as the form action URL `<form action=\"{{ .Action }}\" method=\"post\">`.
   */
  action: z.string(),

  messages: z.array(uiTextSchema).nullish(),

  /**
   * Method is the form method (e.g. POST)
   */
  method: z.string(),

  nodes: z.array(uiNodeSchema),
});

export type UiContainer = z.infer<typeof uiContainerSchema>;
