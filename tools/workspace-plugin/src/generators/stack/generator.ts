import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  Tree
} from '@nx/devkit';
import { join } from 'path';
import { StackGeneratorSchema } from './schema';

export async function StackGenerator(
  tree: Tree,
  options: StackGeneratorSchema
) {
  const projectRoot = `stacks/${options.stack}`;
  const { fileName } = names(options.handler);

  addProjectConfiguration(tree, options.stack, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });

  generateFiles(tree, join(__dirname, 'files'), projectRoot, {...options, fileName});

  await formatFiles(tree);
}

export default StackGenerator;
