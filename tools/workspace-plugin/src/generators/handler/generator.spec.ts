import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration, addProjectConfiguration, generateFiles } from '@nx/devkit'

import { handlerGenerator } from './generator';
import { HandlerGeneratorSchema } from './schema';
import { join } from 'path'

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
    const config = readProjectConfiguration(tree, 'stack');
    expect(config).toBeDefined();
  });
});
