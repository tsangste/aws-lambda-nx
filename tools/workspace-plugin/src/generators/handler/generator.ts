import {
  formatFiles,
  generateFiles,
  names,
  Tree
} from '@nx/devkit'
import * as path from 'path';
import { HandlerGeneratorSchema } from './schema';

export async function handlerGenerator(
  tree: Tree,
  options: HandlerGeneratorSchema
) {
  const projectRoot = `stacks/${options.project}`;
  const { fileName } = names(options.name);

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, { ...options, fileName });

  await formatFiles(tree);
}

export default handlerGenerator;
