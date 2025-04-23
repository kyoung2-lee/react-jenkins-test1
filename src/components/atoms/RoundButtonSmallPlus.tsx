import React from "react";
import styled from "styled-components";
import RoundButtonSmall, { Props } from "./RoundButtonSmall";
import PlusIcon from "../../assets/images/icon/plus.svg?component";

const RoundButtonSmallPlus: React.FC<Props> = (props) => {
  const { onClick, disabled, ...otherProps } = props;
  return (
    <ButtonBase onClick={!disabled ? onClick : undefined} disabled={disabled} {...otherProps}>
      <PlusIcon />
    </ButtonBase>
  );
};

const ButtonBase = styled(RoundButtonSmall)<{ disabled?: boolean }>`
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  svg {
    fill: #fff;
  }
`;

export default RoundButtonSmallPlus;
