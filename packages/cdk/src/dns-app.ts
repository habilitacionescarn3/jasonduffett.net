import { App, Fn, type Stack } from "aws-cdk-lib";
import { compose, ref } from "@composurecdk/core";
import { createStackBuilder, outputs } from "@composurecdk/cloudformation";
import { createHostedZoneBuilder, type HostedZoneBuilderResult } from "@composurecdk/route53";
import { A, CNAME, MX, TXT } from "./zone-dsl.js";
import { zoneRecords } from "./zone-records.js";

/**
 * Defines DNS for jasonduffett.net as a single-stack composed system: a
 * Route 53 public hosted zone plus every record in the zone file below, with
 * the registrar-facing name servers surfaced as a CloudFormation output.
 */
export function createDnsApp(app: App = new App()): { stack: Stack } {
  const { stack } = createStackBuilder()
    .description("DNS for jasonduffett.net")
    .env({
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    })
    .build(app, "JasonduffettNet");

  compose(
    {
      zone: createHostedZoneBuilder().zoneName("jasonduffett.net"),
      records: zoneRecords([
        // Apex + service A records
        A("@", "88.208.252.9"),
        A("www", "88.208.252.9"),
        A("mail", "213.171.216.40"),
        A("webmail", "213.171.216.231"),
        A("smtp", "213.171.216.50"),
        A("exchange", "213.171.192.50"),
        A("mailserver", "213.171.216.40"),
        A("mcp", "213.171.195.10"),

        // Mail server (MX)
        MX("@", 10, "mailserver.livemail.co.uk."),

        // Livemail DKIM (CNAME)
        CNAME("livemail1._domainkey", "livemail1._domainkey.39769.dkim.livemail.co.uk."),
        CNAME("livemail2._domainkey", "livemail2._domainkey.39769.dkim.livemail.co.uk."),
        CNAME("livemail3._domainkey", "livemail3._domainkey.39769.dkim.livemail.co.uk."),
        CNAME("livemail4._domainkey", "livemail4._domainkey.39769.dkim.livemail.co.uk."),

        // Mail policy + verification (TXT)
        TXT("@", "MS=ms66482160"),
        TXT("@", "v=spf1 mx a include:_spf.livemail.co.uk ~all"),
        TXT("_dmarc", "v=DMARC1; p=none;"),
        TXT("dzc.nuget", "K2G6Wa8y"),
      ]).zone(ref<HostedZoneBuilderResult>("zone").get("hostedZone")),
    },
    { zone: [], records: ["zone"] },
  )
    .afterBuild(
      outputs({
        NameServers: {
          value: ref("zone", (r: HostedZoneBuilderResult) =>
            Fn.join(",", r.hostedZone.hostedZoneNameServers ?? []),
          ),
          description: "Set these as the NS records at the domain registrar to delegate the zone.",
        },
      }),
    )
    .build(stack, "DNS");

  return { stack };
}
