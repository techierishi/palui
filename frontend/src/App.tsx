import { useEffect, useState } from "react";
import "./App.css";
import { GetClipData, CopyItemContent } from "../wailsjs/go/main/App";

import { EventsOn } from "../wailsjs/runtime/runtime";
import { Button, Card, CardList } from "@blueprintjs/core";
import { InputGroup } from "@blueprintjs/core";
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
    setInterval(() => {
      GetClipData("none").then(updateClipList);
    }, 1000);
  }

  function copyItem(e: Event, itemContent: string) {
      e.preventDefault()
      console.log("copyItem...")  
      CopyItemContent(itemContent);
      return false
  }

  return (
    <div id="App">
      <div className="bp5-input-group {{.modifier}}">
        <span className="bp5-icon bp5-icon-search"></span>
        <input type="text" className="bp5-input" placeholder="Search" />
      </div>
      <CardList compact={true}>
        {clipList.map((itm: any) => (
          <Card>
            <div className="list-card">
              <span> {itm.content.slice(0, 40) + "..."} </span>
              <Button minimal={true} intent="primary" onClick={(e:Event) => copyItem(e, itm.content)}>Copy</Button>
            </div>
          </Card>
        ))}
      </CardList>
    </div>
  );
}

export default App;
