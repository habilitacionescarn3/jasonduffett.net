import { describe, it, expect } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import { createDnsApp } from "../src/dns-app.js";

function synthTemplate(): Template {
  const { stack } = createDnsApp();
  return Template.fromStack(stack);
}

describe("dns-app", () => {
  describe("resource counts", () => {
    it("creates exactly one hosted zone", () => {
      synthTemplate().resourceCountIs("AWS::Route53::HostedZone", 1);
    });

    it("creates 16 record sets (8 A, 4 CNAME, 3 TXT, 1 MX)", () => {
      synthTemplate().resourceCountIs("AWS::Route53::RecordSet", 16);
    });
  });

  describe("hosted zone", () => {
    it("uses the jasonduffett.net domain", () => {
      synthTemplate().hasResourceProperties("AWS::Route53::HostedZone", {
        Name: "jasonduffett.net.",
      });
    });
  });

  describe("A records", () => {
    it.each([
      ["jasonduffett.net.", "88.208.252.9"],
      ["www.jasonduffett.net.", "88.208.252.9"],
      ["mail.jasonduffett.net.", "213.171.216.40"],
      ["webmail.jasonduffett.net.", "213.171.216.231"],
      ["smtp.jasonduffett.net.", "213.171.216.50"],
      ["exchange.jasonduffett.net.", "213.171.192.50"],
      ["mailserver.jasonduffett.net.", "213.171.216.40"],
      ["mcp.jasonduffett.net.", "213.171.195.10"],
    ])("%s → %s", (name, ip) => {
      synthTemplate().hasResourceProperties("AWS::Route53::RecordSet", {
        Type: "A",
        Name: name,
        ResourceRecords: [ip],
      });
    });
  });

  describe("CNAME records (Livemail DKIM)", () => {
    it.each([1, 2, 3, 4])("livemail%d._domainkey points to its DKIM target", (n) => {
      synthTemplate().hasResourceProperties("AWS::Route53::RecordSet", {
        Type: "CNAME",
        Name: `livemail${String(n)}._domainkey.jasonduffett.net.`,
        ResourceRecords: [`livemail${String(n)}._domainkey.39769.dkim.livemail.co.uk.`],
      });
    });
  });

  describe("TXT records", () => {
    it("apex TXT carries both the MS verification token and SPF policy", () => {
      synthTemplate().hasResourceProperties("AWS::Route53::RecordSet", {
        Type: "TXT",
        Name: "jasonduffett.net.",
        ResourceRecords: ['"MS=ms66482160"', '"v=spf1 mx a include:_spf.livemail.co.uk ~all"'],
      });
    });

    it("_dmarc TXT publishes a monitor-only DMARC policy", () => {
      synthTemplate().hasResourceProperties("AWS::Route53::RecordSet", {
        Type: "TXT",
        Name: "_dmarc.jasonduffett.net.",
        ResourceRecords: ['"v=DMARC1; p=none;"'],
      });
    });

    it("dzc.nuget TXT carries the NuGet domain-association token", () => {
      synthTemplate().hasResourceProperties("AWS::Route53::RecordSet", {
        Type: "TXT",
        Name: "dzc.nuget.jasonduffett.net.",
        ResourceRecords: ['"K2G6Wa8y"'],
      });
    });
  });

  describe("MX record", () => {
    it("apex MX routes mail to mailserver.livemail.co.uk with priority 10", () => {
      synthTemplate().hasResourceProperties("AWS::Route53::RecordSet", {
        Type: "MX",
        Name: "jasonduffett.net.",
        ResourceRecords: ["10 mailserver.livemail.co.uk."],
      });
    });
  });

  describe("outputs", () => {
    it("exports the hosted zone NameServers for registrar delegation", () => {
      synthTemplate().hasOutput("NameServers", {
        Description: "Set these as the NS records at the domain registrar to delegate the zone.",
      });
    });
  });

  describe("template", () => {
    it("matches the expected synthesised template", () => {
      expect(synthTemplate().toJSON()).toMatchSnapshot();
    });
  });
});
