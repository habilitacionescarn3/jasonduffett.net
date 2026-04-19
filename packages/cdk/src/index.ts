import { App } from "aws-cdk-lib";
import { SiteStack } from "./site-stack.js";

const app = new App();

new SiteStack(app, "JasonduffettNetSite", {
  domainName: "jasonduffett.net",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
