import {
  formatFiles,
  generateFiles,
  names,
  Tree
} from '@nx/devkit'
import { join } from 'path';
import { print, tsquery } from '@phenomnomnominal/tsquery';
import { HandlerGeneratorSchema } from './schema';
import { factory } from 'typescript'

export async function handlerGenerator(
  tree: Tree,
  options: HandlerGeneratorSchema
) {
  const projectRoot = `stacks/${options.project}`;
  const { fileName } = names(options.name);

  generateFiles(tree, join(__dirname, '../shared-files/handle'), projectRoot, { ...options, fileName });

  const serverlessConfig = join(projectRoot, 'serverless.ts');
  const newContent = tsquery.replace(tree.read(serverlessConfig).toString(), 'PropertyAssignment:has(Identifier[name=functions]) ObjectLiteralExpression', node => {
    const propAst = factory.createPropertyAssignment(
      factory.createStringLiteral(options.name),
      factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment('handler', factory.createStringLiteral(`src/${options.name}.handler.main`))
        ],
        true
      ),
    );

    // Rebuild the object literal to push our key/value into it
    // content will replace inside the brackets of our object literal
    // e.g. { foo: bar, baz: qux, }
    // then content = foo: bar, baz: qux,
    // So by stripping the braces, and injecting our new code, and adding back
    // the braces, we get the fully formed new object literal.
    // Kinda hacky as we move into stringy stuff, but it works for what we need
    const content = node.getChildren()[1];

    const fullText = content.getFullText()
    return fullText.includes('{') ? `{${fullText}${print(propAst)}}` : node.getFullText();
  });
  tree.write(serverlessConfig, newContent);

  await formatFiles(tree);
}

export default handlerGenerator;
