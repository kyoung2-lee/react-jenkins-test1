import React from "react";
import styled from "styled-components";

export type Status = "Edited" | "Updated" | "Skipped" | "Failed" | "Error" | null;

interface Props {
  status: Status;
}

const UpdateStatusLabel = (props: Props) => <StatusLabel status={props.status}>{props.status}</StatusLabel>;

const StatusLabel = styled.div<{ status: Status }>`
  display: ${({ status }) => (status ? "block" : "none")};
  width: 66px;
  height: 24px;
  padding: 5px 0 !important;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.3;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: ${({ status, theme }) =>
    status === "Edited" ? "#E6B422" : status === "Updated" || status === "Skipped" ? "#76D100" : theme.color.text.CHANGED};
  border-radius: 8px;
  box-sizing: border-box;
`;

export default UpdateStatusLabel;
