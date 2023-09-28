import type { Serverless } from 'serverless/aws';
import { baseServerlessConfiguration } from '../../serverless.base';

export const serverlessConfig: Serverless = {
  ...baseServerlessConfiguration,
  service: 'hello-world',
  provider: {
    ...baseServerlessConfiguration.provider,
    apiGateway: {
      minimumCompressionSize: 1024,
    },
  },
  functions: {
    hello: {
      handler: 'src/app.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'user',
          },
        },
      ],
    }
  }
};

module.exports = serverlessConfig
