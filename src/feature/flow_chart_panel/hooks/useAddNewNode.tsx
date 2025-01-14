import { NodeElement } from "@src/utils/ManifestLoader";
import { Draft } from "immer";
import { useCallback } from "react";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { ElementsData } from "flojoy/types";
import { sendEventToMix } from "@src/services/MixpanelServices";
import NodeFunctionsMap from "@src/data/pythonFunctions.json";
import { centerPositionAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";

export type AddNewNode = (node: NodeElement) => void;

export const useAddNewNode = (
  setNodes: (
    update:
      | Node<ElementsData>[]
      | ((draft: Draft<Node<ElementsData>>[]) => void)
  ) => void,
  getNodeFuncCount: (func: string) => number
) => {
  const [center] = useAtom(centerPositionAtom);

  const getNodePosition = () => {
    return {
      x: 50 + Math.random() * 200,
      y: 10 + Math.random() + Math.random() * 40,
    };
  };

  const pos = center ?? getNodePosition();

  return useCallback(
    (node: NodeElement) => {
      const nodePosition = {
        x: pos.x + (Math.random() - 0.5) * 30,
        y: pos.y + (Math.random() - 0.5) * 30,
      };
      const funcName = node.key;
      const type = node.type;
      const params = node.parameters;
      const inputs = node.inputs;
      const outputs = node.outputs;
      const uiComponentId = node.ui_component_id;
      const pip_dependencies = node.pip_dependencies;
      const path = NodeFunctionsMap[`${funcName}.py`]?.path ?? "";
      let nodeLabel: string;

      const nodeId = `${funcName}-${uuidv4()}`;
      if (funcName === "CONSTANT") {
        nodeLabel = "2.0";
      } else {
        const numNodes = getNodeFuncCount(funcName);
        nodeLabel = numNodes > 0 ? `${funcName} ${numNodes}` : funcName;
      }
      nodeLabel = nodeLabel.replaceAll("_", " ");

      const nodeParams = params
        ? Object.entries(params).reduce(
            (prev: ElementsData["ctrls"], [paramName, param]) => ({
              ...prev,
              [paramName]: {
                ...param,
                functionName: funcName,
                param: paramName,
                value:
                  funcName === "CONSTANT" ? nodeLabel : param.default ?? "",
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: nodeId,
        type: uiComponentId ?? type,
        data: {
          id: nodeId,
          label: nodeLabel,
          func: funcName,
          type,
          ctrls: nodeParams,
          inputs,
          outputs,
          pip_dependencies,
          path,
        },
        position: nodePosition,
      };
      setNodes((els) => els.concat(newNode));
      sendEventToMix("Node Added", newNode.data.label);
    },
    [setNodes, getNodeFuncCount, pos]
  );
};
