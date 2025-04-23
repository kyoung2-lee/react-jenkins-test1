import React, { useState, useRef } from "react";

import { Styles } from "react-modal";
import { AppDispatch } from "../../store/storeType";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { CommonState } from "../../reducers/common";
import { JobAuth, Master } from "../../reducers/account";
import { FlightModal as FlightModalState } from "../../reducers/flightModals";
import { Content, type saveScroll, type selectTab, type toggleUtcMode } from "../../reducers/flightContents";
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
import DraggableModal from "./DraggableModal";
import FlightModalHeader from "./FlightModalHeader";
import FlightContents from "./FlightContents";

interface Props {
  common: CommonState;
  jobAuth: JobAuth;
  master: Master;
  modal: FlightModalState;
  content: Content | undefined;
  saveScroll: typeof saveScroll;
  selectTab: typeof selectTab;
  toggleUtcMode: typeof toggleUtcMode;
  // Pick<T, U>のタイプは、オブジェクトTからキーのタイプがUであるものを抽出するものである (ex. Pick<{a: 0, b: 1, c: 2}, 'b' | 'c'> => {b: 1, c: 2})
  openDateTimeInputPopup: typeof openDateTimeInputPopup;
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
  closeModal: (flightModal: flightModalsActions.FlightModal, e?: React.MouseEvent<HTMLButtonElement>) => void;
  // openAnnounceToPax: (url: string) => void;
  handleCloseAll: () => void;
}

//
// FISで表示していたモーダルをまとめてタブで表示するComponentです。
// Componentを疎結合にするため、Headerの更新はタブコンテンツとなるComponentのpropsに関数を渡して、
// Headerの更新に必要なデータを受け取り、描画するようにしています。
//
const FlightModal: React.FC<Props> = (props) => {
  const { dispatch } = props;
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [isBbEditing, setIsBbEditing] = useState(false);

  const handleFocus = () => {
    const { flightModalsActions, modal, content, saveScroll } = props;
    if (scrollContentRef.current) {
      scrollContentRef.current.focus();
      if (content) {
        dispatch(saveScroll({ identifier: content.identifier, scrollTop: scrollContentRef.current.scrollTop }));
      }
    }
    dispatch(flightModalsActions.focusFlightModalAction({ identifier: modal.key }));
  };

  const handleClose = (flightModal: FlightModalState, e?: React.MouseEvent<HTMLButtonElement>) => {
    // this.setState({ currentIndex: undefined });
    props.closeModal(flightModal, e);
  };

  const getHeader = () => {
    const { content } = props;
    if (!content || !content.flightHeader) {
      return <div />;
    }
    const isDetail = content.currentTabName === "Detail";
    const { isUtc } = content;
    const { flightHeader } = content;
    return <FlightModalHeader isDetail={isDetail} isUtc={isUtc} flightHeader={flightHeader} />;
  };

  const handleClickClose = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation();
    }
    const onClose = () => {
      setIsBbEditing(false);
      handleClose(props.modal, e);
    };
    if (isBbEditing) {
      NotificationCreator.create({
        dispatch,
        message: SoalaMessage.M40012C({ onYesButton: onClose }),
      });
    } else {
      onClose();
    }
  };

  const {
    common,
    jobAuth,
    master,
    modal,
    content,
    saveScroll,
    selectTab,
    toggleUtcMode,
    openDateTimeInputPopup,
    flightModalsActions,
    flightDetailActions,
    stationOperationTaskActions,
    flightChangeHistoryActions,
    flightSpecialCareActions,
    flightPaxFromListActions,
    flightPaxToListActions,
    flightBulletinBoardActions,
    bulletinBoardResponseEditorModalActions,
    handleCloseAll,
  } = props;

  return (
    <DraggableModal
      isOpen={modal.opened}
      style={customStyles((800000000 + Math.round((modal.focusedAt.getTime() - common.initDate.getTime()) / 100)) % 900000000)} // 800..番台でz-indexを設定(精度を下げて有効桁数を増やす為、下2桁を丸める)
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      posRight={modal.posRight}
      key={`${modal.key}`}
      header={getHeader()}
      onFocus={handleFocus}
      // onReload={}
      onClose={handleClickClose}
      isFetching={content ? content.isFetching : false}
    >
      {content ? (
        <FlightContents
          scrollContentRef={scrollContentRef}
          common={common}
          jobAuth={jobAuth}
          master={master}
          content={content}
          saveScroll={saveScroll}
          selectTab={selectTab}
          toggleUtcMode={toggleUtcMode}
          openDateTimeInputPopup={openDateTimeInputPopup}
          flightModalsActions={flightModalsActions}
          flightDetailActions={flightDetailActions}
          stationOperationTaskActions={stationOperationTaskActions}
          flightChangeHistoryActions={flightChangeHistoryActions}
          flightSpecialCareActions={flightSpecialCareActions}
          flightPaxFromListActions={flightPaxFromListActions}
          flightPaxToListActions={flightPaxToListActions}
          flightBulletinBoardActions={flightBulletinBoardActions}
          bulletinBoardResponseEditorModalActions={bulletinBoardResponseEditorModalActions}
          dispatch={dispatch}
          handleCloseModal={() => handleClose(modal)}
          setBbEditing={setIsBbEditing}
          isBbEditing={isBbEditing}
          handleCloseAll={handleCloseAll}
        />
      ) : (
        <div />
      )}
    </DraggableModal>
  );
};

const customStyles = (timestamp9digit: number): Styles => ({
  overlay: {
    background: "transparent",
    pointerEvents: "none",
    zIndex: timestamp9digit,
  },
  content: {
    width: "100%",
    height: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    pointerEvents: "none",
    padding: 0,
  },
});

export default FlightModal;
