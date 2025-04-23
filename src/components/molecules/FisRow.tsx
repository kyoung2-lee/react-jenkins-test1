import dayjs from "dayjs";
import React, { useRef, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { openOalAircraftModal } from "../../reducers/oalAircraft";
import { openOalPaxModal } from "../../reducers/oalPax";
import { openOalPaxStatusModal, ForcusInputName } from "../../reducers/oalPaxStatus";
import media from "../../styles/media";
import { isWindows } from "../../styles/colorStyle";
import Blade from "../../assets/images/icon/blade.svg?component";
import Cross from "../../assets/images/icon/icon-cross.svg?component";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";
import { padding0 } from "../../lib/commonUtil";
import { FisRow as FisRowType } from "../../reducers/fisType";
import { openFlightListModal, getFlightList, FlightListKeys } from "../../reducers/flightListModals";
import { openFlightModal } from "../../reducers/flightModals";
import { fetchFlightDetail } from "../../reducers/flightContentsFlightDetail";
import { fetchStationOperationTask } from "../../reducers/flightContentsStationOperationTask";
import { openFlightMovementModal } from "../../reducers/flightMovementModal";
import { openMultipleFlightMovement } from "../../reducers/multipleFlightMovementModals";
import { openMvtMsgModal } from "../../reducers/mvtMsgModal";
import { openEditRmksPopup, FlightDetailKey } from "../../reducers/editRmksPopup";
import { openSpotNumberChild } from "../../reducers/spotNumber";
import { openOalFuelModal } from "../../reducers/oalFuel";
import SpecialStatuses from "./SpecialStatuses";
import { CsSign as BaseCsSign } from "../atoms/CsSign";
import ExcessTimeContainer from "../atoms/ExcessTimeContainer";
import FisFltStsLabel, { getLabelColor } from "../atoms/FisFltStsLabel";
import remarksIconSvg from "../../assets/images/icon/icon-remarks.svg";
import remarksIconDarkSvg from "../../assets/images/icon/icon-remarks-dark.svg";
import planeIcon from "../../assets/images/icon/icon-plane.png";
import planeAIcon from "../../assets/images/icon/icon-plane-animation.png";
import planeDarkIcon from "../../assets/images/icon/icon-plane-dark.png";
import planeDarkAIcon from "../../assets/images/icon/icon-plane-dark-animation.png";

interface Props {
  isMySchedule: boolean;
  selectedApoCd: string;
  timeDiffUtc: number | null;
  fisRow: FisRowType;
  zoomFis: number;
  dispRangeFromLcl: string;
  dispRangeToLcl: string;
  stationOperationTaskEnabled: boolean;
  flightMovementEnabled: boolean;
  multipleFlightMovementEnabled: boolean;
  mvtMsgEnabled: boolean;
  flightDetailEnabled: boolean;
  flightListEnabled: boolean;
  flightRmksEnabled: boolean;
  oalAircraftEnabled: boolean;
  oalPaxEnabled: boolean;
  spotNoEnabled: boolean;
  oalPaxStatusEnabled: boolean;
  oalFuelEnabled: boolean;
  isSortArrival: boolean;
  isSortTwoColumnMode: boolean;
  doAnimation: boolean;
  isDarkMode: boolean;
  acarsStatus: string;
  presentTime: dayjs.Dayjs | null;
}

const FisRow: React.FC<Props> = (props) => {
  const {
    isMySchedule,
    selectedApoCd,
    timeDiffUtc,
    fisRow,
    dispRangeFromLcl,
    dispRangeToLcl,
    stationOperationTaskEnabled,
    flightMovementEnabled,
    multipleFlightMovementEnabled,
    mvtMsgEnabled,
    flightDetailEnabled,
    flightListEnabled,
    flightRmksEnabled,
    oalAircraftEnabled,
    oalPaxEnabled,
    spotNoEnabled,
    oalPaxStatusEnabled,
    oalFuelEnabled,
    isSortArrival,
    isSortTwoColumnMode,
    isDarkMode,
    acarsStatus,
    presentTime,
  } = props;
  const isArrDepOal = (fisRow.arr && fisRow.arr.isOal) || (fisRow.dep && fisRow.dep.isOal) || false;
  const isDivAtbOrgApoWork = isMySchedule ? false : fisRow.isDivAtbOrgApo;

  const dispatch = useAppDispatch();
  const arrRmksTextRef = useRef<HTMLDivElement>(null);
  const depRmksTextRef = useRef<HTMLDivElement>(null);
  const clickCountRef = useRef(0);
  const mvtClickCountRef = useRef(0);
  const isWindowsFlag = useMemo(() => isWindows(), []);
  const isPc = useMemo(() => storage.isPc, []);

  const arrStsColor = useMemo(
    () => (fisRow.arrFisFltSts ? getLabelColor({ fltSts: fisRow.arrFisFltSts, isDarkMode, isArr: true }).statusColor : ""),
    [fisRow.arrFisFltSts, isDarkMode]
  );

  const depStsColor = useMemo(
    () => (fisRow.depFisFltSts ? getLabelColor({ fltSts: fisRow.depFisFltSts, isDarkMode, isArr: false }).statusColor : ""),
    [fisRow.depFisFltSts, isDarkMode]
  );

  const handleFlightListModal = () => {
    if (flightListEnabled) {
      const { dep, arr } = fisRow;
      const flightListKeys: FlightListKeys = {
        selectedApoCd,
        date:
          dep && arr
            ? dayjs(dep.orgDateLcl).format("YYYY-MM-DD")
            : dep
            ? dayjs(dep.orgDateLcl).format("YYYY-MM-DD")
            : arr
            ? dayjs(arr.orgDateLcl).format("YYYY-MM-DD")
            : "", // 運行基準日
        dateFrom: dep && arr ? dayjs(arr.orgDateLcl).format("YYYY-MM-DD") : "", // 対象開始日付
        ship: fisRow.shipNo, // 航空機登録記号
      };

      void dispatch(openFlightListModal({ flightListKeys }));
      void dispatch(getFlightList(flightListKeys));
    }
  };

  const handleClickPaxBox = (isDep: boolean) => {
    const flight = isDep ? fisRow.dep : fisRow.arr;
    if (!oalPaxEnabled || !flight || !flight.isOal || isDivAtbOrgApoWork) return;

    const flightKey = {
      orgDateLcl: flight.orgDateLcl,
      alCd: flight.alCd,
      fltNo: flight.fltNo,
      casFltNo: flight.casFltNo || "",
      skdDepApoCd: flight.skdDepApoCd,
      skdArrApoCd: flight.skdArrApoCd,
      skdLegSno: flight.skdLegSno,
    };
    void dispatch(openOalPaxModal(flightKey));
  };

  const handleClickPaxStatusBox = (forcusInputName: ForcusInputName) => {
    if (!oalPaxStatusEnabled || !fisRow.dep || !fisRow.dep.isOal || fisRow.isCancel) return;

    const flightKey = {
      orgDateLcl: fisRow.dep.orgDateLcl,
      alCd: fisRow.dep.alCd,
      fltNo: fisRow.dep.fltNo,
      casFltNo: fisRow.dep.casFltNo || "",
      skdDepApoCd: fisRow.dep.skdDepApoCd,
      skdArrApoCd: fisRow.dep.skdArrApoCd,
      skdLegSno: fisRow.dep.skdLegSno,
    };
    void dispatch(openOalPaxStatusModal({ forcusInputName, flightKey }));
  };

  const handleClickOalFuelModal = () => {
    if (fisRow.isCancel || !oalFuelEnabled) return;
    const { dep } = fisRow;
    if (!dep || !dep.isOal) return;

    const flightKey = {
      orgDateLcl: dep.orgDateLcl,
      alCd: dep.alCd,
      fltNo: dep.fltNo,
      casFltNo: dep.casFltNo || "",
      skdDepApoCd: dep.skdDepApoCd,
      skdArrApoCd: dep.skdArrApoCd,
      skdLegSno: dep.skdLegSno,
    };
    void dispatch(openOalFuelModal(flightKey));
  };

  const handleFlightDetailList = (isDep: boolean) => () => {
    if (!flightDetailEnabled) return;

    const flight = isDep ? fisRow.dep : fisRow.arr;
    if (!flight) return;

    const flightKey = {
      myApoCd: selectedApoCd,
      orgDateLcl: flight.orgDateLcl,
      alCd: flight.alCd,
      fltNo: flight.fltNo,
      casFltNo: flight.casFltNo,
      skdDepApoCd: flight.skdDepApoCd,
      skdArrApoCd: flight.skdArrApoCd,
      skdLegSno: flight.skdLegSno,
      oalTblFlg: flight.isOal,
    };
    const posRight = !isDep;
    const tabName = "Detail";
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(fetchFlightDetail({ flightKey }));
  };

  const handleClickSpotNumber = () => {
    if (!spotNoEnabled || fisRow.isCancel || isDivAtbOrgApoWork) return;
    void dispatch(openSpotNumberChild({ seq: fisRow.arrDepCtrl.seq, isModal: true, dispRangeFromLcl, dispRangeToLcl }));
  };

  const handleStationOperationTaskList = () => {
    if (!stationOperationTaskEnabled || !fisRow.dep) {
      return;
    }
    if (!stationOperationTaskEnabled || !fisRow.dep) {
      return;
    }

    const flightKey = {
      myApoCd: selectedApoCd,
      orgDateLcl: fisRow.dep.orgDateLcl,
      alCd: fisRow.dep.alCd,
      fltNo: fisRow.dep.fltNo,
      casFltNo: fisRow.dep.casFltNo,
      skdDepApoCd: fisRow.dep.skdDepApoCd,
      skdArrApoCd: fisRow.dep.skdArrApoCd,
      skdLegSno: fisRow.dep.skdLegSno,
      oalTblFlg: fisRow.dep.isOal,
    };

    const posRight = false;
    const tabName = "Task";
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(fetchStationOperationTask({ flightKey }));
  };

  const handleFlightMovementOnSingleOrDoubleClick = (isDep: boolean) => {
    mvtClickCountRef.current += 1;
    if (mvtClickCountRef.current < 2) {
      setTimeout(() => {
        if (mvtClickCountRef.current > 1) {
          if (!fisRow.isCancel && !isDivAtbOrgApoWork) {
            handleMvtMsgModal(isDep);
          }
        } else if (!isDivAtbOrgApoWork) {
          handleFlightMovement(isDep);
        }
        mvtClickCountRef.current = 0;
      }, 350);
    }
  };

  const handleFlightMovement = (isDep: boolean) => {
    if (!flightMovementEnabled) return;

    const flight = isDep ? fisRow.dep : fisRow.arr;
    if (!flight) return;

    const legKey: CommonFlightInfo.Legkey = {
      orgDateLcl: flight.orgDateLcl,
      alCd: flight.alCd,
      fltNo: flight.fltNo,
      casFltNo: flight.casFltNo || "",
      skdDepApoCd: flight.skdDepApoCd,
      skdArrApoCd: flight.skdArrApoCd,
      skdLegSno: flight.skdLegSno,
    };
    void dispatch(openFlightMovementModal({ legKey, isDep }));
  };

  const handleMvtMsgModal = (isDep: boolean) => {
    if (!mvtMsgEnabled) return;

    const flight = isDep ? fisRow.dep : fisRow.arr;
    if (!flight) return;
    if (flight.isOal) return;

    const legKey: MvtMsgApi.LegKey = {
      orgDateLcl: flight.orgDateLcl,
      alCd: flight.alCd,
      fltNo: flight.fltNo,
      skdDepApoCd: flight.skdDepApoCd,
      skdArrApoCd: flight.skdArrApoCd,
      skdLegSno: flight.skdLegSno,
    };
    void dispatch(openMvtMsgModal({ legKey }));
  };

  const handleMultipleFlightMovement = (isDep: boolean) => {
    const flight = isDep ? fisRow.dep : fisRow.arr;
    if (isMySchedule) return;
    if (!flight) return;
    if (!fisRow.isCancel && !isDivAtbOrgApoWork && multipleFlightMovementEnabled && timeDiffUtc !== null) {
      const legKey: CommonFlightInfo.Legkey = {
        orgDateLcl: flight.orgDateLcl,
        alCd: flight.alCd,
        fltNo: flight.fltNo,
        casFltNo: flight.casFltNo || "",
        skdDepApoCd: flight.skdDepApoCd,
        skdArrApoCd: flight.skdArrApoCd,
        skdLegSno: flight.skdLegSno,
      };
      dispatch(openMultipleFlightMovement({ apoCd: selectedApoCd, timeDiffUtc, legKey, isDep }));
    }
  };

  const handleOnSingleOrDoubleClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current < 2) {
      setTimeout(() => {
        if (clickCountRef.current > 1) {
          if (isArrDepOal && !fisRow.isCancel && !isDivAtbOrgApoWork) {
            handleOpenOalAircraftModal();
          }
        } else if (fisRow.shipNo && !fisRow.isCancel && !isDivAtbOrgApoWork) {
          handleFlightListModal();
        }
        clickCountRef.current = 0;
      }, 350);
    }
  };

  const handleOpenOalAircraftModal = () => {
    if (!oalAircraftEnabled) return;
    const { seq } = fisRow.arrDepCtrl;
    void dispatch(openOalAircraftModal({ seq, dispRangeFromLcl, dispRangeToLcl }));
  };

  const handleEditRmksPopUp = (isDep: boolean) => () => {
    if (flightRmksEnabled) {
      const flight = isDep ? fisRow.dep : fisRow.arr;
      if (isDivAtbOrgApoWork) return;

      const width = 380;
      let top: number;
      if (isMySchedule) {
        top = isPc ? window.innerHeight - 239 - 150 : 100;
      } else {
        top = isPc ? 0 : 100;
      }
      let left = 0;

      if (isDep) {
        const nodeRmksText = depRmksTextRef.current;
        if (nodeRmksText) {
          left = (nodeRmksText.getBoundingClientRect().right * props.zoomFis) / 100 - width;
        }
      } else {
        const nodeRmksText = arrRmksTextRef.current;
        if (nodeRmksText) {
          left = (nodeRmksText.getBoundingClientRect().left * props.zoomFis) / 100;
        }
      }

      if (flight) {
        const flightDetailKey: FlightDetailKey = {
          myApoCd: selectedApoCd,
          orgDateLcl: flight.orgDateLcl,
          alCd: flight.alCd,
          fltNo: flight.fltNo,
          casFltNo: flight.casFltNo,
          skdDepApoCd: flight.skdDepApoCd,
          skdArrApoCd: flight.skdArrApoCd,
          skdLegSno: flight.skdLegSno,
          oalTblFlg: flight.isOal,
        };
        void dispatch(
          openEditRmksPopup({
            flightDetailKey,
            mode: isDep ? "DEP" : "ARR",
            position: {
              width,
              top,
              left,
            },
          })
        );
      }
    }
  };

  const planeElement = useMemo(() => {
    const isAnimation = fisRow.arrFisFltSts === "APP";
    const PlaneIcon = isDarkMode ? (isAnimation ? PlaneDarkA : PlaneDark) : isAnimation ? PlaneA : Plane;
    return (
      <PlaneIconBox isPc={isPc}>
        <PlaneIcon />
      </PlaneIconBox>
    );
  }, [fisRow.arrFisFltSts, isDarkMode, isPc]);

  const arrDlyInfoText = useMemo((): string => {
    const dlyList: string[] = [];
    fisRow.arrDlyInfo.slice(0, 3).forEach((dlyInfo) => {
      if (typeof dlyInfo?.arrDlyTime === "number") {
        dlyList.push(`${padding0(dlyInfo.arrDlyTime.toString(), 4)}${dlyInfo.arrDlyRsnCd ?? ""}`);
      }
    });
    return dlyList.join("/");
  }, [fisRow.arrDlyInfo]);

  const depDlyInfoText = useMemo((): string => {
    const dlyList: string[] = [];
    fisRow.depDlyInfo.slice(0, 3).forEach((dlyInfo) => {
      if (typeof dlyInfo?.depDlyTime === "number") {
        dlyList.push(`${padding0(dlyInfo.depDlyTime.toString(), 4)}${dlyInfo.depDlyRsnCd ?? ""}`);
      }
    });
    return dlyList.join("/");
  }, [fisRow.depDlyInfo]);

  const isSpcAccent = (spcUpdateTime: dayjs.Dayjs | null) => {
    if (spcUpdateTime && presentTime && presentTime.diff(spcUpdateTime, "minute", true) <= 10) {
      return true;
    }
    return false;
  };

  const isSpotNoAccent = () => {
    const spcUpdateTime =
      !fisRow.depSpecialStsSpcUpdateTime || fisRow.depSpecialStsSpcUpdateTime.isBefore(fisRow.arrSpecialStsSpcUpdateTime)
        ? fisRow.arrSpecialStsSpcUpdateTime
        : fisRow.depSpecialStsSpcUpdateTime;
    if (
      !fisRow.isCancel &&
      !fisRow.isDivAtbOrgApo &&
      spcUpdateTime &&
      presentTime &&
      presentTime.diff(spcUpdateTime, "minute", true) <= 10
    ) {
      return true;
    }
    return false;
  };

  return (
    <FlightRow
      isPc={isPc}
      isMask={fisRow.isMask}
      isSortArrival={isSortArrival}
      isSortTwoColumnMode={isSortTwoColumnMode}
      doAnimation={props.doAnimation}
    >
      <div
        className={
          isSortArrival && isSortTwoColumnMode ? "flightContentLong" : isSortTwoColumnMode ? "flightContentHide" : "flightContentArr"
        }
      >
        {fisRow.arr ? (
          <Arrival isPc={isPc}>
            {(isPc || isSortTwoColumnMode) && (
              <>
                {isMySchedule ? (
                  <RmksContainerOriginal
                    ref={arrRmksTextRef}
                    isPc={isPc}
                    isSortTwoColumnMode={isSortTwoColumnMode}
                    flightRmksEnabled={flightRmksEnabled && !isDivAtbOrgApoWork}
                    onClick={handleEditRmksPopUp(false)}
                  >
                    <div>{fisRow.arrRmksText_label}</div>
                    <div>{fisRow.arrRmksText}</div>
                  </RmksContainerOriginal>
                ) : (
                  <RmksColumn isPc={isPc} isSortTwoColumnMode={isSortTwoColumnMode}>
                    <RmksContainer
                      ref={arrRmksTextRef}
                      flightRmksEnabled={flightRmksEnabled && !isDivAtbOrgApoWork}
                      onClick={handleEditRmksPopUp(false)}
                    >
                      <div>{fisRow.arrRmksText}</div>
                    </RmksContainer>
                    <DlyInfo>{arrDlyInfoText}</DlyInfo>
                  </RmksColumn>
                )}
                <SpaceBoxWide adjustWidth={isSortTwoColumnMode ? -16 : 0} />
              </>
            )}
            <TimeColumn
              isPc={isPc}
              isArr
              isSortTwoColumnMode={isSortTwoColumnMode}
              paxBoxClickable={oalPaxEnabled && fisRow.arr && fisRow.arr.isOal && !isDivAtbOrgApoWork}
            >
              <div>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div className="PaxBox" onClick={() => handleClickPaxBox(false)} onKeyUp={() => {}}>
                  {fisRow.arr.isOal && fisRow.arrRefPaxTtlCnt === null ? (
                    <ClickableLabel className="PaxLabel" isPc={isPc}>
                      PAX
                    </ClickableLabel>
                  ) : (
                    <>
                      <div>{fisRow.arrRefPaxTtlCnt_label}</div>
                      <div>{fisRow.arrRefPaxTtlCnt}</div>
                    </>
                  )}
                </div>
                <SpaceBox />
                <TimeArea
                  enabled={
                    (!isDivAtbOrgApoWork && flightMovementEnabled) ||
                    (!fisRow.arr.isOal && !fisRow.isCancel && !isDivAtbOrgApoWork && mvtMsgEnabled) ||
                    (!fisRow.isCancel && !isDivAtbOrgApoWork && !isMySchedule && multipleFlightMovementEnabled)
                  }
                  onClick={() => handleFlightMovementOnSingleOrDoubleClick(false)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleMultipleFlightMovement(false);
                  }}
                >
                  <div className="TimeBox">
                    <div>{fisRow.arrStaLcl && "STA"}</div>
                    <div>{fisRow.arrStaLcl}</div>
                  </div>
                  <SpaceBox />
                  <div className="TimeBox">
                    <div>
                      {fisRow.arrEtaLdLcl_label}
                      {fisRow.arrEtaCd && (
                        <Tetantive isPc={isPc} isDarkMode={isDarkMode}>
                          {fisRow.arrEtaCd}
                        </Tetantive>
                      )}
                    </div>
                    <div>{fisRow.arrEtaLdLcl}</div>
                  </div>
                  <SpaceBox />
                  <div className="TimeBox">
                    <div>{fisRow.arrAtaLcl && "ATA"}</div>
                    <div>{fisRow.arrAtaLcl || (fisRow.arrInFltSign && planeElement)}</div>
                  </div>
                </TimeArea>
              </div>
              <SpecialStatuses
                specialStses={fisRow.arrSpecialStsesData}
                arrDepCd="ARR"
                width={isPc ? "214px" : "224"}
                isPc={isPc}
                isDarkMode={isDarkMode}
                isSpcAccent={isSpcAccent(fisRow.arrSpecialStsSpcUpdateTime)}
              />
            </TimeColumn>
            <BasicInfoColumn isPc={isPc} isArr enabled={flightDetailEnabled} onClick={handleFlightDetailList(false)}>
              <FltStsContainer>
                {fisRow.arrRmksText ? isDarkMode ? <RemarksIconDark /> : <RemarksIcon /> : <NonRemarksIcon />}
                {acarsStatus ? (
                  <AcarsStsLabel isVisible={fisRow.arrAcarsFlg} isWindowsFlag={isWindowsFlag}>
                    {acarsStatus}
                  </AcarsStsLabel>
                ) : (
                  <AcarsStsLabel isVisible={false} isWindowsFlag={isWindowsFlag} />
                )}
                {fisRow.arrFisFltSts ? (
                  <FisFltStsLabelBox isDep={false}>
                    <FisFltStsLabel isPc={isPc} isDarkMode={isDarkMode}>
                      {fisRow.arrFisFltSts}
                    </FisFltStsLabel>
                  </FisFltStsLabelBox>
                ) : (
                  <NonFltSts />
                )}
              </FltStsContainer>
              <AirLineCode isPc={isPc} casFltNo={fisRow.arrCasFltNo || ""}>
                {fisRow.arrCasFltNo ? (
                  <span className="casFltNo">{fisRow.arrCasFltNo}</span>
                ) : (
                  <>
                    <span>{fisRow.arrAlCd}</span>
                    {fisRow.arrFltNo}
                  </>
                )}
                {fisRow.arrCsSign && <CsSign />}
              </AirLineCode>
              <ApoInfo isPc={isPc} isDarkMode={isDarkMode} isDep={false}>
                <div className="om">{fisRow.arrOmAlCd}</div>
                <div className="apo">{fisRow.arrOrgApoCd}</div>
              </ApoInfo>
            </BasicInfoColumn>
          </Arrival>
        ) : (
          !!fisRow.arrFromCat && (
            <FromNextInfo>
              {fisRow.arrFromCat > 0 && (
                <div>
                  {`From ${fisRow.arrFromCasFltNo ? fisRow.arrFromCasFltNo : fisRow.arrFromAlCd + fisRow.arrFromFltNo}${
                    fisRow.arrFromDateLcl ? `/${fisRow.arrFromDateLcl}` : ""
                  }`}
                </div>
              )}
              {fisRow.arrFromCat === 2 && <CrossIcon />}
              {fisRow.arrFromCat === -1 && <div>CNX Not Decided</div>}
            </FromNextInfo>
          )
        )}
      </div>

      <div className="stationOperationContent">
        <StatusBoundaryLeft color={arrStsColor} />
        <StationOperation
          isPc={isPc}
          stationOperationShipEnabled={
            (fisRow.shipNo && !fisRow.isCancel && !isDivAtbOrgApoWork && flightListEnabled) ||
            (!fisRow.isCancel && !isDivAtbOrgApoWork && isArrDepOal && oalAircraftEnabled)
          }
          stationOperationTaskEnabled={stationOperationTaskEnabled && fisRow.gndWorkStepFlg}
          paxStatusClickable={oalPaxStatusEnabled && fisRow.dep && fisRow.dep.isOal && !fisRow.isCancel}
          stationOperationSpotEnabled={spotNoEnabled && !fisRow.isCancel && !isDivAtbOrgApoWork}
          oalFuelClickable={oalFuelEnabled && fisRow.dep && fisRow.dep.isOal && !fisRow.isCancel}
        >
          <div className="stationOperationSpot">
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <SpotNoLabel onClick={handleClickSpotNumber} onKeyUp={() => {}} isDarkMode={isDarkMode} isAccent={isSpotNoAccent()}>
              {fisRow.gndSpotNo}
            </SpotNoLabel>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div className="stationOperationGate" onClick={() => handleClickPaxStatusBox("depGateNo")} onKeyUp={() => {}}>
              <span>{fisRow.gndDepGateNo_label}</span>
              {fisRow.gndDepGateNo}
            </div>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div className="stationOperationShip stationOperationBox" onClick={() => handleOnSingleOrDoubleClick()} onKeyUp={() => {}}>
            <div>
              {fisRow.gndShipNo1 && <span>{fisRow.gndShipNo1}</span>}
              {fisRow.gndShipNo2}
            </div>
            <div>
              {fisRow.gndSeatConfCd}
              {fisRow.gndWingletFlg && <BladeIcon />}
            </div>
          </div>
          <div className="stationOperationStatusFuelBox">
            <div className="stationOperationStatus">
              {fisRow.dep && fisRow.dep.isOal && !fisRow.gndAcceptanceSts && !fisRow.gndBoardingSts ? (
                <>
                  <ClickableLabel
                    className="AcceptanceSts StatusLabel"
                    isPc={isPc}
                    onClick={() => handleClickPaxStatusBox("acceptanceSts")}
                  >
                    Status
                  </ClickableLabel>
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div className="BoardingSts StatusLabel" onClick={() => handleClickPaxStatusBox("boardingSts")} onKeyUp={() => {}} />
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div className="AcceptanceSts" onClick={() => handleClickPaxStatusBox("acceptanceSts")} onKeyUp={() => {}}>
                    {fisRow.gndAcceptanceSts}
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div className="BoardingSts" onClick={() => handleClickPaxStatusBox("boardingSts")} onKeyUp={() => {}}>
                    {fisRow.gndBoardingSts}
                  </div>
                </>
              )}
              <div className="LsFlg">{fisRow.gndLsFlg && "WB"}</div>
            </div>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div className="stationOperationFuel" onClick={handleClickOalFuelModal} onKeyUp={() => {}}>
              {fisRow.dep && fisRow.dep.isOal && !fisRow.gndRampFuelLbsWt ? (
                <ClickableLabel isPc={isPc}>Fuel</ClickableLabel>
              ) : (
                <>
                  {fisRow.gndRampFuelLbsWt && <span>Fuel</span>}
                  {fisRow.gndRampFuelLbsWt}
                  {fisRow.gndRampFuelLbsWt && fisRow.gndFuelOrderFlg && (
                    <SquareS isPc={isPc} isDarkMode={isDarkMode}>
                      S
                    </SquareS>
                  )}
                </>
              )}
            </div>
          </div>
          {fisRow.gndWorkStepFlg ? (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div className="stationOperationTask stationOperationBox" onClick={handleStationOperationTaskList} onKeyUp={() => {}}>
              <div>{fisRow.gndLstTaskSts}</div>
              {fisRow.dgtShortFlg ? (
                <ExcessTimeBox isPc={isPc} isDarkMode={isDarkMode}>
                  <ExcessTimeContainer time={fisRow.estGndTime} />
                </ExcessTimeBox>
              ) : (
                <div>{fisRow.estGndTime}</div>
              )}
            </div>
          ) : (
            <div className="stationOperationTask" />
          )}
        </StationOperation>
        <StatusBoundaryRight color={depStsColor} />
      </div>

      <div
        className={
          !isSortArrival && isSortTwoColumnMode ? "flightContentLong" : isSortTwoColumnMode ? "flightContentHide" : "flightContentDep"
        }
      >
        {fisRow.dep ? (
          <Departure isPc={isPc}>
            <BasicInfoColumn isPc={isPc} isArr={false} enabled={flightDetailEnabled} onClick={handleFlightDetailList(true)}>
              <FltStsContainer>
                {fisRow.depFisFltSts ? (
                  <FisFltStsLabelBox isDep>
                    <FisFltStsLabel isPc={isPc} isDarkMode={isDarkMode}>
                      {fisRow.depFisFltSts}
                    </FisFltStsLabel>
                  </FisFltStsLabelBox>
                ) : (
                  <NonFltSts />
                )}
                {acarsStatus ? (
                  <AcarsStsLabel isVisible={fisRow.depAcarsFlg} isWindowsFlag={isWindowsFlag}>
                    {acarsStatus}
                  </AcarsStsLabel>
                ) : (
                  <AcarsStsLabel isVisible={false} isWindowsFlag={isWindowsFlag} />
                )}
                {fisRow.depRmksText && (isDarkMode ? <RemarksIconDark /> : <RemarksIcon />)}
              </FltStsContainer>
              <AirLineCode isPc={isPc} casFltNo={fisRow.depCasFltNo || ""}>
                {fisRow.depCasFltNo ? (
                  <span className="casFltNo">{fisRow.depCasFltNo}</span>
                ) : (
                  <>
                    <span>{fisRow.depAlCd}</span>
                    {fisRow.depFltNo}
                  </>
                )}
                {fisRow.depCsSign && <CsSign />}
              </AirLineCode>
              <ApoInfo isPc={isPc} isDarkMode={isDarkMode} isDep>
                <div className="apo">{fisRow.depDstApoCd}</div>
                <div className="om">{fisRow.depOmAlCd}</div>
              </ApoInfo>
            </BasicInfoColumn>
            <TimeColumn
              isPc={isPc}
              isArr={false}
              isSortTwoColumnMode={isSortTwoColumnMode}
              paxBoxClickable={oalPaxEnabled && fisRow.dep && fisRow.dep.isOal}
            >
              <div>
                <TimeArea
                  enabled={
                    flightMovementEnabled ||
                    (!fisRow.dep.isOal && !fisRow.isCancel && mvtMsgEnabled) ||
                    (!fisRow.isCancel && multipleFlightMovementEnabled)
                  }
                  onClick={() => handleFlightMovementOnSingleOrDoubleClick(true)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleMultipleFlightMovement(true);
                  }}
                >
                  <div className="TimeBox">
                    <div>{fisRow.depStdLcl ? "STD" : ""}</div>
                    <div>{fisRow.depStdLcl}</div>
                  </div>
                  <SpaceBox />
                  <div className="TimeBox">
                    <div>
                      {fisRow.depEtdAtdLcl_label}
                      {fisRow.depEtdCd && (
                        <Tetantive isPc={isPc} isDarkMode={isDarkMode}>
                          {fisRow.depEtdCd}
                        </Tetantive>
                      )}
                    </div>
                    <div>{fisRow.depEtdAtdLcl}</div>
                  </div>
                  <SpaceBox />
                  <div className="TimeBox">
                    <div>{fisRow.depToLcl && "T/O"}</div>
                    <div>{fisRow.depToLcl}</div>
                  </div>
                </TimeArea>
                <SpaceBox />
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div className="PaxBox" onClick={() => handleClickPaxBox(true)} onKeyUp={() => {}}>
                  {fisRow.dep.isOal && fisRow.depRefPaxTtlCnt === null ? (
                    <ClickableLabel className="PaxLabel" isPc={isPc}>
                      PAX
                    </ClickableLabel>
                  ) : (
                    <>
                      <div>{fisRow.depRefPaxTtlCnt_label}</div>
                      <div>{fisRow.depRefPaxTtlCnt}</div>
                    </>
                  )}
                </div>
              </div>
              <SpecialStatuses
                specialStses={fisRow.depSpecialStsesData}
                arrDepCd="DEP"
                width={isPc ? "214px" : "224px"}
                isPc={isPc}
                isDarkMode={isDarkMode}
                isSpcAccent={isSpcAccent(fisRow.depSpecialStsSpcUpdateTime)}
              />
            </TimeColumn>
            {(isPc || isSortTwoColumnMode) && (
              <>
                <SpaceBoxWide adjustWidth={isSortTwoColumnMode ? -16 : 0} />
                {isMySchedule ? (
                  <RmksContainerOriginal
                    ref={depRmksTextRef}
                    isPc={isPc}
                    isSortTwoColumnMode={isSortTwoColumnMode}
                    flightRmksEnabled={flightRmksEnabled}
                    onClick={handleEditRmksPopUp(true)}
                  >
                    <div>{fisRow.depRmksText_label}</div>
                    <div>{fisRow.depRmksText}</div>
                  </RmksContainerOriginal>
                ) : (
                  <RmksColumn isPc={isPc} isSortTwoColumnMode={isSortTwoColumnMode}>
                    <RmksContainer ref={depRmksTextRef} flightRmksEnabled={flightRmksEnabled} onClick={handleEditRmksPopUp(true)}>
                      <div>{fisRow.depRmksText}</div>
                    </RmksContainer>
                    <DlyInfo>{depDlyInfoText}</DlyInfo>
                  </RmksColumn>
                )}
              </>
            )}
          </Departure>
        ) : (
          !!fisRow.depNextCat && (
            <FromNextInfo>
              {fisRow.depNextCat > 0 && (
                <div>
                  {`Next ${fisRow.depNextCasFltNo ? fisRow.depNextCasFltNo : fisRow.depNextAlCd + fisRow.depNextFltNo}${
                    fisRow.depNextDateLcl ? `/${fisRow.depNextDateLcl}` : ""
                  }`}
                </div>
              )}
              {fisRow.depNextCat === 2 && <CrossIcon />}
              {fisRow.depNextCat === -1 && <div>CNX Not Decided</div>}
            </FromNextInfo>
          )
        )}
      </div>
    </FlightRow>
  );
};

const SpaceBox = styled.div`
  min-width: 14px;
  height: 100%;
`;

const SpaceBoxWide = styled.div<{ adjustWidth: number }>`
  min-width: ${({ adjustWidth }) => `${26 + adjustWidth}px`};
  height: 100%;
`;

const showFlightContentFromHide = keyframes`
  0%   { width: 0; max-width: 0; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;

const showFlightContentFromLong = keyframes`
  0%   { width: 66%; max-width: 100%; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;

const longFlightContent = keyframes`
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 66%; max-width: 100%; overflow: hidden; }
`;

const hideFlightContent = keyframes`
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 0; max-width: 0; overflow: hidden; }
`;

const FlightRow = styled.div<{
  isPc: boolean;
  isMask: boolean;
  isSortArrival: boolean;
  isSortTwoColumnMode: boolean;
  doAnimation: boolean;
}>`
  height: ${({ isPc }) => (isPc ? "86px" : "88px")};
  max-width: ${Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
  background: ${({ theme }) => theme.color.fis.row.background};
  display: flex;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};

  > div {
    opacity: ${({ isMask }) => (isMask ? 0.42 : 1)};
  }
  .flightContentArr {
    ${({ isPc }) => (isPc ? "width: calc((100% - 352px) /2);" : "width: 33%;")};
    ${({ doAnimation, isSortArrival }) =>
      doAnimation
        ? css`
            animation: ${isSortArrival ? showFlightContentFromLong : showFlightContentFromHide} 0.3s;
          `
        : ""}
  }
  .flightContentDep {
    ${({ isPc }) => (isPc ? "width: calc((100% - 352px) /2);" : "width: 33%;")};
    ${({ doAnimation, isSortArrival }) =>
      doAnimation
        ? css`
            animation: ${!isSortArrival ? showFlightContentFromLong : showFlightContentFromHide} 0.3s;
          `
        : ""}
  }
  .flightContentLong {
    width: 66%;
    ${({ doAnimation }) =>
      doAnimation
        ? css`
            animation: ${longFlightContent} 0.3s;
          `
        : ""}
  }
  .flightContentHide {
    max-width: 0;
    overflow: hidden;
    ${({ doAnimation }) =>
      doAnimation
        ? css`
            animation: ${hideFlightContent} 0.3s;
          `
        : ""}
  }
  .stationOperationContent {
    width: ${({ isPc }) => (isPc ? "352px" : "34%")};
    padding: 0;
    margin: 0;
    opacity: ${({ isMask }) => (isMask ? 0.42 : 1)};
    max-width: ${({ isPc }) => (isPc ? "352px" : "")};
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }
`;

const Arrival = styled.div<{ isPc: boolean }>`
  padding-top: ${({ isPc }) => (isPc ? "8px" : "10px")};
  padding-right: 12px;
  padding-left: 10px;
  display: flex;
  justify-content: flex-end;
`;

const Departure = styled.div<{ isPc: boolean }>`
  padding-top: ${({ isPc }) => (isPc ? "8px" : "10px")};
  padding-right: 10px;
  padding-left: 12px;
  display: flex;
  justify-content: flex-start;
`;

const RmksColumn = styled.div<{ isPc: boolean; isSortTwoColumnMode: boolean }>`
  height: 73px;
  width: 100%;
  display: ${({ isSortTwoColumnMode }) => (isSortTwoColumnMode ? "flex" : "none")};
  ${media.greaterThan("desktopM")`display: flex;`}
  flex-direction: column;
  justify-content: space-between;
`;

const RmksContainer = styled.div<{ flightRmksEnabled: boolean }>`
  flex: 1 1 auto;
  width: 100%;
  cursor: ${({ flightRmksEnabled }) => (flightRmksEnabled ? "pointer" : "auto")};
  > div {
    word-break: break-word;
    font-size: 15px;
    line-height: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    white-space: normal;
    overflow: hidden;
  }
`;

const DlyInfo = styled.div`
  width: 100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 18px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: normal;
  overflow: hidden;
`;

const RmksContainerOriginal = styled.div<{ isPc: boolean; isSortTwoColumnMode: boolean; flightRmksEnabled: boolean }>`
  height: 61px;
  width: 100%;
  word-break: break-word;
  cursor: ${({ flightRmksEnabled }) => (flightRmksEnabled ? "pointer" : "auto")};
  display: ${({ isSortTwoColumnMode }) => (isSortTwoColumnMode ? "block" : "none")};
  ${media.greaterThan("desktopM")`display: block;`}

  > div:first-child {
    font-size: ${({ isPc }) => (isPc ? "10px" : "12px")};
    margin-top: ${({ isPc }) => (isPc ? "4px" : "2px")};
    margin-bottom: 4px;
  }
  > div:last-child {
    font-size: ${({ isPc }) => (isPc ? "14px" : "14px")};
    line-height: 1.2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    white-space: normal;
    height: ${({ isPc }) => (isPc ? "48px" : "48px")};
    overflow: hidden;
  }
`;

const TimeColumn = styled.div<{ isPc: boolean; isArr: boolean; isSortTwoColumnMode: boolean; paxBoxClickable: boolean }>`
  height: ${({ isPc }) => (isPc ? "68px" : "72px")};
  min-width: ${({ isPc, isSortTwoColumnMode }) => (isPc ? "212px" : isSortTwoColumnMode ? "226px" : "226px")};
  flex-direction: column;
  justify-content: flex-end;
  ${({ isPc, isArr, isSortTwoColumnMode }) =>
    !isPc && isArr
      ? isSortTwoColumnMode
        ? "position:relative; left:12px;"
        : "position:relative; left:10px;"
      : ""}; /* iPadの場合は、空間が空きすぎるので左側を右にずらす */
  > div:first-child {
    display: flex;
    height: 46px;
    padding-top: ${({ isPc }) => (isPc ? "4px" : "0px")};
  }
  .TimeBox,
  .PaxBox {
    > div:first-child {
      display: flex;
      align-items: center;
      font-size: ${({ isPc }) => (isPc ? "10px" : "12px")};
      height: ${({ isPc }) => (isPc ? "18px" : "20px")};
    }
    > div:last-child {
      margin-top: 1px;
      font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
    }
  }
  .TimeBox {
    width: ${({ isPc }) => (isPc ? "42px" : "45px")};
    min-width: ${({ isPc }) => (isPc ? "42px" : "45px")};
  }
  .PaxBox {
    width: ${({ isPc }) => (isPc ? "32px" : "35px")};
    min-width: ${({ isPc }) => (isPc ? "32px" : "35px")};
    cursor: ${({ paxBoxClickable }) => (paxBoxClickable ? "pointer" : "auto")};
    > .PaxLabel {
      pointer-events: none;
      position: relative;
      top: 50%;
    }
  }
`;

const TimeArea = styled.div<{ enabled: boolean }>`
  display: flex;
  width: 100%;
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
  user-select: none;
`;

const ClickableLabel = styled.div<{ isPc: boolean }>`
  color: ${({ theme }) => `${theme.color.fis.row.clickableLabel.color}`} !important;
  font-size: 13px !important;
  font-weight: ${({ isPc }) => (isPc ? "600" : "normal")} !important;
  width: 35px;
`;

const BasicInfoColumn = styled.div<{ isPc: boolean; isArr: boolean; enabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isArr }) => (isArr ? "flex-end" : "flex-start")};
  min-width: ${({ isPc }) => (isPc ? "104px" : "98px")};
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
  > div::nth-child(3) {
    font-size: 50px;
    height: 19px;
    border: thin solid #0f0;
  }
  > div:last-child {
    font-size: ${({ isPc }) => (isPc ? "16px" : "17px")};
    height: 19px;
  }
`;

const FltStsContainer = styled.div`
  display: flex;
  min-width: 50px;
  min-height: 22px;
  align-items: center;
  > *:first-child {
    margin-right: 3px;
  }
`;

const FisFltStsLabelBox = styled.div<{ isDep: boolean }>`
  display: flex;
  width: 49px;
  > div:first-child {
    ${({ isDep }) => `${isDep ? "margin-right: auto" : "margin-left: auto"}`};
  }
`;

const NonFltSts = styled.div`
  width: 49px;
  height: 20px;
`;

const AirLineCode = styled.div<{ isPc: boolean; casFltNo: string }>`
  position: relative;
  top: 2px;
  font-size: ${({ isPc }) => (isPc ? "26px" : "28px")};
  height: 33px;
  line-height: 33px;
  display: flex;
  align-items: center;
  span:first-of-type {
    margin-top: ${({ isPc }) => (isPc ? "6px" : "9px")};
    font-size: ${({ isPc }) => (isPc ? "16px" : "17px")};
  }
  img {
    width: 8px;
    height: 8px;
    margin: 0 2px;
  }
  span.casFltNo {
    margin-top: 0;
    font-size: ${({ isPc, casFltNo }) =>
      isPc
        ? casFltNo.length > 8
          ? "12px"
          : casFltNo.length > 6
          ? "14px"
          : "22px"
        : casFltNo.length > 8
        ? "13px"
        : casFltNo.length > 6
        ? "15px"
        : "23px"};
  }
`;

const ApoInfo = styled.div<{ isPc: boolean; isDarkMode: boolean; isDep: boolean }>`
  display: flex;
  justify-content: ${({ isDep }) => (isDep ? "flex-start" : "flex-end")};
  align-items: baseline;
  .apo {
    min-width: 48px;
    text-align: ${({ isDep }) => (isDep ? "left" : "right")};
  }
  .om {
    margin: 0 2px 0 0;
    font-size: ${({ isPc }) => (isPc ? "14px" : "15px")};
    font-style: oblique;
    font-weight: 600;
    font-family: ${({ isPc }) =>
      isPc ? "'メイリオ', meiryo, Avenir, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', sans-serif" : "inherit"};
    -webkit-text-stroke: ${({ isPc, isDarkMode }) => (isPc ? (isDarkMode ? "0.2px" : "0.5px") : "0")};
  }
`;

const StatusBoundaryLeft = styled.div<{ color: string }>`
  min-width: 6px;
  background-color: ${({ color }) => color || "none"};
  border-left: ${({ color, theme }) => (color ? "0px" : `2px solid ${theme.color.fis.row.box.background}`)};
  box-sizing: border-box;
`;

const StatusBoundaryRight = styled.div<{ color: string }>`
  min-width: 6px;
  background-color: ${({ color }) => color || "none"};
  border-right: ${({ color, theme }) => (color ? "0px" : `2px solid ${theme.color.fis.row.box.background}`)};
  box-sizing: border-box;
`;

const StationOperation = styled.div<{
  isPc: boolean;
  stationOperationShipEnabled: boolean;
  stationOperationTaskEnabled: boolean;
  paxStatusClickable: boolean | null;
  stationOperationSpotEnabled: boolean | null;
  oalFuelClickable: boolean | null;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isPc }) => (isPc ? "0 4px 0 4px" : "0 3px 0 3px")};

  .stationOperationBox {
    padding: 6px 0 0;
    border-radius: 2px;
    background: #fff;
    text-align: center;
    font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
    line-height: 27px;
    background: ${({ theme }) => theme.color.fis.row.box.background};
  }
  .stationOperationShip {
    width: 82px;
    height: 61px;
    padding-top: 8px;
    user-select: none;
    ${({ stationOperationShipEnabled }) =>
      stationOperationShipEnabled
        ? `
        cursor: pointer;
      `
        : `
        cursor: auto;
        &.stationOperationBox {
          box-shadow: none;
        }
    `};
    > div {
      height: 25px;
      line-height: 24px;
    }
    margin-right: ${({ isPc }) => (isPc ? "5px" : "2px")};
    span {
      font-size: ${({ isPc }) => (isPc ? "15px" : "16px")};
    }
  }
  .stationOperationTask {
    min-width: ${({ isPc }) => (isPc ? "61px" : "56px")};
    height: 61px;
    cursor: ${({ stationOperationTaskEnabled }) => (stationOperationTaskEnabled ? "pointer" : "auto")};
    > div {
      height: 25px;
      line-height: 25px;
    }
  }
  .stationOperationSpot,
  .stationOperationStatusFuelBox {
    height: 61px;
    padding-top: 6px;
    font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
    > div {
      height: 27px;
      line-height: 27px;
    }
    > div:last-child {
      align-items: baseline;
    }
    span {
      margin-right: 6px;
      font-size: ${({ isPc }) => (isPc ? "10px" : "12px")};
    }
    > div:nth-child(2) span {
      margin-right: ${({ isPc }) => (isPc ? "3px" : "2px")};
    }
  }
  .stationOperationSpot {
    width: ${({ isPc }) => (isPc ? "68px" : "74px")};
    overflow: visible;
    cursor: ${({ stationOperationSpotEnabled }) => (stationOperationSpotEnabled ? "pointer" : "auto")};
    > div:first-child {
      font-size: ${({ isPc }) => (isPc ? "26px" : "28px")};
    }
  }
  .stationOperationGate,
  .AcceptanceSts,
  .BoardingSts {
    cursor: ${({ paxStatusClickable }) => (paxStatusClickable ? "pointer" : "auto")};
  }
  .stationOperationFuel {
    cursor: ${({ oalFuelClickable }) => (oalFuelClickable ? "pointer" : "auto")};
  }
  .stationOperationStatus {
    min-width: ${({ isPc }) => (isPc ? "112px" : "110px")};
    .StatusLabel {
      &.AcceptanceSts,
      &.BoardingSts {
        height: 100%;
        vertical-align: top;
      }
    }
  }
  .AcceptanceSts,
  .BoardingSts,
  .LsFlg {
    display: inline-block;
    min-width: 35px;
  }
  .AcceptanceSts,
  .BoardingSts {
    margin-right: ${({ isPc }) => (isPc ? "3px" : "2px")};
  }
  .LsFlg {
    margin-right: 1px;
  }
`;

const ExcessTimeBox = styled.div<{ isPc: boolean; isDarkMode: boolean }>`
  ${({ isPc, isDarkMode }) => (isPc ? (isDarkMode ? "font-weight: 600;" : "") : "font-weight: 500;")};
`;

const Tetantive = styled.div<{ isPc: boolean; isDarkMode: boolean }>`
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  top: ${({ isPc }) => (isPc ? "0px" : "-1px")};
  margin-left: 3px;
  padding: ${({ isPc }) => (isPc ? "0.3em 0.35em 0.2em" : "0.25em 0.3em 0.1em")};
  font-weight: 600;
  /* FISステイタス(FisFltStsLabel)のデフォルトと同じ色 */
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFF" : "#000")};
  background-color: ${({ isDarkMode }) => (isDarkMode ? "rgb(57,65,72)" : "rgb(197,197,197)")};
  border-radius: 3px;
`;

const SquareS = styled.div<{ isPc: boolean; isDarkMode: boolean }>`
  display: inline-block;
  padding: ${({ isPc }) => (isPc ? "5px 3px 3px" : "4px 3px 2px")};
  line-height: ${({ isPc }) => (isPc ? "16px" : "18px")};
  text-align: center;
  font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
  font-weight: 600;
  /* FISステイタス(FisFltStsLabel)のデフォルトと同じ色 */
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFF" : "#000")};
  background-color: ${({ isDarkMode }) => (isDarkMode ? "rgb(57,65,72)" : "rgb(197,197,197)")};
  border-radius: 4px;
  margin-left: 3px;
  align-self: center;
`;

const BladeIcon = styled(Blade)`
  width: 11px;
  height: 9px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;

const Plane = styled.img.attrs({ src: planeIcon })``;
const PlaneA = styled.img.attrs({ src: planeAIcon })``;
const PlaneDark = styled.img.attrs({ src: planeDarkIcon })``;
const PlaneDarkA = styled.img.attrs({ src: planeDarkAIcon })``;
const PlaneIconBox = styled.div<{ isPc: boolean }>`
  margin: 0;
  padding: 0;
  img {
    margin-top: ${({ isPc }) => (isPc ? "-4px" : "-8px")};
    width: ${({ isPc }) => (isPc ? "26px" : "31px")};
  }
`;

const FromNextInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CsSign = styled(BaseCsSign)`
  margin-top: 1px;
  width: 8px;
  height: 8px;
  background: #f4f085;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 50%;
  position: absolute;
  right: -10px;
  top: 10px;
`;

const RemarksIcon = styled.img.attrs({ src: remarksIconSvg })`
  width: 18px;
  height: 14px;
`;

const RemarksIconDark = styled.img.attrs({ src: remarksIconDarkSvg })`
  width: 18px;
  height: 14px;
`;

const NonRemarksIcon = styled.div`
  min-width: 18px;
`;

const CrossIcon = styled(Cross).attrs({ viewBox: "0 0 360 360" })`
  height: 30px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;

const AcarsStsLabel = styled.div<{ isVisible: boolean; isWindowsFlag: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  border-radius: 50%;
  border: 1px solid #b5bdc3;
  align-self: center;
  margin-right: 3px;
  ${({ isVisible }) => `${isVisible ? "" : "visibility: hidden"}`};
  background-color: #000;
  padding-top: ${({ isWindowsFlag }) => `${isWindowsFlag ? "0.15em" : "0.11em"}`};
  ${({ isWindowsFlag }) => `${isWindowsFlag ? "font-family: Meiryo, 'メイリオ', '游ゴシック', 'Yu Gothic', sans-serif" : ""}`};
`;

const SpotNoLabel = styled.div<{ isDarkMode: boolean; isAccent: boolean }>`
  ${({ isDarkMode, isAccent }) => {
    if (isAccent) {
      return isDarkMode ? "color: #EAA812;" : "color: #E67112;";
    }
    return "";
  }};
  ${({ isDarkMode, isAccent }) => (isAccent && isDarkMode ? "font-weight: 600;" : "")};
`;

export default FisRow;
