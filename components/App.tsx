import React from "react";

import { AppWithContext } from "./AppWithContext";
import { ProjectsProvider } from "./context/projects";
import { UserProvider } from "./context/user";

import { MantineProvider } from "@mantine/core";

type Props = {};

export function App({}: Props) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
        primaryShade: 4,

        shadows: {
          md: "1px 1px 3px rgba(0, 0, 0, .25)",
          xl: "5px 5px 3px rgba(0, 0, 0, .25)",
        },

        headings: {
          fontFamily: "Roboto, sans-serif",
          sizes: {
            h1: { fontSize: 30 },
          },
        },
      }}
    >
      <UserProvider>
        <ProjectsProvider>
          <AppWithContext />
        </ProjectsProvider>
      </UserProvider>
    </MantineProvider>
  );
}
