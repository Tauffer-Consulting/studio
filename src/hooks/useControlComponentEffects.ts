import { ControlOptions } from "@src/feature/controls_panel/types/ControlOptions";
import { ControlComponentStateType } from "@src/feature/controls_panel/views/ControlComponentState";
import { FUNCTION_PARAMETERS } from "@src/feature/flow_chart_panel/manifest/PARAMETERS_MANIFEST";
import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { useEffect } from "react";
import { Elements, FlowExportObject } from "react-flow-renderer";
import {
  ControlNames,
  ControlTypes,
  PlotTypesManifest,
} from "../feature/controls_panel/manifest/CONTROLS_MANIFEST";
import {
  CtlManifestType,
  CtrlManifestParam,
  PlotManifestParam
} from "./useFlowChartState";

const useControlComponentEffects = ({
  flowChartObject,
  localforage,
  flowKey,
  setFlowChartObject,
  setSelectedOption,
  setSelectedPlotOption,
  ctrlObj,
  selectOptions,
  plotOptions,
  results,
  setNd,
  setPlotData,
  nd,
  selectedOption,
  selectedPlotOption,
  selectedInputOption,
  selectedOutputOption,
  setCurrentInputValue,
  defaultValue,
  ctrls,
  setSelectOptions,
  setPlotOptions,
  setInputOptions,
  setOutputOptions,
  setKnobValue,
  setTextInput,
  setNumberInput,
  setSliderInput,
}: ControlComponentStateType & {
  ctrlObj: CtlManifestType;
  results: ResultsType;
}) => {
  useEffect(() => {
    if (!flowChartObject) {
      localforage
        .getItem(flowKey)
        .then((val) => {
          setFlowChartObject(
            val as FlowExportObject<{
              label: string;
              func: string;
              elements: Elements;
              position: [number, number];
              zoom: number;
            }>
          );
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [flowChartObject]);

  useEffect(() => {
    setSelectedOption(
      ctrlObj.type === "output"
        ? selectOptions?.find((option) => option.value === (ctrlObj?.param as PlotManifestParam)?.node)!
        : selectOptions?.find(
            (option) =>
              option.value.id === (ctrlObj?.param as CtrlManifestParam)?.id
          )!
    );
  }, [
    ctrlObj?.param,
    (ctrlObj?.param as CtrlManifestParam)?.id,
    selectOptions,
    ctrlObj?.type,
  ]);

  useEffect(() => {
    setSelectedPlotOption(
      plotOptions?.find((option) =>
        option.value.type === (ctrlObj?.param as PlotManifestParam)?.plot?.type
        && option.value.mode === (ctrlObj?.param as PlotManifestParam)?.plot?.mode)!
    );
  }, [
    ctrlObj?.param,
    plotOptions,
  ]);

  useEffect(() => {
    setNumberInput("0");
    setTextInput("");
    setKnobValue(0);
    setSliderInput("0");
  }, [selectedOption]);

  useEffect(() => {
    try {
      if (ctrlObj.name.toUpperCase() === ControlNames.Plot.toUpperCase()) {
        // figure out what we're visualizing
        const nodeIdToPlot = (ctrlObj?.param as PlotManifestParam)?.node;
        if (nodeIdToPlot) {
          if (results && "io" in results) {
            const runResults = results.io!.reverse();
            const filteredResult = runResults.filter(
              (node) => nodeIdToPlot === node.id
            )[0];
            setNd(filteredResult === undefined ? null : filteredResult);
            if (Object.keys(nd!).length > 0) {
              if (nd!.result) {
                if ("data" in nd!.result) {
                  setPlotData(nd!.result!.data!);
                } else {
                  const inputOptions: ControlOptions[] = [];
                  if (typeof nd!.result["x"] === 'object') {
                    for (const [key, value] of Object.entries(nd!.result["x"]!)) {
                      inputOptions.push({ label: key, value: value });
                    }
                  } else {
                    inputOptions.push({ label: 'x', value: nd!.result["x"]! })
                  }
                  if (selectedPlotOption?.value.type === 'histogram') {
                    inputOptions.push({ label: 'y', value: nd!.result["y"]! })
                  }

                  setInputOptions(inputOptions);
                  setOutputOptions([{ label: 'y', value: nd!.result["y"]!}])
                  setPlotData([{
                    x: selectedInputOption?.value,
                    y: selectedOutputOption?.value,
                    z: Array(selectedInputOption?.value.length).fill(0),
                    type: selectedPlotOption?.value.type,
                    mode: selectedPlotOption?.value.mode
                  }]);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [ctrlObj, nd, results, selectedOption]);

  useEffect(() => {
    if (ctrls) {
      setCurrentInputValue(
        ctrls[(ctrlObj?.param as CtrlManifestParam)?.id!]?.value
      );
    } else {
      setCurrentInputValue(defaultValue as number);
    }
  }, [ctrls, ctrlObj, selectedOption]);

  useEffect(() => {
    if (ctrlObj.type === ControlTypes.Input) {
      if (flowChartObject!?.elements !== undefined) {
        flowChartObject!.elements.forEach((node) => {
          if (!("source" in node)) {
            // Object is a node, not an edge
            const nodeLabel = node.data!.label;
            const nodeFunctionName = node.data!.func;
            const params = FUNCTION_PARAMETERS[nodeFunctionName];
            const sep = " ▶ ";
            if (params) {
              Object.keys(params).forEach((param) => {
                setSelectOptions((prev) => [
                  ...prev,
                  {
                    label: nodeLabel + sep + param.toUpperCase(),
                    value: {
                      id:
                        nodeFunctionName +
                        "_" +
                        nodeLabel.toString().split(" ").join("") +
                        "_" +
                        param,
                      functionName: nodeFunctionName,
                      param,
                      nodeId: node.id,
                      inputId: ctrlObj.id,
                    },
                  },
                ]);
              });
            }
          }
        });
      }
    } else if (ctrlObj.type === ControlTypes.Output) {
      if (flowChartObject!?.elements !== undefined) {
        flowChartObject!.elements.forEach((node) => {
          if (!("source" in node)) {
            // Object is a node, not an edge
            const label =
              "Visualize node: " +
              node.data!.label +
              " (#" +
              node.id.slice(-5) +
              ")";
            setSelectOptions((prev) => [
              ...prev,
              { label: label, value: node.id },
            ]);
          }
        });
      }
      if (ctrlObj.name === ControlNames.Plot) {
        PlotTypesManifest.forEach((item) => {
          setPlotOptions((prev) => [
            ...prev,
            {
              label: item.name,
              value: {
                type: item.type,
                mode: item.mode || undefined
              }
            },
          ]);
        });
      }
    }
    return () => {
      setSelectOptions([]);
      setPlotOptions([])
    };
  }, [ctrlObj, flowChartObject?.elements, ctrlObj?.type]);
};

export default useControlComponentEffects;
