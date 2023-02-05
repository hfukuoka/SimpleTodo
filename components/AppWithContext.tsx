import React, { useContext, useState } from "react";

import { UserContext } from "./context/user";
import type { TaskGroup } from "./Model";
import { Inbox } from "./Model";
import { Mainbar } from "./Mainbar";
import { Sidebar } from "./Sidebar";
import { AppShell, MediaQuery, useMantineTheme } from "@mantine/core";

type Props = {};

export const AppWithContext: React.FC<Props> = () => {
  const user = useContext(UserContext);
  const [focusedTaskGroup, setFocusedTaskGroup] = useState<TaskGroup>(Inbox);
  const theme = useMantineTheme();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbar={
        <Sidebar current={focusedTaskGroup} switcher={setFocusedTaskGroup} />
      }
    >
      {user && <Mainbar taskGroup={focusedTaskGroup} />}
      {/* <>test</> */}
    </AppShell>
  );
};
export default AppWithContext;
