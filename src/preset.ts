
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import { extractCSS, extractTypes } from './extractor/extractor';

// You can use presets to augment the Storybook configuration
// You rarely want to do this in addons,
// so often you want to delete this file and remove the reference to it in package.json#exports and package.json#bunder.nodeEntries
// Read more about presets at https://storybook.js.org/docs/addons/writing-presets

export const viteFinal = async (config: any) => {
  console.log("This addon is augmenting the Vite config");
  return config;
};

export const webpack = async (config: any) => {
  console.log("This addon is augmenting the Webpack config");
  return config;
};

export const managerEntries = async (entry = [], options: any) => {
  if (options.patternTypes == null) {
    throw new Error('patternTypes is required as an option');
  }
  if (options.patternCss == null) {
    throw new Error('patternCss is required as an option');
  }
  const filesTypes = glob.sync(options.patternTypes, { ignore: ['*.d.ts', '**/node_modules/**'] });
  const types = extractTypes(filesTypes, options.compilerOptions);
  const outputDir = path.join(__dirname, '..', '/output')
    
  const filesCss = glob.sync(options.patternCss, { ignore: ['*.d.ts', '**/node_modules/**'] });  
  const css = await extractCSS(filesCss, options.compilerOptions);  
  // console.log("🚀 ~ css:", css)

  // console.log("🚀 ~ patternComponents:", options.patternComponents)
  // const filesComponents = glob.sync(options.patternComponents, { ignore: ['*.d.ts', '**/node_modules/**'] });
  // console.log("🚀 ~ filesComponents:", filesComponents)
  
  fs.ensureDirSync(outputDir);
  fs.writeJsonSync(path.join(outputDir, 'types.json'), types);  
  fs.writeJsonSync(path.join(outputDir, 'css.json'), css);

  return entry;
  // return [...entry, require.resolve('path-to-third-party-addon')];
};