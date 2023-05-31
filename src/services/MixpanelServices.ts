import mixpanel from "mixpanel-browser";
import { Node } from "reactflow";
const PROJECT_TOKEN = "e89f03371825eaccda13079d584bff8e";

export const sendFrontEndLoadsToMix = () => {
  try {
    mixpanel.init(PROJECT_TOKEN, {
      debug: true,
      loaded: function () {
        mixpanel.track("Flojoy Loaded");
      },
    });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
//for frontier, go to LOADER.py
export const sendProgramToMix = (nodes: Node[], runProgram = false) => {
  if (nodes) {
    const nodeList = JSON.stringify(nodes.map((node) => node.data.label));
    sendMultipleDataEventToMix(
      "Program Saved",
      [nodeList, "disk"],
      ["nodeList", "savedTo"]
    );
    if (runProgram) {
      sendEventToMix("Program Run", nodeList, "nodeList");
    }
  }
};

export const sendEventToMix = (
  Event: string,
  data: string,
  dataType = "data"
) => {
  try {
    mixpanel.track(Event, { [dataType]: data });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

//@pre-condition: the input array of data and dataType must be the same size
export const sendMultipleDataEventToMix = (
  Event: string,
  data: string[],
  dataType = ["data"]
) => {
  try {
    const obj = {};
    for (let i = 0; i < data.length; i++) {
      obj[dataType[i]] = data[i];
    }
    mixpanel.track(Event, obj);
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
