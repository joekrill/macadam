export type UUID = string;

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauitext}
 */
export interface UiText {
  context?: unknown;
  id: number;
  text: string;
  type: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauitexts}
 */
export type UiTexts = Array<UiText>;

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauinodeinputattributes}
 */
export interface UiNodeInputAttributes {
  disabled: boolean;
  label?: UiText;
  name: string;
  pattern?: string;
  required?: boolean;
  type: "hidden" | "text" | "password" | "submit" | "checkbox" | "email";
  value?: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauinodetextattributes}
 */
export interface UiNodeTextAttributes {
  text: UiText;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauinodeinputattributes}
 */
/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauinodeimageattributes}
 */
export interface UiNodeImageAttributes {
  src: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauinodeanchorattributes}
 */

export interface UiNodeAnchorAttributes {
  href: string;
  title: UiText;
}

export type UiNodeAttributes =
  | UiNodeInputAttributes
  | UiNodeTextAttributes
  | UiNodeImageAttributes
  | UiNodeAnchorAttributes;

export interface Meta {
  label: UiText;
}

export interface UiNodeCommon {
  group: string;
  messages?: UiTexts;
  meta: Meta;
}

export interface UiNodeInput extends UiNodeCommon {
  type: "input";
  attributes: UiNodeInputAttributes;
}

export interface UiNodeAnchor extends UiNodeCommon {
  type: "anchor";
  attributes: UiNodeAnchorAttributes;
}

export interface UiNodeImage extends UiNodeCommon {
  type: "image";
  attributes: UiNodeImageAttributes;
}

export interface UiNodeText extends UiNodeCommon {
  type: "text";
  attributes: UiNodeTextAttributes;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemauinode}
 */
export type UiNode = UiNodeAnchor | UiNodeText | UiNodeImage | UiNodeInput;

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#uicontainer}
 */
export interface UiContainer {
  action: string;
  messages?: UiTexts;
  method: string;
  nodes: Array<UiNode>;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemarecoveryaddress}
 */
export interface RecoveryAddress {
  created_at?: string;
  id: UUID;
  updated_at?: string;
  value: string;
  via: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemaidentitytraits}
 */
export type IdentityTraits = unknown;

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemaverifiableidentityaddress}
 */
export interface VerifiableIdentityAddress {
  created_at?: string;
  id: UUID;
  status: string;
  updated_at?: string;
  value: string;
  verified: boolean;
  verified_at?: string | null;
  via: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemaidentity}
 */
export interface Identity {
  created_at?: string;
  id: UUID;
  recovery_addresses?: Array<RecoveryAddress>;
  schema_id: string;
  schema_url: string;
  traits: IdentityTraits;
  updated_at?: string;
  verifiable_addresses: Array<VerifiableIdentityAddress>;
}

export interface SelfServiceFlowCommon {
  active?: string; // CredentialsType
  id: UUID;
  ui: UiContainer;
  request_url: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemaloginflow}
 */
export interface SelfServiceLoginFlow extends SelfServiceFlowCommon {
  created_at?: string;
  expires_at: string;
  forced?: boolean;
  issued_at: string;
  type: "api" | "browser";
  updated_at?: string;
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#schemaloginflow}
 */
export interface SelfServiceRegistrationFlow extends SelfServiceFlowCommon {
  expires_at: string;
  issued_at: string;
  type?: "api" | "browser";
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#verificationflow}
 */
export interface SelfServiceVerificationFlow extends SelfServiceFlowCommon {
  expires_at?: string;
  issued_at?: string;

  /**
   * @see {@link https://github.com/ory/kratos/blob/master/selfservice/flow/verification/state.go}
   */
  state: "choose_method" | "sent_email" | "passed_challenge";
  type: "api" | "browser";
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#recoveryflow}
 */
export interface SelfServiceRecoveryFlow extends SelfServiceFlowCommon {
  expires_at: string;
  issued_at: string;

  /**
   * @see {@link https://github.com/ory/kratos/blob/master/selfservice/flow/recovery/state.go}
   */

  state: "choose_method" | "sent_email" | "passed_challenge";
  type?: "api" | "browser";
}

/**
 * @see {@link https://www.ory.sh/kratos/docs/reference/api#settingsflow}
 */
export interface SelfServiceSettingsFlow extends SelfServiceFlowCommon {
  expires_at: string;
  identity: Identity;
  issued_at: string;

  /**
   * @see {@link https://github.com/ory/kratos/blob/master/selfservice/flow/settings/state.go}
   */
  state: "show_form" | "success";
  type?: "api" | "browser";
}

export type SelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRegistrationFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow
  | SelfServiceSettingsFlow;

export type SelfServiceFlowType =
  | "login"
  | "registration"
  | "recovery"
  | "verification"
  | "settings";

export interface SelfServiceError {
  code?: number;
  debug?: string;
  details?: unknown;
  message: string;
  reason?: string;
  request?: string;
  status?: string;
}

export interface Session {
  active?: string;
  authenticated_at: string;
  expires_at: string;
  id: UUID;
  identity: Identity;
  issued_at: string;
}
