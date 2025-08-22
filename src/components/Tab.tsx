import React, { useCallback, useEffect, useRef } from "react";
import { Code, H1, IconButton, Link } from "storybook/internal/components";
import { useGlobals, useParameter, type API  } from "storybook/manager-api";
import { styled } from "storybook/theming";
import _ from 'lodash';

import { KEY } from "../constants";

import allTypes from 'output/types.json' with {type: 'json'};
import InterfaceDoc from "./InterfaceDoc";

interface TabProps {
  active: boolean;
  api: API
}

const TabWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: "20px",
  minHeight: "100vh",
  boxSizing: "border-box",
}));

const TabInner = styled.div({
  maxWidth: 768,
  marginLeft: "auto",
  marginRight: "auto",
});

export const Tab: React.FC<TabProps> = ({ active, api }) => {  
  const storyData = api.getCurrentStoryData()
  const path = storyData.importPath;
  const isDocs = path.endsWith('.mdx') || path.endsWith('.md')  
  if (!active || isDocs) {
    return null;
  }

  const myRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrapper = (myRef.current as HTMLElement).parentElement;
    if(wrapper) wrapper.style.display = 'block';
  }, []);
    
  const typesJson: any = allTypes  
  console.log("🚀 ~ typesJson:", typesJson)
  const re = /([^/]+)\.stories\.ts$/;
  const name = storyData.importPath.match(re)?.[1]; // Component Name
  let types: any = {}
  let safeName: string = ''
  if (name) {        
    safeName = _.upperFirst(_.camelCase(name))    
    types = typesJson[safeName]    
  }
  // https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const config = useParameter<string>(
    KEY,
    "fallback value of config from parameter",
  );

  // https://storybook.js.org/docs/addons/addons-api#useglobals
  const [globals, updateGlobals] = useGlobals();
  const value = globals[KEY];

  const update = useCallback((newValue: typeof value) => {
    updateGlobals({
      [KEY]: newValue,
    });
  }, []);  

  return (
    <TabWrapper ref={myRef}>
      <TabInner>
        <H1>{safeName}</H1>
        {Object.keys(types).map((type:string) => <InterfaceDoc doc={types[type]} /> )}
      </TabInner>
    </TabWrapper>
  );
};
