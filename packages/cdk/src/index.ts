import { App } from "aws-cdk-lib";
import { createDnsApp } from "./dns-app.js";

const app = new App();
createDnsApp(app);
app.synth();
