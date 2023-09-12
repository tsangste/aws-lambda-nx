import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit'

import { tsquery } from '@phenomnomnominal/tsquery'

import { StackGenerator } from './generator';
import { StackGeneratorSchema } from './schema';

describe('stack generator', () => {
  let tree: Tree;
  const options: StackGeneratorSchema = { stack: 'stack', handler: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await StackGenerator(tree, options);

    const config = readProjectConfiguration(tree, 'stack');
    expect(config).toBeDefined();

    expect(tree.exists(`stacks/${options.stack}/.eslintrc.json`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/jest.config.ts`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/serverless.ts`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/tsconfig.app.json`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/tsconfig.json`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/tsconfig.spec.json`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/src/${options.handler}.handler.ts`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.stack}/src/${options.handler}.handler.spec.ts`)).toBeTruthy()

    const serverlessConfig = tree.read(`stacks/${options.stack}/serverless.ts`);
    const contents = serverlessConfig.toString()

    const nodes = tsquery.query(contents, `Identifier[name=${options.handler}] ~ ObjectLiteralExpression`)
    expect(nodes).toHaveLength(1)
  });
});
