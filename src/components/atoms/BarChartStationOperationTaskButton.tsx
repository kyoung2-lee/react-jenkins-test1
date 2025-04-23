import React from "react";
import styled from "styled-components";
import { ExtFisRow } from "../organisms/BarChart/selector";

interface Props {
  extFisRow: ExtFisRow;
  disabled?: boolean;
  onClick: (extFisRow: ExtFisRow) => void;
}

const BarChartStationOperationTaskButton: React.FC<Props> = (props: Props) => {
  const { extFisRow, onClick, disabled } = props;
  return extFisRow.gndWorkStepFlg ? (
    <Square isTookOff={!!extFisRow.depToLcl}>
      <SquareContent onClick={() => onClick(extFisRow)} disabled={disabled}>
        <div>{extFisRow.gndLstTaskSts}</div>
      </SquareContent>
    </Square>
  ) : (
    <SquareArea />
  );
};

const SquareContent = styled.button`
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  font-size: 18px;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
`;

const SquareArea = styled.div`
  position: relative;
  top: 0px;
  width: 36px;
  height: 40px;
`;

const Square = styled(SquareArea)<{ isTookOff: boolean }>`
  display: inline-block;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default BarChartStationOperationTaskButton;
