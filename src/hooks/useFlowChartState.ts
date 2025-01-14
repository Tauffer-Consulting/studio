import { ElementsData } from "flojoy/types";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";

export type CtrlManifestParam = ElementsData["ctrls"][""] & {
  nodeId: string;
  id: string;
};
export interface PlotManifestParam {
  node: string;
  plot?: PlotType;
  input?: string;
  output?: string;
}

interface PlotType {
  type: string;
  mode: string;
}

export interface CtlManifestType {
  type: string;
  name: string;
  id: string;
  param?: PlotManifestParam | CtrlManifestParam | string;
  val?: string | number | boolean;
  hidden?: boolean;
  segmentColor?: string;
  controlGroup?: string;
  label?: string;
  minHeight: number;
  minWidth: number;
  layout: ReactGridLayout.Layout;
}

export const failedNodeAtom = atom<string>("");
export const runningNodeAtom = atom<string>("");
export const nodeStatusAtom = atom((get) => ({
  runningNode: get(runningNodeAtom),
  failedNode: get(failedNodeAtom),
}));

const showLogsAtom = atomWithImmer<boolean>(false);
const rfInstanceAtom = atomWithImmer<
  ReactFlowJsonObject<ElementsData> | undefined
>(undefined);
const editModeAtom = atomWithImmer<boolean>(false);
const expandModeAtom = atomWithImmer<boolean>(false);
const apiKeyAtom = atomWithImmer<string>("");
const s3NameAtom = atomWithImmer<string>("");
const s3AccessKeyAtom = atomWithImmer<string>("");
const s3SecretKeyAtom = atomWithImmer<string>("");
const s3ContainerAtom = atomWithImmer<boolean>(false);
const isSidebarOpenAtom = atom<boolean>(false);
const nodeParamChangedAtom = atom<boolean | undefined>(undefined);
export const centerPositionAtom = atom<{ x: number; y: number } | undefined>(
  undefined
);
localforage.config({ name: "react-flow", storeName: "flows" });

export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [isEditMode, setIsEditMode] = useAtom(editModeAtom);
  const [isExpandMode, setIsExpandMode] = useAtom(expandModeAtom);
  const [showLogs, setShowLogs] = useAtom(showLogsAtom);
  const [runningNode, setRunningNode] = useAtom(runningNodeAtom);
  const [failedNode, setFailedNode] = useAtom(failedNodeAtom);
  const [cloudApiKey, setCloudApiKey] = useAtom(apiKeyAtom);
  const [openAIApiKey, setOpenAIApiKey] = useAtom(apiKeyAtom);
  const [s3Container, setS3Container] = useAtom(s3ContainerAtom);
  const [s3Name, setS3Name] = useAtom(s3NameAtom);
  const [s3AccessKey, setS3AccessKey] = useAtom(s3AccessKeyAtom);
  const [s3SecretKey, setS3SecretKey] = useAtom(s3SecretKeyAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [nodeParamChanged, setNodeParamChanged] = useAtom(nodeParamChangedAtom);

  return {
    rfInstance,
    setRfInstance,
    isEditMode,
    setIsEditMode,
    isExpandMode,
    setIsExpandMode,
    showLogs,
    setShowLogs,
    runningNode,
    setRunningNode,
    failedNode,
    setFailedNode,
    cloudApiKey,
    setCloudApiKey,
    openAIApiKey,
    setOpenAIApiKey,
    nodeParamChanged,
    setNodeParamChanged,
    isSidebarOpen,
    setIsSidebarOpen,
    s3Name,
    setS3Name,
    s3AccessKey,
    setS3AccessKey,
    s3SecretKey,
    setS3SecretKey,
    s3Container,
    setS3Container,
  };
}
