import { useEffect, useState } from "react";
import "./App.css";
import { GetClipData, CopyItemContent } from "../wailsjs/go/main/App";

import { EventsOn } from "../wailsjs/runtime/runtime";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Text,
  Stack,
  Box,
  Button,
  StackDivider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Kbd,
  IconButton,
  Flex, 
  Spacer
} from "@chakra-ui/react";

import { SettingsIcon, CopyIcon } from "@chakra-ui/icons";

function App() {
  const [filterValue, setFilterValue] = useState("");

  const [clipList, setClipList] = useState([]);
  const updateClipList = (result: any) => {
    const res = JSON.parse(result);
    // console.log(res);
    setClipList(res);
  };

  const [currentTime, setCurrentTime] = useState<string | null>(null);

  function globalHotkeyEventHandler(time: string) {
    setCurrentTime(time);
    const win: any = window;
    win.runtime.WindowShow();
  }

  const handleFilterChange = (filterValue: any) =>
    window.setTimeout(() => setFilterValue(filterValue), 10);

  useEffect(() => {
    EventsOn("Backend:GlobalHotkeyEvent", globalHotkeyEventHandler);
    clipData();
  }, []);

  function clipData() {
    GetClipData("none").then(updateClipList);
    const onCopyEvent = (message: any) => {
      console.log("onCopyEvent.message ", message);
      GetClipData("none").then(updateClipList);
    };
    const win: any = window;
    win.runtime.EventsOn("copyEvent", onCopyEvent);
  }

  function copyItem(e: Event, itemContent: string) {
    e.preventDefault();
    console.log("copyItem...");
    CopyItemContent(itemContent);
    const win: any = window;
    win.runtime.WindowHide();
    return false;
  }

  function clearStr(str: string) {
    if (str) {
      str = str.trim();
      return str.slice(0, 40) + "...";
    }
    return str;
  }

  return (
    <div id="App">
      <Card>
        <CardHeader>
        <Flex>
          <Input className="search-input" placeholder="search" size="sm" />
          <Menu>
            <MenuButton
               size='sm'
              as={IconButton}
              aria-label="Settings"
              icon={<SettingsIcon />}
              style={{marginLeft: "5px"}}
              variant="outline"
            />
            <MenuList>
              <MenuItem>Clear</MenuItem>
              <MenuItem>Preference</MenuItem>
              <MenuItem>About</MenuItem>
              <MenuItem>Quit</MenuItem>
            </MenuList>
          </Menu>
          </Flex>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="2">
            {clipList.map((itm: any) => (
              <Box>
                <Flex>
                  <Text pt="2" fontSize="sm" flex='1' style={{textAlign: "left"}}>
                    {" "}
                    {clearStr(itm.content)}{" "}
                  </Text>

                  <Kbd> ctrl + 1</Kbd>
                  <IconButton
                    colorScheme="teal"
                    variant="ghost"
                    aria-label="Copy"
                    size="sm"
                    icon={<CopyIcon />}
                    onClick={(e: any) => copyItem(e, itm.content)}
                  >
                    Copy
                  </IconButton>

                  
                </Flex>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}

export default App;
