import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  Tree,
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
    targets: {
      build: {
        executor: 'nx:run-commands',
        options: {
          cwd: projectRoot,
          color: true,
          command: 'sls package',
        },
      },
      deploy: {
        executor: 'nx:run-commands',
        options: {
          cwd: projectRoot,
          color: true,
          command: 'sls deploy --verbose',
        },
        dependsOn: [
          {
            target: 'deploy',
            projects: 'dependencies',
          },
        ],
      },
      lint: {
        executor: '@nx/eslint:eslint',
        options: {
          lintFilePatterns: [`${projectRoot}/**/*.ts`],
        },
      },
      remove: {
        executor: 'nx:run-commands',
        options: {
          cwd: projectRoot,
          color: true,
          command: 'sls remove',
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          cwd: projectRoot,
          color: true,
          command: 'sls offline start',
        },
      },
      test: {
        executor: '@nx/jest:jest',
        outputs: [`coverage/${projectRoot}`],
        options: {
          jestConfig: `${projectRoot}/jest.config.ts`,
          passWithNoTests: true,
        },
      },
    },
    tags: ['stacks'],
  });

  generateFiles(tree, join(__dirname, 'files'), projectRoot, { ...options });
  generateFiles(tree, join(__dirname, '../shared-files/handle'), projectRoot, {
    name: options.handler,
    fileName,
  });

  await formatFiles(tree);
}

export default StackGenerator;
