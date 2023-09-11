import {
  formatFiles,
  generateFiles,
  names,
  Tree
} from '@nx/devkit'
import { join } from 'path';
import { HandlerGeneratorSchema } from './schema';

export async function handlerGenerator(
  tree: Tree,
  options: HandlerGeneratorSchema
) {
  const projectRoot = `stacks/${options.project}`;
  const { fileName } = names(options.name);

  generateFiles(tree, join(__dirname, '../shared-files/handle'), projectRoot, { ...options, fileName });

  await formatFiles(tree);
}

export default handlerGenerator;
