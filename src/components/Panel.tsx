import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import { Result } from "src/types";
import { AddonPanel } from "storybook/internal/components";
import { Button, Placeholder, TabsState } from "storybook/internal/components";
import { useChannel, type API  } from "storybook/manager-api";
import { styled, useTheme } from "storybook/theming";

import allTypes from 'output/types.json' with {type: 'json'};

import { EVENTS } from "../constants";
import { List } from "./List";

const extractCssVars = (document: Element) => {
  // Get all CSS variables applied to :root
  const rootStyles = getComputedStyle(document);
  const cssVars = [];

  for (let i = 0; i < rootStyles.length; i++) {
    const prop = rootStyles[i];
    if (prop?.startsWith('--')) {
      cssVars.push([prop, rootStyles.getPropertyValue(prop).trim()]);
    }
  }  
  return cssVars
}

const PanelWrapper = styled.div({  
  padding: "10px",  
  boxSizing: "border-box",
});

interface PanelProps {
  active: boolean;
  api: API
}

export const RequestDataButton = styled(Button)({
  marginTop: "1rem",
});

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
    
  const story = props.api.getCurrentStoryData()
  useEffect(() => {    
    const iframe = document.querySelector('#storybook-preview-iframe')
    const iframeDocument = (iframe as HTMLIFrameElement).contentDocument?.documentElement
    if(iframeDocument) {
      const rootStyles = getComputedStyle(iframeDocument);
      const cssVars = [];
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop?.startsWith('--')) {
          cssVars.push([prop, rootStyles.getPropertyValue(prop).trim()]);
        }
      }
      console.log("🚀 ~ cssVars:", cssVars)
    }

  }, [story.id]);

  const theme = useTheme();

  // https://storybook.js.org/docs/react/addons/addons-api#useaddonstate
  const [{ divs, styled }, setState] = useState<Result>({
    divs: [],
    styled: [],
  });

  // https://storybook.js.org/docs/react/addons/addons-api#usechannel
  const emit = useChannel({
    [EVENTS.RESULT]: (newResults) => {
      setState(newResults);
    },
  });

  const fetchData = useCallback(() => {
    emit(EVENTS.REQUEST);
  }, [emit]);

  return (
    <AddonPanel {...props}>
      <PanelWrapper>        
        {/*
          <InterfaceDoc doc={doc.Director} />        
        */}
      </PanelWrapper>
    </AddonPanel>
  );
});
