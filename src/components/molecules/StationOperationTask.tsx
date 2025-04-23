import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import findIndex from "lodash.findindex";
import findLastIndex from "lodash.findlastindex";

import { useAppDispatch } from "../../store/hooks";
import * as stationOperationTaskActions from "../../reducers/flightContentsStationOperationTask";
import { FlightKey, StationOperationTask as StationOperationTaskState } from "../../reducers/flightContents";
import ProcessItem from "./ProcessItem";
import { openDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import { execWithLocationInfo } from "../../lib/commonUtil";
import { storage } from "../../lib/storage";

import UserSvg from "../../assets/images/account/profile_small.svg";
import SystemSvg from "../../assets/images/icon/icon-system.svg";
import MemberListSvg from "../../assets/images/account/profile_small_blue.svg";
import ArrowDownSvg from "../../assets/images/icon/arrow_down.svg";

interface Props {
  workStepContentRef?: React.RefObject<HTMLDivElement>;
  flightKey: FlightKey;
  stationOperationTask: StationOperationTaskState;
  updateStationOperationTask: typeof stationOperationTaskActions.updateStationOperationTask;
  activeModal: () => void;
  openDateTimeInputPopup: typeof openDateTimeInputPopup;
  authEnabled: boolean;
  isOnline: boolean;
}

const StationOperationTask: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const workStepContentRefDefault = useRef<HTMLDivElement>(null);
  const workStepContentRef = props.workStepContentRef || workStepContentRefDefault;
  const workUserListContentRef = useRef<HTMLDivElement>(null);
  const processRowRef = useRef<HTMLDivElement>(null);
  const [isHideFooter, setIsHideFooter] = useState(true);

  useEffect(() => {
    if (workStepContentRef.current) {
      workStepContentRef.current.focus();
    }
    if (processRowRef.current && workStepContentRef.current) {
      processRowRef.current.focus();
      const contentHeight = workStepContentRef.current.clientHeight;
      const rowTop = processRowRef.current.offsetTop;
      const scrollPos = rowTop - contentHeight / 2;
      if (scrollPos > 0) {
        workStepContentRef.current.scrollTo(0, scrollPos);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusToWorkStepList = () => {
    if (workStepContentRef.current) {
      workStepContentRef.current.focus();
    }
    props.activeModal();
  };

  const memberListAcordion = () => {
    setIsHideFooter((prevIsHideFooter) => !prevIsHideFooter);
  };

  const focusToWorkUserList = () => {
    if (workUserListContentRef.current) {
      workUserListContentRef.current.focus();
    }
    props.activeModal();
  };

  const getCurrentWorkStepIndex = (workStepList: StationOperationTaskApi.WorkStepList[]) => {
    const lastIndexOfStandardEndFlg = findLastIndex(workStepList, (w) => w.workStepType === "STRD" && w.workEndFlg);
    const currentIndexOfStandard = findIndex(workStepList, (w) => w.workStepType === "STRD", lastIndexOfStandardEndFlg + 1);
    return currentIndexOfStandard;
  };

  const handleOpenDateTimeInputPopup = (currentDateTime: string, onUpdate: (dateTime: string) => void) => {
    dispatch(
      props.openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
        currentValue: currentDateTime,
        defaultSetting: "DeviceDate",
        onUpdate,
      })
    );
  };

  const getLocation = (
    workStepCd: string,
    actButtonFlg: string, // "0":時間手動登録 or 登録クリア(inputTimeがない場合)、"1":時間自動登録、"2":登録クリア
    inputTime?: string
  ) => {
    const { flightKey, updateStationOperationTask } = props;
    // ロケーションを取得し実行する
    execWithLocationInfo(({ posLat, posLon }) => {
      const postStationOperationTask: StationOperationTaskApi.RequestPost = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        casFltNo: flightKey.casFltNo || "",
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        planUpdateFlg: false,
        oalTblFlg: flightKey.oalTblFlg,
        workStepCd,
        planWorkEndTimeLcl: undefined,
        actWorkEndTimeLcl: actButtonFlg === "0" && inputTime ? dayjs(inputTime).format("YYYYMMDDHHmm") : undefined,
        posLat,
        posLon,
        actButtonFlg,
        arrDepCd: "DEP",
      };
      void dispatch(updateStationOperationTask({ flightKey, postStationOperationTask }));
    });
  };

  const getLocationForPlan = (
    workStepCd: string,
    actButtonFlg: string, // "0":時間手動登録 or 登録クリア(inputTimeがない場合)、"1":時間自動登録、"2":登録クリア
    inputTime?: string
  ) => {
    const { flightKey, updateStationOperationTask } = props;
    // ロケーションを取得し実行する
    execWithLocationInfo(({ posLat, posLon }) => {
      const postStationOperationTask: StationOperationTaskApi.RequestPost = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        casFltNo: flightKey.casFltNo || "",
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        planUpdateFlg: true,
        oalTblFlg: flightKey.oalTblFlg,
        workStepCd,
        planWorkEndTimeLcl: actButtonFlg === "0" && inputTime ? dayjs(inputTime).format("YYYYMMDDHHmm") : undefined,
        actWorkEndTimeLcl: undefined,
        posLat,
        posLon,
        actButtonFlg,
        arrDepCd: "DEP",
      };
      void dispatch(updateStationOperationTask({ flightKey, postStationOperationTask }));
    });
  };

  const { authEnabled, isOnline, stationOperationTask, flightKey } = props;

  const workStepList = stationOperationTask ? stationOperationTask.workStepList : [];
  const currentWorkStepIndex = getCurrentWorkStepIndex(workStepList);
  const endActualTimeIndex = findLastIndex(workStepList, (w) => !!w.actWorkEndTimeLcl || w.workAutoEndFlg);
  return (
    <>
      <Contents isHideFooter={isHideFooter}>
        <InnerScroll tabIndex={-1} ref={workStepContentRef} onClick={focusToWorkStepList}>
          <ProcessBox>
            <SubHeader key={`StationOperationTaskSubHeader_${Date.now()}`} onClick={focusToWorkStepList}>
              <ColumnTitle>
                <ActualTitle>Actual</ActualTitle>
                <PlanTitle>Plan</PlanTitle>
              </ColumnTitle>
            </SubHeader>
            {workStepList.map((workStep, index) => {
              const completed = !!workStep.workEndFlg;
              const system = !!(workStep.workEndFlg && !workStep.workAutoEndFlg && !workStep.userId);
              const current = currentWorkStepIndex === index;
              const timeInputDisabled = !authEnabled || !isOnline;

              let disabled;
              let custom = false;
              let timeInputTextBox = "-";
              if (workStep.workStepType === "STRD") {
                disabled = !!(!authEnabled || !isOnline || system);
                if (!workStep.workAutoEndFlg) {
                  timeInputTextBox = workStep.actWorkEndTimeLcl && dayjs(workStep.actWorkEndTimeLcl).format("HHmm");
                }
              } else if (workStep.workStepType === "ORGL") {
                disabled = !authEnabled || !isOnline;
                custom = true;
                timeInputTextBox = workStep.actWorkEndTimeLcl && dayjs(workStep.actWorkEndTimeLcl).format("HHmm");
              }

              return (
                // eslint-disable-next-line react/no-array-index-key
                <ProcessRow key={index} ref={endActualTimeIndex === index ? processRowRef : undefined}>
                  <ProcessCol workStepType={workStep.workStepType}>
                    <FluidProcessItem
                      title={workStep.workStepName.replace("<br>", " ")}
                      custom={custom}
                      completed={completed}
                      current={current}
                      disabled={disabled}
                      onClick={
                        disabled
                          ? undefined
                          : () => {
                              const actButtonFlg = completed ? "2" : "1";
                              getLocation(workStep.workStepCd, actButtonFlg);
                            }
                      }
                    />
                  </ProcessCol>
                  {workStep.workStepType === "STRD" ? (
                    <PersonFace>
                      {system ? (
                        <SystemIcon />
                      ) : completed && !workStep.workAutoEndFlg && workStep.userId ? (
                        workStep.profileImg ? (
                          <img src={`data:image/png;base64,${workStep.profileImg}`} alt="" />
                        ) : (
                          <UserIcon />
                        )
                      ) : null}
                    </PersonFace>
                  ) : (
                    <PersonFace>
                      {completed ? (
                        workStep.profileImg ? (
                          <img src={`data:image/png;base64,${workStep.profileImg}`} alt="" />
                        ) : (
                          <UserIcon />
                        )
                      ) : null}
                    </PersonFace>
                  )}
                  <ActualCol>
                    <TimeInput
                      workStepType={workStep.workStepType}
                      disabled={timeInputDisabled}
                      onClick={
                        timeInputDisabled
                          ? undefined
                          : () => {
                              handleOpenDateTimeInputPopup(workStep.actWorkEndTimeLcl, (dateTime: string) =>
                                getLocation(workStep.workStepCd, "0", dateTime)
                              );
                            }
                      }
                    >
                      {timeInputTextBox}
                    </TimeInput>
                  </ActualCol>
                  <PlanCol>
                    <TimeInput
                      disabled={!authEnabled || !isOnline || !flightKey.oalTblFlg}
                      onClick={
                        !authEnabled || !isOnline || !flightKey.oalTblFlg
                          ? undefined
                          : () => {
                              handleOpenDateTimeInputPopup(workStep.planWorkEndTimeLcl, (dateTime: string) =>
                                getLocationForPlan(workStep.workStepCd, "0", dateTime)
                              );
                            }
                      }
                    >
                      {workStep.planWorkEndTimeLcl ? dayjs(workStep.planWorkEndTimeLcl).format("HHmm") : ""}
                    </TimeInput>
                  </PlanCol>
                </ProcessRow>
              );
            })}
          </ProcessBox>
        </InnerScroll>
      </Contents>
      <Footer>
        <MemberBox>
          <MemberListIcon />
          <MemberListTitle>Member</MemberListTitle>
          <ArrowBox onClick={memberListAcordion}>
            <ArrowDownIcon isHideFooter={isHideFooter} />
          </ArrowBox>
        </MemberBox>
        <SliderDox isPc={storage.isPc} isHideFooter={isHideFooter} tabIndex={-1} onClick={focusToWorkUserList}>
          {stationOperationTask &&
            stationOperationTask.workUserList.map((workUser, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <PersonCol key={index}>
                <PersonFaceLarge>
                  {workUser.profileImg ? <img src={`data:image/png;base64,${workUser.profileImg}`} alt="" /> : <UserIcon />}
                </PersonFaceLarge>
                {workUser.appleId ? (
                  <a href={`facetime://${workUser.appleId}`}>
                    <PersonName>
                      {workUser.firstName} {workUser.familyName}
                    </PersonName>
                    <PersonMeta>{workUser.empNo}</PersonMeta>
                    <PersonMeta>
                      {workUser.grpCd}/{workUser.jobCd}
                    </PersonMeta>
                  </a>
                ) : (
                  <div>
                    <PersonName>
                      {workUser.firstName} {workUser.familyName}
                    </PersonName>
                    <PersonMeta>{workUser.empNo}</PersonMeta>
                    <PersonMeta>
                      {workUser.grpCd}/{workUser.jobCd}
                    </PersonMeta>
                  </div>
                )}
              </PersonCol>
            ))}
        </SliderDox>
      </Footer>
    </>
  );
};

const SubHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1;
  padding: 8px 19px 4px 12px;
`;

const Contents = styled.div<{ isHideFooter: boolean }>`
  height: calc(100% - ${({ isHideFooter }) => (isHideFooter ? "25px" : "161px")});
  margin-bottom: 2px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

/* 行がスクロール枠を満たしていない場合も若干スクロールさせて裏がスクロールしないように */
const InnerScroll = styled.div`
  width: 100%;
  height: calc(100% + 1px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  padding-bottom: 105px;
`;

const ProcessRow = styled.div`
  display: flex;
  height: 40px;
  padding: 0 19px 0 12px;
  position: relative;
`;

const ProcessCol = styled.div<{ workStepType: string }>`
  width: 176px;
`;

const ActualCol = styled.div`
  width: 64px;
  margin-left: 16px;
`;

const FluidProcessItem = styled(ProcessItem)`
  height: 100%;
  width: 100%;
  font-size: 17px;
`;

const PersonFace = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  position: absolute;
  margin-top: 24px;
  margin-left: 148px;

  img {
    height: 24px;
    width: 24px;
    border-radius: 20px;
    object-fit: contain;
    box-shadow: 2px 2px 4px rgb(0 0 0 / 20%);
  }
`;

const PersonFaceLarge = styled.div`
  width: 50px;
  height: 50px;
  margin-bottom: 4px;
  margin-left: 20px;
  box-shadow: none;

  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    object-fit: contain;
  }
`;

const TimeInput = styled.div<{ disabled?: boolean; workStepType?: string }>`
  width: 100%;
  height: 100%;
  border: ${(props) => (props.workStepType === "STRD" ? "2px" : "1px")} solid ${(props) => (props.disabled ? "#222222" : "#346181")};
  cursor: ${(props) => (props.disabled ? "inherit" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding-top: 1px;
`;

const Footer = styled.div`
  position: absolute;
  background-color: #e4f2f7;
  width: 100%;
  box-shadow: 0px 0px 1px 0px #c9d3d0;

  a {
    color: #346181;
  }
`;

const MemberBox = styled.div`
  display: flex;
  height: 24px;
  padding: 5px 16px 7px 9px;
`;

const MemberListTitle = styled.div`
  width: 275px;
  margin-left: 5px;
  color: #346181;
  font-size: 12px;
  font-weight: bold;
`;

const ArrowBox = styled.div`
  cursor: pointer;
  padding-left: 44px;
`;

const SliderDox = styled.div<{ isPc: boolean; isHideFooter: boolean }>`
  display: ${({ isHideFooter }) => (isHideFooter ? "none" : "flex")};
  height: 136px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const PersonCol = styled.div`
  outline: none;
  text-align: center;
  width: 105px;
  padding: 8px;
  flex-shrink: 0;
  word-break: break-all;
`;

const PersonName = styled.div`
  font-size: 12px;
  word-break: break-all;
  text-align: center;
`;

const PersonMeta = styled.div`
  font-size: 12px;
`;

const UserIcon = styled.img.attrs({ src: UserSvg })``;
const SystemIcon = styled.img.attrs({ src: SystemSvg })``;

const MemberListIcon = styled.img.attrs({ src: MemberListSvg })`
  width: 10px;
  height: 10px;
`;

const ArrowDownIcon = styled.img.attrs({ src: ArrowDownSvg })<{ isHideFooter: boolean }>`
  width: 16px;
  height: 10px;
  margin-bottom: 5px;
  ${({ isHideFooter }) => (isHideFooter ? "transform: rotate(180deg);" : "")};
`;

const ColumnTitle = styled.div`
  display: flex;
`;

const ActualTitle = styled.div`
  font-size: 12px;
  width: 256px;
  border-bottom: 4px solid #cccccc;
  margin-right: 24px;
  padding-left: 8px;
`;

const PlanTitle = styled.div`
  font-size: 12px;
  width: 64px;
  border-bottom: 4px solid #cccccc;
  padding-left: 8px;
`;

const ProcessBox = styled.div`
  > div:nth-child(2) {
    margin-top: 4px;
  }

  > div:nth-child(n + 3) {
    margin-top: 16px;
  }
`;

const PlanCol = styled.div`
  width: 64px;
  margin-left: 24px;
`;

export default StationOperationTask;
