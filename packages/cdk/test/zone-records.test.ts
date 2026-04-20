import { App, Stack } from "aws-cdk-lib";
import { describe, expect, it } from "vitest";
import { compose, ref } from "@composurecdk/core";
import { createHostedZoneBuilder, type HostedZoneBuilderResult } from "@composurecdk/route53";
import { CNAME } from "../src/zone-dsl.js";
import { zoneRecords } from "../src/zone-records.js";
import type { RecordSpec } from "../src/zone-dsl.js";

function buildZone(records: readonly RecordSpec[]): void {
  const app = new App();
  const stack = new Stack(app, "TestStack");
  compose(
    {
      zone: createHostedZoneBuilder().zoneName("example.com"),
      records: zoneRecords(records).zone(ref<HostedZoneBuilderResult>("zone").get("hostedZone")),
    },
    { zone: [], records: ["zone"] },
  ).build(stack, "DNS");
}

describe("zoneRecords — CNAME guards", () => {
  it("rejects CNAME at the zone apex", () => {
    expect(() => {
      buildZone([CNAME("@", "target.example.com.")]);
    }).toThrow(/CNAME records cannot live at the zone apex/);
  });

  it("rejects multiple CNAMEs for the same name", () => {
    expect(() => {
      buildZone([CNAME("alias", "one.example.com."), CNAME("alias", "two.example.com.")]);
    }).toThrow(/DNS allows at most one CNAME per name/);
  });
});
