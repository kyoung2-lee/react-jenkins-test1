import React from "react";
import styled from "styled-components";
import { AppDispatch } from "../../store/storeType";

import { funcAuthCheck } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { CommonState } from "../../reducers/common";
import { JobAuth, Master } from "../../reducers/account";
import { FlightModalTabName, Content, type saveScroll, type selectTab, type toggleUtcMode } from "../../reducers/flightContents";
import type * as flightModalsActions from "../../reducers/flightModals";
import type * as flightDetailActions from "../../reducers/flightContentsFlightDetail";
import type * as stationOperationTaskActions from "../../reducers/flightContentsStationOperationTask";
import type * as flightChangeHistoryActions from "../../reducers/flightContentsFlightChangeHistory";
import type * as flightSpecialCareActions from "../../reducers/flightContentsFlightSpecialCare";
import type * as flightPaxFromListActions from "../../reducers/flightContentsFlightPaxFrom";
import type * as flightPaxToListActions from "../../reducers/flightContentsFlightPaxTo";
import type * as flightBulletinBoardActions from "../../reducers/flightContentsBulletinBoard";
import type * as bulletinBoardResponseEditorModalActions from "../../reducers/bulletinBoardResponseEditorModal";
import { type openDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import CommonSlideTab from "./CommonSlideTab";
import FlightPaxFrom from "./FlightPaxFrom";
import StationOperationTask from "./StationOperationTask";
import FlightDetail from "./FlightDetail";
import FlightChangeHistory from "./FlightChangeHistory";
import FlightSpecialCare from "./FlightSpecialCare";
import FlightPaxTo from "./FlightPaxTo";
import FlightBulletinBoard from "./FlightBulletinBoard";
import RoundButtonMode from "../atoms/RoundButtonMode";
import RoundButtonReload from "../atoms/RoundButtonReload";

interface Props {
  scrollContentRef: React.RefObject<HTMLDivElement>;
  // eslint-disable-next-line react/no-unused-prop-types
  common: CommonState;
  jobAuth: JobAuth;
  master: Master;
  content: Content;
  saveScroll: typeof saveScroll;
  selectTab: typeof selectTab;
  toggleUtcMode: typeof toggleUtcMode;
  openDateTimeInputPopup: typeof openDateTimeInputPopup;
  // Pick<T, U>のタイプは、オブジェクトTからキーのタイプがUであるものを抽出するものである (ex. Pick<{a: 0, b: 1, c: 2}, 'b' | 'c'> => {b: 1, c: 2})
  flightModalsActions: Pick<typeof flightModalsActions, Exclude<keyof typeof flightModalsActions, "default" | "getIdentifier">>;
  flightDetailActions: Pick<typeof flightDetailActions, Exclude<keyof typeof flightDetailActions, never>>;
  stationOperationTaskActions: Pick<typeof stationOperationTaskActions, "fetchStationOperationTask" | "updateStationOperationTask">;
  flightChangeHistoryActions: Pick<typeof flightChangeHistoryActions, "fetchFlightChangeHistory">;
  flightSpecialCareActions: Pick<typeof flightSpecialCareActions, "fetchFlightSpecialCare">;
  flightPaxFromListActions: Pick<typeof flightPaxFromListActions, "fetchFlightPaxFrom">;
  flightPaxToListActions: Pick<typeof flightPaxToListActions, "fetchFlightPaxTo">;
  flightBulletinBoardActions: typeof flightBulletinBoardActions;
  bulletinBoardResponseEditorModalActions: typeof bulletinBoardResponseEditorModalActions;
  dispatch: AppDispatch;
  handleCloseModal?: () => void;
  setBbEditing?: (isBbEditing: boolean) => void;
  isBbEditing?: boolean;
  handleCloseAll?: () => void;
}

// 便詳細モードレス画面のタブ情報
export const flightModalTabInfo: {
  name: FlightModalTabName;
  funcId: string;
  isOalValid: boolean;
  isPastDbValid: boolean;
  isReloadable: boolean;
  reloadButtonBottomHeight: number | null;
}[] = [
  {
    name: "PaxFrom",
    funcId: Const.FUNC_ID.openPaxBarChart,
    isOalValid: false,
    isPastDbValid: false,
    isReloadable: false,
    reloadButtonBottomHeight: -1,
  },
  {
    name: "B.B.",
    funcId: Const.FUNC_ID.openBulletinBoard,
    isOalValid: true,
    isPastDbValid: true,
    isReloadable: false,
    reloadButtonBottomHeight: -1,
  },
  {
    name: "Task",
    funcId: Const.FUNC_ID.openOperationTask,
    isOalValid: true,
    isPastDbValid: true,
    isReloadable: true,
    reloadButtonBottomHeight: null,
  },
  {
    name: "Detail",
    funcId: Const.FUNC_ID.openFlightDetail,
    isOalValid: true,
    isPastDbValid: true,
    isReloadable: true,
    reloadButtonBottomHeight: 50,
  },
  {
    name: "Care",
    funcId: Const.FUNC_ID.openSpecialCare,
    isOalValid: false,
    isPastDbValid: true,
    isReloadable: true,
    reloadButtonBottomHeight: 50,
  },
  {
    name: "History",
    funcId: Const.FUNC_ID.openFlightDetail,
    isOalValid: true,
    isPastDbValid: true,
    isReloadable: true,
    reloadButtonBottomHeight: 50,
  },
  {
    name: "PaxTo",
    funcId: Const.FUNC_ID.openPaxBarChart,
    isOalValid: false,
    isPastDbValid: false,
    isReloadable: false,
    reloadButtonBottomHeight: -1,
  },
];

//
// FISで表示していたモーダルをまとめてタブで表示するComponentです。
// Componentを疎結合にするため、Headerの更新はタブコンテンツとなるComponentのpropsに関数を渡して、
// Headerの更新に必要なデータを受け取り、描画するようにしています。
//
const FlightContents: React.FC<Props> = (props) => {
  const { dispatch } = props;

  const handleFocus = () => {
    const { flightModalsActions, scrollContentRef, content, saveScroll } = props;
    if (scrollContentRef.current) {
      scrollContentRef.current.focus();
      if (content) {
        dispatch(saveScroll({ identifier: content.identifier, scrollTop: scrollContentRef.current.scrollTop }));
      }
    }
    dispatch(flightModalsActions.focusFlightModalAction({ identifier: content.identifier }));
  };

  const handleReload = (): void => {
    const { content } = props;
    if (!content) {
      return;
    }
    handleFocus();

    const { flightKey, bulletinBoard } = content;
    const isReload = true;

    switch (content.currentTabName) {
      case "Detail": {
        const { fetchFlightDetail } = props.flightDetailActions;
        void dispatch(fetchFlightDetail({ flightKey, isReload }));
        break;
      }
      case "PaxFrom": {
        const { fetchFlightPaxFrom } = props.flightPaxFromListActions;
        void dispatch(fetchFlightPaxFrom({ flightKey, isReload }));
        break;
      }
      case "PaxTo": {
        const { fetchFlightPaxTo } = props.flightPaxToListActions;
        void dispatch(fetchFlightPaxTo({ flightKey, isReload }));
        break;
      }
      case "B.B.": {
        const { fetchFlightThreadsAll } = props.flightBulletinBoardActions;
        const bbId = bulletinBoard && bulletinBoard.currentBbId ? bulletinBoard.currentBbId : null;
        void dispatch(fetchFlightThreadsAll({ flightKey, bbId, isReload, isNeedScroll: true }));
        break;
      }
      case "Care": {
        const { fetchFlightSpecialCare } = props.flightSpecialCareActions;
        void dispatch(fetchFlightSpecialCare({ flightKey, isReload }));
        break;
      }
      case "Task": {
        const { fetchStationOperationTask } = props.stationOperationTaskActions;
        void dispatch(fetchStationOperationTask({ flightKey, isReload }));
        break;
      }
      case "History": {
        const { fetchFlightChangeHistory } = props.flightChangeHistoryActions;
        void dispatch(fetchFlightChangeHistory({ flightKey, isReload }));
        break;
      }
      default:
        break;
    }
  };

  const handleUtc = () => {
    const { content, toggleUtcMode } = props;
    const { identifier, isUtc } = content || { identifier: "", isUtc: false };
    dispatch(toggleUtcMode({ identifier, isUtc: !isUtc }));
    handleFocus();
  };

  const updateFlightRmksDep = (rmksText: string, closeRmksPopup: () => void) => {
    const { content, flightDetailActions } = props;
    const { flightDetail } = content || { flightDetail: undefined };
    if (flightDetail && flightDetail.dep && flightDetail.dep.depRmksText === rmksText) {
      void dispatch(flightDetailActions.showNotificationFlightRmksNoChange());
    } else {
      updateFlightRmks(rmksText, "DEP", closeRmksPopup);
    }
  };

  const updateFlightRmksArr = (rmksText: string, closeRmksPopup: () => void) => {
    const { content, flightDetailActions } = props;
    const { flightDetail } = content || { flightDetail: undefined };
    if (flightDetail && flightDetail.arr && flightDetail.arr.arrRmksText === rmksText) {
      void dispatch(flightDetailActions.showNotificationFlightRmksNoChange());
    } else {
      updateFlightRmks(rmksText, "ARR", closeRmksPopup);
    }
  };

  const changeTab = (tabName: FlightModalTabName) => {
    const {
      content,
      selectTab,
      flightDetailActions,
      stationOperationTaskActions,
      flightChangeHistoryActions,
      flightSpecialCareActions,
      flightPaxFromListActions,
      flightPaxToListActions,
      flightBulletinBoardActions,
      isBbEditing,
      setBbEditing,
    } = props;

    const { flightKey } = content;
    const isReload = false;

    const onChangeTab = () => {
      dispatch(selectTab({ identifier: content.identifier, tabName }));
      switch (tabName) {
        case "Detail":
          void dispatch(flightDetailActions.fetchFlightDetail({ flightKey, isReload }));
          break;
        case "PaxFrom":
          void dispatch(flightPaxFromListActions.fetchFlightPaxFrom({ flightKey, isReload }));
          break;
        case "PaxTo":
          void dispatch(flightPaxToListActions.fetchFlightPaxTo({ flightKey, isReload }));
          break;
        case "B.B.":
          void dispatch(flightBulletinBoardActions.fetchFlightThreadsAll({ flightKey, bbId: null, isReload }));
          break;
        case "Care":
          void dispatch(flightSpecialCareActions.fetchFlightSpecialCare({ flightKey, isReload }));
          break;
        case "Task":
          void dispatch(stationOperationTaskActions.fetchStationOperationTask({ flightKey, isReload }));
          break;
        case "History":
          void dispatch(flightChangeHistoryActions.fetchFlightChangeHistory({ flightKey, isReload }));
          break;
        default:
      }

      handleFocus();
    };

    if (isBbEditing) {
      NotificationCreator.create({
        dispatch,
        message: SoalaMessage.M40012C({
          onYesButton: () => {
            if (setBbEditing) {
              setBbEditing(false);
            }
            onChangeTab();
          },
        }),
      });
    } else {
      onChangeTab();
    }
  };

  const updateFlightRmks = (rmksText: string, rmksTypeCd: "DEP" | "ARR", closeRmksPopup: () => void) => {
    const { flightDetailActions } = props;
    const { flightKey } = props.content;
    void dispatch(flightDetailActions.updateFlightRmks({ flightKey, rmksTypeCd, rmksText, closeRmksPopup }));
  };

  const {
    scrollContentRef,
    content,
    jobAuth,
    master,
    openDateTimeInputPopup,
    handleCloseModal,
    setBbEditing,
    isBbEditing,
    handleCloseAll,
  } = props;
  const { focusFlightModalAction } = props.flightModalsActions;
  const { showConfirmation, fetchFlightDetail } = props.flightDetailActions;
  const { fetchFlightThreadsAll, fetchFlightThreadsDetailless, fetchFlightThread, startThread } = props.flightBulletinBoardActions;
  const { updateStationOperationTask } = props.stationOperationTaskActions;
  const { closeBulletinBoardResponseModal } = props.bulletinBoardResponseEditorModalActions;

  const {
    identifier,
    currentTabName,
    isFetching,
    flightKey,
    flightDetail,
    bulletinBoard,
    stationOperationTask,
    flightSpecialCare,
    flightChangeHistory,
    flightPaxFrom,
    flightPaxTo,
  } = content;
  const tabInfo = flightModalTabInfo.find((i) => i.name === currentTabName);
  if (!tabInfo) {
    return <Container />;
  }
  const { name: tabName, isReloadable, reloadButtonBottomHeight } = tabInfo;
  const tabs = flightModalTabInfo
    .filter(
      (item) =>
        funcAuthCheck(item.funcId, jobAuth.jobAuth) &&
        (!content.flightKey.oalTblFlg || item.isOalValid) &&
        (content.connectDbCat === "O" || item.isPastDbValid)
    )
    .map((item) => ({ name: item.name, enabled: true }));

  return (
    <Container>
      <Tab onClick={handleFocus}>
        <CommonSlideTab tabs={tabs} currentTabName={tabInfo.name} onClickTab={changeTab as (tabName: string) => void} />
      </Tab>
      <TabContent>
        {tabName === "Detail" && flightDetail ? (
          <>
            <FlightDetail
              flightDetail={flightDetail}
              flightKey={flightKey}
              jobAuth={jobAuth}
              master={master}
              isUtc={content.isUtc}
              connectDbCat={content.connectDbCat}
              scrollContentRef={scrollContentRef}
              scrollContentOnClick={handleFocus}
              fetchFlightDetail={fetchFlightDetail}
              updateFlightRmksDep={updateFlightRmksDep}
              updateFlightRmksArr={updateFlightRmksArr}
              showConfirmation={showConfirmation}
            />
            <ModeButtonContainer>
              <RoundButtonMode isActiveColor={content.isUtc} onClick={handleUtc} />
            </ModeButtonContainer>
          </>
        ) : (
          <div />
        )}
        {tabName === "PaxFrom" && content.connectDbCat === "O" && flightPaxFrom ? (
          <>
            <FlightPaxFrom flightPaxFrom={flightPaxFrom} scrollContentRef={scrollContentRef} scrollContentOnClick={handleFocus} />
          </>
        ) : (
          <div />
        )}
        {tabName === "PaxTo" && content.connectDbCat === "O" && flightPaxTo ? (
          <>
            <FlightPaxTo flightPaxTo={flightPaxTo} scrollContentRef={scrollContentRef} scrollContentOnClick={handleFocus} />
          </>
        ) : (
          <div />
        )}
        {tabName === "B.B." && bulletinBoard ? (
          <>
            <FlightBulletinBoard
              flightKey={flightKey}
              bulletinBoard={bulletinBoard}
              fetchFlightThreadsAll={fetchFlightThreadsAll}
              fetchFlightThreadsDetailless={fetchFlightThreadsDetailless}
              fetchFlightThread={fetchFlightThread}
              startThread={startThread}
              jobAuth={jobAuth}
              closeBulletinBoardResponseModal={closeBulletinBoardResponseModal}
              isFetching={isFetching}
              onReload={handleReload}
              dispatch={dispatch}
              handleCloseModal={handleCloseModal}
              setBbEditing={setBbEditing}
              isBbEditing={isBbEditing}
              handleCloseAll={handleCloseAll}
            />
          </>
        ) : (
          <div />
        )}
        {tabName === "Care" && flightSpecialCare ? (
          <>
            <FlightSpecialCare
              flightSpecialCare={flightSpecialCare}
              master={master}
              scrollContentRef={scrollContentRef}
              scrollContentOnClick={handleFocus}
            />
          </>
        ) : (
          <div />
        )}
        {tabName === "Task" && stationOperationTask ? (
          <>
            <StationOperationTask
              workStepContentRef={scrollContentRef}
              flightKey={flightKey}
              stationOperationTask={stationOperationTask}
              updateStationOperationTask={updateStationOperationTask}
              activeModal={() => dispatch(focusFlightModalAction({ identifier }))}
              openDateTimeInputPopup={openDateTimeInputPopup}
              authEnabled={
                (stationOperationTask.flight.lstDepApoCd === jobAuth.user.myApoCd || jobAuth.user.myApoCd === null) &&
                funcAuthCheck(Const.FUNC_ID.updateOperationTask, jobAuth.jobAuth)
              }
              isOnline={content.connectDbCat === "O"}
            />
          </>
        ) : (
          <div />
        )}
        {tabName === "History" && flightChangeHistory ? (
          <>
            <FlightChangeHistory
              flightChangeHistory={flightChangeHistory}
              scrollContentRef={scrollContentRef}
              scrollContentOnClick={handleFocus}
            />
          </>
        ) : (
          <div />
        )}
        {isReloadable && reloadButtonBottomHeight !== undefined && (
          <ModalReloadButtonContainer bottomHeight={reloadButtonBottomHeight} tabName={tabName}>
            <RoundButtonReload isFetching={isFetching} disabled={false} onClick={handleReload} />
          </ModalReloadButtonContainer>
        )}
      </TabContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Tab = styled.div``;

const TabContent = styled.div`
  position: relative;
  flex: 1;
  /* ヘッダーを除いたモードレス高さ - 表示画面切り替え高さ */
  height: calc(100% - 36px);
`;

const ModeButtonContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 125px;
  z-index: 1;
`;

const ModalReloadButtonContainer = styled.div<{ bottomHeight: number | null; tabName: string }>`
  position: absolute;
  right: 10px;
  ${({ bottomHeight }) => (bottomHeight !== null ? `bottom: ${bottomHeight}px;` : "")};
  margin-top: ${({ tabName }) => (tabName === "Task" ? "-95px" : "-55px")};
  z-index: 1;
`;

export default FlightContents;
