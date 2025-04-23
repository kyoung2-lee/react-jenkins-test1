import React from "react";
import styled, { css, keyframes } from "styled-components";
import RoundButton, { Props } from "./RoundButton";
import Reload from "../../assets/images/icon/icon-reload.png";
import DisabledReload from "../../assets/images/icon/icon-reload-disable.svg";

interface MyProps {
  isFetching?: boolean;
}

const RoundButtonReload: React.FC<Props & MyProps> = (props) => {
  const { isFetching, disabled } = props;
  return (
    <ReloadButton type="button" {...props}>
      {!disabled ? <ReloadIcon isFetching={isFetching} /> : <DisabledReloadIcon />}
    </ReloadButton>
  );
};

const ReloadButton = styled(RoundButton)`
  ${(props) =>
    props.disabled
      ? css`
          background: #c9d3d0;
          cursor: auto;
          border: none;
        `
      : css`
          &:focus {
            background: ${props.theme.color.button.PRIMARY_HOVER};
          }
          &:hover {
            background: ${props.theme.color.button.PRIMARY_HOVER};
          }
          &:active {
            background: ${props.theme.color.button.PRIMARY_ACTIVE};
          }
        `};
`;

const spin = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

const ReloadIcon = styled.img.attrs({ src: Reload })<{
  isFetching?: boolean;
}>`
  width: 32.73px;
  height: 32.73px;
  ${(props) =>
    props.isFetching
      ? css`
          animation: ${spin} 2s linear infinite;
        `
      : ""};
`;

const DisabledReloadIcon = styled.img.attrs({
  src: DisabledReload,
})`
  width: 24px;
  height: 24px;
`;

export default RoundButtonReload;
