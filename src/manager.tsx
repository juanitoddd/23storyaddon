import React from "react";
import { addons, types } from "storybook/manager-api";

import { ADDON_ID, PANEL_ID, TAB_ID, TOOL_ID } from "./constants";
import { Panel } from "./components/Panel";
import { Tool } from "./components/Tool";
import { Tab } from "./components/Tab";

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Register a tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Design Tool",
    match: ({ viewMode, tabId }) => !!((viewMode && viewMode.match(/^(story)$/)) || tabId === TAB_ID),    
    render: () => <Tool api={api} />,
  });

  // Register a panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Design System",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => <Panel active={!!active} api={api} />,
  });

  // Register a tab
  addons.add(TAB_ID, {
    type: types.TAB,
    title: "Types",
    match: ({ path }) => !!(path.match(/story/)),
    render: ({ active }) => <Tab active={!!active} api={api} />,
  });
});
