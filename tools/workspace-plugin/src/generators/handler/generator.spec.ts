import { join } from 'path'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, addProjectConfiguration, generateFiles } from '@nx/devkit'

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

    const serverlessConfig = tree.read(`stacks/${options.project}/serverless.ts`);
    const contents = serverlessConfig.toString()

    const nodes = tsquery.query(contents, `PropertyAssignment:has(Identifier[name=functions]) StringLiteral`)
    expect(nodes).toHaveLength(2)

    expect(tree.exists(`stacks/${options.project}/src/${options.name}.handler.ts`)).toBeTruthy()
    expect(tree.exists(`stacks/${options.project}/src/${options.name}.handler.spec.ts`)).toBeTruthy()
  });
});
