import { z } from "zod";

export const uiTextSchema = z.object({
  /**
   * The message\'s context. Useful when customizing messages.
   */
  context: z.unknown().nullish(),

  id: z.number(),

  /**
   * The message text. Written in american english.
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
export const uiNodeMetaSchema = z.object({
  label: uiTextSchema.nullish(),
});

export const uiNodeAnchorAttributesSchema = z.object({
  /**
   * The link\'s href (destination) URL.  format: uri
   */
  href: z.string(),

  id: z.string(),

  node_type: z.string(),

  title: uiTextSchema,
});

export const uiNodeImageAttributesSchema = z.object({
  /**
   * Height of the image
   */
  height: z.number().optional(),

  id: z.string(),

  /**
   * A unique identifier
   */
  node_type: z.string(),

  /**
   * The image\'s source URL.  format: uri
   */
  src: z.string(),

  /**
   * Width of the image
   */
  width: z.number().optional(),
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
   * A unique identifier
   */
  node_type: z.string(),

  /**
   * OnClick may contain javascript which should be executed on click. This is primarily used for WebAuthn.
   */
  onclick: z.string().optional(),

  /**
   * The input's pattern.
   */
  pattern: z.string().optional(),

  /**
   * Mark this input field as required.
   */
  required: z.boolean().optional(),

  type: z.union([
    z.literal("button"),
    z.literal("checkbox"),
    z.literal("email"),
    z.literal("hidden"),
    z.literal("password"),
    z.literal("submit"),
    z.literal("text"),
  ]),

  /**
   * The input\'s value.
   */
  value: z.any().nullable(),
});

export const uiNodeScriptAttributesSchema = z.object({
  /**
   * The script async type
   */
  async: z.boolean(),

  /**
   * The script cross origin policy
   */
  crossorigin: z.string(),

  /**
   * A unique identifier
   */
  id: z.string(),

  /**
   * The script\'s integrity hash
   */
  integrity: z.string(),

  node_type: z.literal("script"),

  /**
   * The script referrer policy
   */
  referrerpolicy: z.string(),

  /**
   * The script source
   */
  src: z.string(),

  type: z.string(),
});

export const uiNodeTextAttributesSchema = z.object({
  /**
   * A unique identifier
   */
  id: z.string(),

  text: uiTextSchema,

  node_type: z.literal("text"),
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
  meta: uiNodeMetaSchema,
});

export const uiNodeAnchorSchema = uiNodeCommonSchema.extend({
  type: z.literal("anchor"),
  attributes: uiNodeAnchorAttributesSchema,
});

export type UiNodeAnchor = z.infer<typeof uiNodeAnchorSchema>;

export const uiNodeImageSchema = uiNodeCommonSchema.extend({
  type: z.literal("img"),
  attributes: uiNodeImageAttributesSchema,
});

export type UiNodeImage = z.infer<typeof uiNodeImageSchema>;

export const uiNodeInputSchema = uiNodeCommonSchema.extend({
  type: z.literal("input"),
  attributes: uiNodeInputAttributesSchema,
});

export type UiNodeInput = z.infer<typeof uiNodeInputSchema>;

export const uiNodeScriptSchema = uiNodeCommonSchema.extend({
  type: z.literal("script"),
  attributes: uiNodeScriptAttributesSchema,
});

export type UiNodeScript = z.infer<typeof uiNodeScriptSchema>;

export const uiNodeTextSchema = uiNodeCommonSchema.extend({
  type: z.literal("text"),
  attributes: uiNodeTextAttributesSchema,
});

export type UiNodeText = z.infer<typeof uiNodeTextSchema>;

export const uiNodeSchema = z.union([
  uiNodeAnchorSchema,
  uiNodeImageSchema,
  uiNodeInputSchema,
  uiNodeTextSchema,
  uiNodeScriptSchema,
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
