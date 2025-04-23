import React from "react";
import styled from "styled-components";
import { storage } from "../../lib/storage";

const Label: React.FC<{ children: React.ReactNode; isPc: typeof storage.isPc }> = ({ children, isPc }) => (
  <DefaultLabel isPc={isPc}>{children}</DefaultLabel>
);

const DefaultLabel = styled.div<{ isPc: typeof storage.isPc }>`
  height: 14px;
  padding-top: ${({ isPc }) => (isPc ? "1px" : "2px")};
  background: #595857;
  border-radius: 3px;
  min-width: 28px;
  font-size: 10px;
  color: #fff;
  text-align: center;
`;

export default Label;
