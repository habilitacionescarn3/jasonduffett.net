import { Stack, type StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";

export interface SiteStackProps extends StackProps {
  readonly domainName: string;
}

export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    // TODO: hosted zone, ACM cert, S3 bucket, CloudFront distribution,
    // and Route53 alias records for `props.domainName`.
    void props.domainName;
  }
}
