import React from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import Clip from "../../assets/images/icon/clip_white.svg";

interface Props {
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadFileButton = (props: Props) => {
  const { disabled, onChange } = props;
  const id = uuid();
  return (
    <FileInputContainer htmlFor={id} disabled={disabled}>
      <ClipIcon />
      {!disabled && <input type="file" id={id} multiple onChange={onChange} />}
    </FileInputContainer>
  );
};

const ClipIcon = styled.img.attrs({ src: Clip })``;

const FileInputContainer = styled.label<{ disabled?: boolean }>`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #346181;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  input {
    position: absolute;
    opacity: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  ${({ disabled, theme }) =>
    disabled
      ? "opacity: 0.6;"
      : `
      cursor: pointer;
      &:hover {
        background: ${theme.color.button.PRIMARY_HOVER};
      }
      &:active {
        background: ${theme.color.button.PRIMARY_ACTIVE};
      }
  `};
`;

export default UploadFileButton;
