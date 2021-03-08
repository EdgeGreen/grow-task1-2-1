import { Construct, NestedStack, NestedStackProps } from '@aws-cdk/core';

interface BaseNestedStackProps extends NestedStackProps {

  }

export class BaseNestedStack extends NestedStack {
    constructor(scope: Construct, id: string, props?: BaseNestedStackProps) {
      super(scope, id, props);

    }
}          