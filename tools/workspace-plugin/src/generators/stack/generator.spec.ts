import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit'

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
  });
});
