import type { Serverless, Provider } from 'serverless/aws';

export const baseServerlessConfigProvider: Provider = {
  name: 'aws',
  runtime: 'nodejs18.x',
  memorySize: 128,
  stage: 'dev',
  environment: {
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
  },
  region: 'eu-west-1',
};

export const baseServerlessConfiguration: Serverless = {
  frameworkVersion: '3',
  service: 'base',
  package: {
    individually: true,
    excludeDevDependencies: true,
  },
  plugins: ['serverless-esbuild', 'serverless-offline'],
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      target: ['es2022'],
      sourcemap: true,
      sourcesContent: false,
      define: { 'require.resolve': undefined },
    },
  },
  provider: {
    ...baseServerlessConfigProvider,
  },
};
