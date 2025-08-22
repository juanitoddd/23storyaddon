import ts from 'typescript';
import _ from 'lodash';

import fs from 'fs/promises'
import type { ExportedDeclarations } from './Declarations';
import { serializeVariableStatement, serializeInterface } from './serialize';
import { isNodeExported } from './utils';
import * as csstree from 'css-tree';

export * from './Declarations';

function visit(node: ts.Node, checker: ts.TypeChecker): ExportedDeclarations {
  // Only consider exported nodes
  if (!isNodeExported(node)) {
    return {};
  }

  if (ts.isVariableStatement(node)) {
    // Eg: export const foo = 1;
    return serializeVariableStatement(node, checker);
  } else if (ts.isInterfaceDeclaration(node)) {
    // Eg: export interface Foo { bar: string }
    const interfaceSerialized = serializeInterface(node, checker);
    return {
      [interfaceSerialized.name]: interfaceSerialized
    };
  }
  return {};
}

export async function extractCSS(filesPath: string[], options?: ts.CompilerOptions) {
  // Don't need particular options
  options = options || {};
  let allTypes: any = {};
  const re = /([^/]+)\.types\.ts$/; // TODO
  const filesParsed: string[] = [];
  let allCss:any = {}
  for (const file of filesPath) {
    const name = file.match(re)?.[1]; // Component Name
    const content  = await fs.readFile(file, 'utf8')      
    const ast = csstree.parse(content.toString());
    const cssTree = csstree.toPlainObject(ast)      
    if (name) {        
        const safeName = _.upperFirst(_.camelCase(name))
        allCss[safeName] = { ...cssTree }
    }
  }
  return allCss;
}

export function extractTypes(filesPath: string[], options?: ts.CompilerOptions): ExportedDeclarations {
  // Don't need particular options
  options = options || {};

  const program: ts.Program = ts.createProgram(filesPath, options);
  const checker = program.getTypeChecker();
  let exportedDeclarations: ExportedDeclarations = {};
  let allTypes: any = {};
  const re = /([^/]+)\.types\.ts$/;
  const filesParsed: string[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      filesParsed.push(sourceFile.fileName);
      // eslint-disable-next-line no-loop-func
      let componentTypes: any = {};
      ts.forEachChild(sourceFile, (node: ts.Node) => {
        const declaration = visit(node, checker);        
        componentTypes = { ...componentTypes, ...declaration };        
      });
      const name = sourceFile.fileName.match(re)?.[1]; // Component Name
      if (name) {        
        const safeName = _.upperFirst(_.camelCase(name))
        allTypes[safeName] = { ...componentTypes }
      }
    }
  }
  
  if (filesParsed.length !== filesPath.length) {
    const filesNotParsed = filesPath.filter((file) => !filesParsed.includes(file));
    throw new Error(`Unable to find following files: ${filesNotParsed.join(', ')}`);
  }

  return allTypes;
}