import { Box } from "@mantine/core";
import { NodeResult } from "@src/feature/common/types/ResultsType";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Node, useOnSelectionChange } from "reactflow";
import { ElementsData } from "flojoy/types";
import NodeModal from "./NodeModal";
import { useEffect, useState } from "react";

type NodeExpandMenuProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: string;
  nodeType: string;
  nodeResults: NodeResult[];
  selectedNode: Node<ElementsData> | null;
  pythonString: string;
  nodeFilePath: string;
};

export const NodeExpandMenu = ({
  closeModal,
  nodeLabel,
  nodeType,
  nodeResults,
  selectedNode,
  pythonString,
  nodeFilePath,
}: NodeExpandMenuProps) => {
  const { isExpandMode, setIsExpandMode } = useFlowChartState();
  const [nodeResult, setNodeResult] = useState<NodeResult | null>(null);
  const onSelectionChange = () => {
    if (!selectedNode) {
      setIsExpandMode(false);
    }
  };

  useOnSelectionChange({ onChange: onSelectionChange });

  useEffect(() => {
    setNodeResult(
      nodeResults.find((node) => node.id === selectedNode?.id) ?? null
    );
  }, [selectedNode, nodeResults]);

  return (
    <Box pos="relative" data-testid="node-modal">
      {selectedNode && isExpandMode && (
        <NodeModal
          modalIsOpen={isExpandMode}
          closeModal={closeModal}
          nodeLabel={nodeLabel}
          nodeType={nodeType}
          nd={nodeResult}
          pythonString={pythonString}
          nodeFilePath={nodeFilePath}
          data-testid="expand-menu"
          selectedNode={selectedNode}
        />
      )}
    </Box>
  );
};
