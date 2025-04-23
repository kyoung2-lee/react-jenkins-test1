import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/hooks";

const ScreenMask: React.FC = () => {
  const isOpen = useAppSelector((state) => !!state.common.displayMaskNumber || false);

  if (isOpen) {
    return <Mask />;
  }
  return null;
};

// z-indexをreapopより小さく指定
const Mask = styled.div<{ isNotFullScreen?: boolean }>`
  position: ${(props) => (props.isNotFullScreen ? "absolute" : "fixed")};
  z-index: 999999998;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;

export default ScreenMask;
