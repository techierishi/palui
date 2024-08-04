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
  StackDivider
} from "@chakra-ui/react";

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
      console.log("onCopyEvent.message ", message)
      GetClipData("none").then(updateClipList);
    };
    const win:any = window
    win.runtime.EventsOn('importEvent', onCopyEvent);
  }

  function copyItem(e: Event, itemContent: string) {
    e.preventDefault();
    console.log("copyItem...");
    CopyItemContent(itemContent);
    return false;
  }

  return (
    <div id="App">
      <Card>
        <CardHeader>
          <Input className="search-input" placeholder="search" size="sm" />
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="2">


              {clipList.map((itm: any) => (
                <Box>
                  <div className="list-card">
                  <Text pt="2" fontSize="sm"> {itm.content.slice(0, 40) + "..."} </Text>

                    <Button
                      colorScheme="teal"
                      variant="ghost"
                      size='sm'
                      onClick={(e: any) => copyItem(e, itm.content)}
                    >
                      Copy
                    </Button>
                  </div>
                </Box>
              ))}
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}

export default App;
