import dayjs from "dayjs";
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useAppDispatch, useLatest } from "../../store/hooks";

import Label from "../atoms/Label";
import FisFltStsLabel from "../atoms/FisFltStsLabel";
import { formatFltNo } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import SpecialStatuses from "./SpecialStatuses";
import { getIdentifier, FlightKey } from "../../reducers/flightContents";
import { type openFlightMovementModal } from "../../reducers/flightMovementModal";
import { type openMvtMsgModal } from "../../reducers/mvtMsgModal";
import Plane from "../../assets/images/icon/icon-plane.svg";
import { MvtMsgFlgIconSvg } from "../organisms/MvtMsgModal";

interface Props {
  eLeg: FlightsApi.ELegList;
  onFlightDetail: (eLeg: FlightsApi.ELegList) => void;
  selectedFlightIdentifier: string;
  stationOperationTaskEnabled?: boolean;
  onStationOperationTask?: (eLeg: FlightsApi.ELegList) => void;
  openOalFlightMovementModal?: typeof openFlightMovementModal;
  flightMovementEnabled?: boolean;
  flightDetailEnabled?: boolean;
  isModalComponent?: boolean;
  mvtMsgEnabled?: boolean;
  openMvtMsgModal?: typeof openMvtMsgModal;
}

const FlightSearchResult: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const isPc = useMemo(() => storage.isPc, []);
  const [clickCount, setClickCount] = useState(0);
  const latestClickCount = useLatest(clickCount);

  const handleFlightDetail = (e: React.MouseEvent) => {
    const { eLeg, onFlightDetail, flightDetailEnabled } = props;
    if (!flightDetailEnabled) {
      return;
    }

    onFlightDetail(eLeg);
    // 便詳細画面を呼び出す際に、機材接続情報画面へのフォーカスを合わせないようにするため
    e.stopPropagation();
  };

  const handleStationOperationTask = (e: React.MouseEvent) => {
    const { eLeg, onStationOperationTask, stationOperationTaskEnabled } = props;
    if (stationOperationTaskEnabled && onStationOperationTask) {
      onStationOperationTask(eLeg);
    }

    // 便詳細画面を呼び出す際に、機材接続情報画面へのフォーカスを合わせないようにするため
    e.stopPropagation();
  };

  const isSelected = (selectedFlightIdentifier: string) => {
    const { eLeg } = props;
    return selectedFlightIdentifier === getIdentifier({ ...eLeg, myApoCd: "" } as FlightKey);
  };

  const handleFlightMovement = (isDep: boolean) => (e: React.MouseEvent<HTMLDivElement>) => {
    setClickCount(clickCount + 1);
    const { eLeg, flightMovementEnabled, openOalFlightMovementModal, isModalComponent, mvtMsgEnabled, openMvtMsgModal } = props;
    // 機材接続情報画面以外の場合は、便情報詳細画面が開かないようにする
    if (!isModalComponent) {
      e.stopPropagation();
    }

    setTimeout(() => {
      if (latestClickCount.current >= 2) {
        // 2回以上タップで便動態発信画面を開く
        setClickCount(0);
        if (!mvtMsgEnabled) return;
        if (eLeg.oalTblFlg) return;
        if (eLeg.fisFltSts === "CNL") return;
        if (!openMvtMsgModal) return;

        const legKey: MvtMsgApi.LegKey = {
          orgDateLcl: eLeg.orgDateLcl,
          alCd: eLeg.alCd,
          fltNo: eLeg.fltNo,
          skdDepApoCd: eLeg.skdDepApoCd,
          skdArrApoCd: eLeg.skdArrApoCd,
          skdLegSno: eLeg.skdLegSno,
        };
        void dispatch(openMvtMsgModal({ legKey }));
      } else if (latestClickCount.current === 1) {
        // 1回タップで便動態更新画面を開く
        setClickCount(0);
        if (!flightMovementEnabled) return;
        if (!openOalFlightMovementModal) return;

        const legKey: CommonFlightInfo.Legkey = {
          orgDateLcl: eLeg.orgDateLcl,
          alCd: eLeg.alCd,
          fltNo: eLeg.fltNo,
          casFltNo: eLeg.casFltNo || "",
          skdDepApoCd: eLeg.skdDepApoCd,
          skdArrApoCd: eLeg.skdArrApoCd,
          skdLegSno: eLeg.skdLegSno,
        };
        void dispatch(openOalFlightMovementModal({ legKey, isDep }));
      }
    }, 350);
  };

  const getEta = () => {
    const { eLeg } = props;

    if (eLeg.ataLcl) {
      return dayjs(eLeg.ataLcl).format("HHmm");
    }
    if (eLeg.actLdLcl) {
      return dayjs(eLeg.actLdLcl).format("HHmm");
    }
    if (eLeg.tentativeEstLdLcl) {
      return dayjs(eLeg.tentativeEstLdLcl).format("HHmm");
    }
    if (eLeg.estLdLcl) {
      return dayjs(eLeg.estLdLcl).format("HHmm");
    }
    if (eLeg.tentativeEtaLcl) {
      return dayjs(eLeg.tentativeEtaLcl).format("HHmm");
    }
    if (eLeg.etaLcl && eLeg.etaLcl === eLeg.staLcl) {
      return "SKD";
    }
    if (eLeg.etaLcl) {
      return dayjs(eLeg.etaLcl).format("HHmm");
    }
    return "";
  };

  const getTentativeEtaCd = () => {
    const { eLeg } = props;

    if (!eLeg.ataLcl && !eLeg.actLdLcl) {
      if (eLeg.tentativeEstLdLcl) {
        return eLeg.tentativeEstLdCd;
      }
      if (!eLeg.estLdLcl && eLeg.tentativeEtaLcl) {
        return eLeg.tentativeEtaCd;
      }
    }

    return "";
  };

  const {
    eLeg,
    selectedFlightIdentifier,
    stationOperationTaskEnabled,
    flightMovementEnabled,
    flightDetailEnabled,
    isModalComponent,
    mvtMsgEnabled,
  } = props;
  const tentativeEtaCd = getTentativeEtaCd();
  const eta = getEta();
  const timeColumnEnabled =
    flightMovementEnabled || (isModalComponent && flightDetailEnabled) || (mvtMsgEnabled && !eLeg.oalTblFlg && eLeg.fisFltSts !== "CNL");

  return (
    <Wrapper isSelected={isSelected(selectedFlightIdentifier)} onClick={handleFlightDetail} enabled={!!flightDetailEnabled}>
      <Flight>
        {eLeg.casFltNo ? (
          <RowCenter>
            <CasFlight length={eLeg.casFltNo.length}>{eLeg.casFltNo}</CasFlight>
          </RowCenter>
        ) : (
          <Row>
            <FlightAlCd>{eLeg.alCd}</FlightAlCd>
            <FlightNumber>{formatFltNo(eLeg.fltNo)}</FlightNumber>
            {eLeg.csCount !== 0 && <CsSign />}
          </Row>
        )}
        <RowCenter>
          {eLeg.fisFltSts ? (
            <FisFltStsLabel isPc={isPc} isDarkMode={false}>
              {eLeg.fisFltSts}
            </FisFltStsLabel>
          ) : (eLeg.estLdLcl || eLeg.tentativeEstLdLcl) && !eLeg.actLdLcl ? (
            <PlaneIcon />
          ) : (
            ""
          )}
        </RowCenter>
      </Flight>
      <Col>
        <SubCol1>
          <Row>
            <Airport>{eLeg.skdDepApoCd}</Airport>
            <TimeColumn enabled={timeColumnEnabled} onClick={handleFlightMovement(true)}>
              {eLeg.stdLcl ? dayjs(eLeg.stdLcl).format("HHmm") : "\u00A0"}
            </TimeColumn>
          </Row>
          <Row>
            <TimeLabelWrapper>
              <Estimate>{eLeg.atdLcl ? "ATD" : eLeg.etdLcl || eLeg.tentativeEtdLcl ? "ETD" : ""}</Estimate>
              <TentativeCdWrapper>
                {!eLeg.atdLcl && eLeg.tentativeEtdLcl && eLeg.tentativeEtdCd && !eLeg.depMvtSentFlg && (
                  <Label isPc={isPc}>{eLeg.tentativeEtdCd}</Label>
                )}
              </TentativeCdWrapper>
              {eLeg.depMvtSentFlg && (
                <MvtMsgFlgIconWrapper>
                  <MvtMsgFlgIcon />
                </MvtMsgFlgIconWrapper>
              )}
            </TimeLabelWrapper>
            <TimeColumn enabled={timeColumnEnabled} onClick={handleFlightMovement(true)}>
              {eLeg.atdLcl
                ? dayjs(eLeg.atdLcl).format("HHmm")
                : eLeg.tentativeEtdLcl
                ? dayjs(eLeg.tentativeEtdLcl).format("HHmm")
                : eLeg.etdLcl && eLeg.etdLcl === eLeg.stdLcl
                ? "SKD"
                : eLeg.etdLcl
                ? dayjs(eLeg.etdLcl).format("HHmm")
                : ""}
            </TimeColumn>
          </Row>
        </SubCol1>
        <SubCol2>
          <Row>
            <Airport>{eLeg.lstArrApoCd}</Airport>
            <TimeColumn enabled={timeColumnEnabled} onClick={handleFlightMovement(false)}>
              {eLeg.staLcl && eLeg.skdArrApoCd === eLeg.lstArrApoCd ? dayjs(eLeg.staLcl).format("HHmm") : "\u00A0"}
            </TimeColumn>
          </Row>
          <Row>
            <TimeLabelWrapper>
              <Estimate>
                {eLeg.ataLcl
                  ? "ATA"
                  : eLeg.actLdLcl
                  ? "L/D"
                  : eLeg.tentativeEstLdLcl || eLeg.estLdLcl || eLeg.tentativeEtaLcl || eLeg.etaLcl
                  ? "ETA"
                  : ""}
              </Estimate>
              <TentativeCdWrapper>
                {tentativeEtaCd && !eLeg.arrMvtSentFlg ? <Label isPc={isPc}>{tentativeEtaCd}</Label> : ""}
              </TentativeCdWrapper>
              {eLeg.arrMvtSentFlg && (
                <MvtMsgFlgIconWrapper>
                  <MvtMsgFlgIcon />
                </MvtMsgFlgIconWrapper>
              )}
            </TimeLabelWrapper>
            <TimeColumn enabled={timeColumnEnabled} onClick={handleFlightMovement(false)}>
              {eta || ""}
            </TimeColumn>
          </Row>
        </SubCol2>
        {eLeg.specialStses && eLeg.specialStses.specialSts.length > 0 && (
          <SpecialStatusDiv>
            <SpecialStatuses specialStses={eLeg.specialStses} arrDepCd="" width="224px" isPc={isPc} isDarkMode={false} />
          </SpecialStatusDiv>
        )}
      </Col>
      {storage.terminalCat === Const.TerminalCat.iPhone ? (
        <Col>
          <Row>
            <StationOperationTask onClick={handleStationOperationTask} enabled={!!stationOperationTaskEnabled}>
              <div>{eLeg.actToLcl ? "-" : eLeg.lstWorkStepShortName}</div>
            </StationOperationTask>
          </Row>
        </Col>
      ) : (
        <Col />
      )}
    </Wrapper>
  );
};

const SubCol1 = styled.div`
  display: table-cell;
  min-width: 114px;
`;
const SubCol2 = styled.div`
  display: table-cell;
  min-width: 114px;
`;

const Wrapper = styled.tr<{ isSelected: boolean; enabled: boolean }>`
  background: ${(props) => props.theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
  outline: ${(props) => (props.isSelected ? "2px solid #E6B422" : `2px solid ${props.theme.color.FLIGHT_ROW_BACKGROUND_COLOR}`)};
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
`;

const Flight = styled.td`
  padding: 10px 0 6px 8px;
  min-width: 80px;
`;

const FlightAlCd = styled.span`
  font-size: 14px;
`;

const FlightNumber = styled.span`
  font-size: 18px;
  line-height: 26px;
  padding-top: 2px;
`;

const CasFlight = styled.span<{ length?: number }>`
  word-break: break-all;
  font-size: ${({ length }) => (length && length > 5 ? "14" : "15")}px;
  line-height: 1;
`;

const CsSign = styled.div`
  align-self: center;
  margin-top: 1px;
  margin-left: 2px;
  width: 8px;
  height: 8px;
  background: #f4f085;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 50%;
`;

const Airport = styled.span`
  width: 58px;
`;

const TimeColumn = styled.div<{ enabled?: boolean }>`
  width: 52px;
  height: 100%;
  font-size: 20px;
  line-height: 27px;
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
  user-select: none;
`;

const TimeLabelWrapper = styled.div`
  display: flex;
  align-self: center;
  width: 58px;
  font-size: 18px;
`;

const Estimate = styled.div`
  font-size: 12px;
`;

const TentativeCdWrapper = styled.div`
  padding-left: 2px;
`;

const MvtMsgFlgIconWrapper = styled.div`
  margin-left: auto;
  line-height: 12px;
  padding-right: 4px;
`;

const MvtMsgFlgIcon = styled(MvtMsgFlgIconSvg)`
  height: 16px;
  width: 16px;
`;

const SpecialStatusDiv = styled.div`
  font-size: 16px;
  color: #98afbf;
  margin-top: -8px;
  margin-bottom: 11px;
  span {
    font-size: 12px;
    margin-right: 10px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  height: 26px;
`;

const RowCenter = styled(Row)`
  align-items: center;
`;

const Col = styled.td`
  font-size: 18px;
`;

const PlaneIcon = styled.img.attrs({ src: Plane })`
  margin-left: 9px;
  width: 25px;
  height: 20px;
`;

const StationOperationTask = styled.div<{ enabled: boolean }>`
  height: 48px;
  width: 48px;
  margin: auto;
  margin-top: 10px;
  margin-left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  background: #fff;
  font-size: 20px;
  line-height: 27px;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  cursor: ${(props) => (props.enabled ? "pointer" : "auto")};
`;

export default FlightSearchResult;
