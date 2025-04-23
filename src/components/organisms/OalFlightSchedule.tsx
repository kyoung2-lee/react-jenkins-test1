import React from "react";
import styled from "styled-components";

import uniq from "lodash.uniq";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import { fltListInsert, setInputModal, switchUtc } from "../../reducers/oalFlightSchedule";
import OalFlightScheduleSearch from "../molecules/OalFlightSchedule/OalFlightScheduleSearch";
import OalFlightScheduleList from "../molecules/OalFlightSchedule/OalFlightScheduleList";
import RoundButtonMode from "../atoms/RoundButtonMode";
import RoundButtonPlusFlt from "../atoms/RoundButtonPlusFlt";

const OalFlightSchedule: React.FC = () => {
  const dispatch = useAppDispatch();
  const oalFlightScheduleState = useAppSelector((state) => state.oalFlightSchedule);
  const master = useAppSelector((state) => state.account.master);

  const isEdited = () => {
    const { fltScheduleList } = oalFlightScheduleState;
    const editedFltIndexes = uniq(fltScheduleList.filter((flt) => flt.rowStatus === "Edited").map((f) => f.fltIndex));
    return editedFltIndexes.some(
      (fltIndex) =>
        !fltScheduleList.some((f) => f.fltIndex === fltIndex && ((f.rowStatus === "Error" && f.chgType !== "") || f.rowStatus === "Failed"))
    );
  };

  const isAllUpdated = () => {
    if (oalFlightScheduleState.fltScheduleList.find((f) => !!f.rowStatus && f.rowStatus !== "Updated" && f.rowStatus !== "Skipped")) {
      return false;
    }
    return true;
  };

  const handleClickAdd = async () => {
    await dispatch(fltListInsert());
    dispatch(setInputModal({ isOpenInputModal: true, inputRowIndex: 0, inputChgType: "ADD FLT", inputNewRow: true }));
  };

  const handleClickMode = () => {
    dispatch(switchUtc({ isUtc: !oalFlightScheduleState.isUtc }));
  };

  const apoOptions = master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }));
  const flightStsOptions = master.cdCtrlDtls
    .filter((c) => c.cdCls === "029")
    .sort((a, b) => a.num1 - b.num1)
    .map((c) => ({ value: c.cdCat1, label: c.cdCat1 }));
  return (
    <Wrapper>
      <ModeButtonContainer isPc={storage.isPc}>
        <RoundButtonPlusFlt
          onClick={() => {
            void handleClickAdd();
          }}
          tabIndex={100}
        />
        <RoundButtonMode isActiveColor={oalFlightScheduleState.isUtc} onClick={handleClickMode} disabled={!isAllUpdated()} tabIndex={110} />
      </ModeButtonContainer>

      <Content disabled={false} isPc={storage.isPc} isActive>
        <OalFlightScheduleSearch apoOptions={apoOptions} isEdited={isEdited()} />
        <ListContainer isPc={storage.isPc}>
          <OalFlightScheduleList apoOptions={apoOptions} flightStsOptions={flightStsOptions} isEdited={isEdited()} />
        </ListContainer>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: ${Const.MAX_WIDTH};
  min-width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0 auto;
  padding: 52px 8px 0 8px;
  background-color: #fff;
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
`;

const ModeButtonContainer = styled.div<{ isPc: boolean }>`
  position: absolute;
  display: flex;
  top: calc(${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} + 5px);
  right: 100px;
  z-index: 4;
  transform-origin: top right;
  transform: scale(0.7);
  button {
    margin-left: 14px;
  }
`;

export const Content = styled.div<{ disabled: boolean; isPc: boolean; isActive: boolean }>`
  position: relative;
  z-index: ${({ isActive }) => (isActive ? "2" : "1")};
  width: 100%;
  height: calc(100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 44px - 16px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 6px 6px 0 6px;
  margin-top: -1px;
  border: 1px solid #595857;
  background: ${(props) => (props.disabled ? "#C9D3D0" : "#FFF")};
`;

const ListContainer = styled.div<{ isPc: boolean }>`
  margin-top: 4px;
  width: 100%;
  height: calc(
    100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 44px - 16px - 60px - 6px - 8px
  );
`;

export default OalFlightSchedule;
