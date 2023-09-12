import { join } from 'path'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration, addProjectConfiguration, generateFiles } from '@nx/devkit'

import { tsquery } from '@phenomnomnominal/tsquery'

import { handlerGenerator } from './generator';
import { HandlerGeneratorSchema } from './schema';

describe('handler generator', () => {
  let tree: Tree;
  const options: HandlerGeneratorSchema = { name: 'test', project: 'stack' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()

    addProjectConfiguration(tree, options.project, {
      root: `stacks/${options.project}`,
      projectType: 'application',
      sourceRoot: `stacks/${options.project}/src`,
      targets: {},
      tags: ['stacks']
    });

    generateFiles(tree, join(__dirname, '../stack/files'), `stacks/${options.project}`, { stack: options.project, handler: 'app' });
  });

  it('should run successfully', async () => {
    await handlerGenerator(tree, options);

    const config = readProjectConfiguration(tree, options.project);
    expect(config).toBeDefined();

    const serverlessConfig = tree.read(`stacks/${options.project}/serverless.ts`);
    const contents = serverlessConfig.toString()

    const nodes = tsquery.query(contents, `Identifier[name=${options.name}] ~ ObjectLiteralExpression`)
    expect(nodes.length).toEqual(1)

    expect(tree.exists(`stacks/${options.project}/src/${options.name}.handler.ts`))
    expect(tree.exists(`stacks/${options.project}/src/${options.name}.handler.spec.ts`))
  });
});
