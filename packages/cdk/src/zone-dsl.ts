import type { Duration } from "aws-cdk-lib";

/**
 * Sentinel name representing the zone apex (the zone-file `@`).
 *
 * Translated to an undefined CDK `recordName` when bound to a CDK
 * construct.
 */
export const APEX = "@";

/**
 * Per-record options applied to the underlying CDK construct.
 *
 * Mirrors the optional fields shared by every Route 53 record builder. Each
 * record-type DSL helper accepts these as a trailing options argument.
 */
export interface RecordOptions {
  /** TTL for the record set. Falls back to the underlying builder's default. */
  readonly ttl?: Duration;
  /** Optional comment passed through to the CDK construct. */
  readonly comment?: string;
}

export interface ARecordSpec extends RecordOptions {
  readonly type: "A";
  readonly name: string;
  readonly addresses: readonly string[];
}

export interface AaaaRecordSpec extends RecordOptions {
  readonly type: "AAAA";
  readonly name: string;
  readonly addresses: readonly string[];
}

export interface CnameRecordSpec extends RecordOptions {
  readonly type: "CNAME";
  readonly name: string;
  readonly target: string;
}

export interface TxtRecordSpec extends RecordOptions {
  readonly type: "TXT";
  readonly name: string;
  readonly values: readonly string[];
}

export interface MxRecordSpec extends RecordOptions {
  readonly type: "MX";
  readonly name: string;
  readonly values: readonly { readonly priority: number; readonly hostName: string }[];
}

export type RecordSpec =
  | ARecordSpec
  | AaaaRecordSpec
  | CnameRecordSpec
  | TxtRecordSpec
  | MxRecordSpec;

/** Record type discriminators surfaced by {@link RecordSpec}. */
export type RecordType = RecordSpec["type"];

const toArray = <T>(x: T | readonly T[]): readonly T[] =>
  Array.isArray(x) ? (x as readonly T[]) : [x as T];

/**
 * IPv4 address record. Use {@link APEX} (`"@"`) as `name` for the zone apex.
 *
 * Multiple `A` calls for the same `name` are merged into a single CDK record
 * set with all addresses; alternatively, pass an array as the second argument.
 *
 * @example
 * ```ts
 * A("@",  "1.2.3.4")
 * A("ha", ["1.2.3.4", "5.6.7.8"])
 * A("www", "1.2.3.4", { ttl: Duration.minutes(10) })
 * ```
 */
export function A(
  name: string,
  address: string | readonly string[],
  options: RecordOptions = {},
): ARecordSpec {
  return { type: "A", name, addresses: toArray(address), ...options };
}

/**
 * IPv6 address record. See {@link A} for the merging / array semantics — they
 * are identical.
 */
export function AAAA(
  name: string,
  address: string | readonly string[],
  options: RecordOptions = {},
): AaaaRecordSpec {
  return { type: "AAAA", name, addresses: toArray(address), ...options };
}

/**
 * Canonical-name record. DNS forbids more than one CNAME per name, so a second
 * `CNAME(name, …)` for the same name is a configuration error and is rejected
 * when the records are bound to the zone.
 *
 * Targets containing dots should be fully qualified (trailing `.`).
 *
 * @example
 * ```ts
 * CNAME("dkim1", "dkim1.39769.dkim.example.")
 * ```
 */
export function CNAME(name: string, target: string, options: RecordOptions = {}): CnameRecordSpec {
  return { type: "CNAME", name, target, ...options };
}

/**
 * Text record. Pass a single string or an array of strings; multiple `TXT`
 * calls for the same `name` are merged into one CDK record set.
 *
 * @example
 * ```ts
 * TXT("@",      "v=spf1 mx -all")
 * TXT("_dmarc", "v=DMARC1; p=none;")
 * TXT("multi",  ["one", "two"])
 * ```
 */
export function TXT(
  name: string,
  value: string | readonly string[],
  options: RecordOptions = {},
): TxtRecordSpec {
  return { type: "TXT", name, values: toArray(value), ...options };
}

/**
 * Mail-exchanger record. The argument order matches BIND zone files
 * (`name priority target`); multiple `MX(name, …)` calls for the same name are
 * merged into one CDK record set with all `(priority, hostName)` pairs.
 *
 * Targets containing dots should be fully qualified (trailing `.`).
 *
 * @example
 * ```ts
 * MX("@", 10, "mail.example.com.")
 * MX("@", 20, "backup.example.com.")
 * ```
 */
export function MX(
  name: string,
  priority: number,
  hostName: string,
  options: RecordOptions = {},
): MxRecordSpec {
  return { type: "MX", name, values: [{ priority, hostName }], ...options };
}
