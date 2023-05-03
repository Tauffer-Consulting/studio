import { Select, TextInput, NumberInput, Checkbox } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

export type ParamType = "float" | "int" | "string" | "boolean" | "select";

type ParamFieldProps = {
  nodeId: string;
  paramId: string;
  functionName: string;
  type: ParamType;
  value: any;
  options?: string[];
};

const ParamField = ({
  nodeId,
  paramId,
  functionName,
  type,
  value,
  options,
}: ParamFieldProps) => {
  const { updateCtrlInputDataForNode } = useFlowChartState();
  const handleChange = (value: string) => {
    updateCtrlInputDataForNode(nodeId, paramId, {
      functionName,
      param: paramId,
      value,
    });
  };
  switch (type) {
    case "float":
    case "int":
      return (
        <NumberInput
          onChange={(x) => handleChange(x.toString())}
          value={value !== "" ? parseFloat(value) : value}
        />
      );
    case "string":
      return (
        <TextInput
          onChange={(e) => handleChange(e.currentTarget.value)}
          value={value}
        />
      );
    case "boolean":
      return (
        <Checkbox
          onChange={(e) => handleChange(e.currentTarget.checked.toString())}
        />
      );
    case "select":
      return <Select onChange={handleChange} data={options!} value={value} />;
  }
};

export default ParamField;
