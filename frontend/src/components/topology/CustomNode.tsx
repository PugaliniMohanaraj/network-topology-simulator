import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { DEVICE_DEFAULTS, type DeviceNodeData } from "../../types/topology";

function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as DeviceNodeData;
  const meta = DEVICE_DEFAULTS[nodeData.deviceType];
  const inactive = nodeData.status === "inactive";

  return (
    <div
      className={`device-node device-node--${nodeData.deviceType} ${selected ? "device-node--selected" : ""} ${inactive ? "device-node--inactive" : ""}`}
      style={{ borderColor: meta.color }}
    >
      <Handle type="target" position={Position.Top} className="device-handle" />
      <div className="device-node__icon" style={{ color: meta.color }}>
        {meta.icon}
      </div>
      <div className="device-node__label">{nodeData.label}</div>
      {nodeData.ipAddress ? (
        <div className="device-node__ip">{nodeData.ipAddress}</div>
      ) : null}
      <Handle type="source" position={Position.Bottom} className="device-handle" />
    </div>
  );
}

export default memo(CustomNode);
