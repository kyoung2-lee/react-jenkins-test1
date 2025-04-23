import React from "react";
import styled from "styled-components";
import { ExtFisRow } from "../organisms/BarChart/selector";
import { removeJa } from "../../lib/commonUtil";
import Blade from "../../assets/images/icon/blade.svg";

interface Props {
  extFisRow: ExtFisRow;
  disabled: boolean;
  onClick: () => void;
}

const BarChartShipButton: React.FC<Props> = (props: Props) => {
  const { extFisRow, onClick, disabled } = props;
  return (
    <ShipContent onClick={onClick} disabled={disabled}>
      <div>
        {removeJa(extFisRow.gndShipNo1)}
        {extFisRow.gndShipNo2}
      </div>
      <div>
        {extFisRow.gndSeatConfCd || "-"}
        {extFisRow.gndWingletFlg && <BladeIcon />}
      </div>
    </ShipContent>
  );
};

const ShipContent = styled.button`
  ${({ disabled }) =>
    disabled
      ? ""
      : `
    cursor: pointer;
  `}
  padding-top: 0px;
  font-size: 16px;
  background: none;
  color: #346181;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div:first-child {
    font-size: 20px;
  }
  > div:nth-child(2) {
    display: flex;
  }
  img {
    margin-top: 5px;
    width: 11px;
    height: 9px;
  }
`;

const BladeIcon = styled.img.attrs({ src: Blade })``;

export default BarChartShipButton;
