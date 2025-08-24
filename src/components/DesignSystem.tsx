import React from 'react';
import css from 'output/css.json' with {type: 'json'};

export interface DesignSystemProps {
  tokens: string[];
}

export const DesignSystem: React.FC<DesignSystemProps> = ({ tokens }: DesignSystemProps) => {
  return (
    <>
      {tokens.map((token: string) => <span>{token}</span>)}
    </>    
  );
}

const sortFn = (a:[string,string], b:[string,string]) => {
  if (a[0] < b[0]) return 1;
  if (a[0] > b[0]) return -1;
  return 0;
}

const groupVarByCategory = (colors: Array<[string, string]>) => {
  const grouped: any = {};

  for (const [name, value] of colors) {
    // Extract category: between "--color-" and the next "-"
    const match = name.match(/^--color-([^-\s]+)/);
    if (!match) continue;
    const category: string | undefined = match[1];
    if(!category) continue;
    if (!grouped[category]) {
      grouped[category] = {
        label: category,
        colors: []
      };
    }

    grouped[category].colors.push([name, value]);
  }

  return Object.values(grouped);
}

export const fn = () => {
  if(document) {
    // console.log("🚀 ~ document:", document)
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVars:Array<[string, string]> = [];

    for (let i = 0; i < rootStyles.length; i++) {
      const prop = rootStyles[i];
      if (prop?.startsWith('--')) {
        cssVars.push([prop, rootStyles.getPropertyValue(prop).trim()]);
      }
    }    
    // Clean --p-*
    const cssVarsTheme = cssVars.filter((cssVar) => !cssVar[0]?.startsWith('--p'))    

    // Sort --color-*
    const colorVars:Array<[string, string]> = cssVarsTheme.filter((cssVar) => cssVar[0]?.startsWith('--color'))
    colorVars.sort(sortFn)

    const groups = groupVarByCategory(colorVars)
    console.log("🚀 ~ groups:", groups)

    return groups
  }
  return []
}