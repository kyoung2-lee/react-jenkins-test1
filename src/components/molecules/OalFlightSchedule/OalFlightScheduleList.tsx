import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import Modal, { Styles } from "react-modal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import { smoothScroll } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import { SoalaMessage } from "../../../lib/soalaMessages";
import {
  OalFlightSchedule,
  OalFlightScheduleState,
  getOnwardForceDisabled,
  ChgType,
  fltListEdit,
  setInputModal,
  fltListAddLeg,
  fltListRemoveLeg,
  fltListCopyFlt,
  fltListRemoveFlt,
  update,
  showMessage,
} from "../../../reducers/oalFlightSchedule";
import OalFlightScheduleInputModal from "./OalFlightScheduleInputModal";
import { getListItemEnabled, MenuVisible, getMenuVisible, ListItemEnabled, serverErrorItems, getFltInfo } from "./OalFlightScheduleType";
import PrimaryButton from "../../atoms/PrimaryButton";
import { OptionType } from "../../atoms/SelectBox";
import { OptionType as SuggestOptionType } from "../../atoms/SuggestSelectBox";
import { CheckBox } from "../../atoms/CheckBoxInput";
import MenuIconSvg from "../../../assets/images/icon/icon-fis-select-target-popup.svg";
import RowStatus = OalFlightScheduleApi.Get.RowStatus;

type Props = ListStateProps & {
  apoOptions: SuggestOptionType[];
  flightStsOptions: OptionType[];
  isEdited: boolean;
};

export const formName = "OalFlightScheduleList";
export const formFieldName = "fltScheduleList";

const OalFlightScheduleList: React.FC<Props> = (props) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const defaultScrollPosition = useRef<number>(0);

  const dispatch = useAppDispatch();
  const oalFlightSchedule = useAppSelector((state) => state.oalFlightSchedule);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
  const [selectedFltIndex, setSelectedFltIndex] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState<MenuVisible | null>(null);
  const [scrollFooterHeight, setScrollFooterHeight] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", setScrollHeight);
    setScrollHeight();
    return () => {
      window.removeEventListener("resize", setScrollHeight);
    };
  }, []);

  useEffect(() => {
    if (oalFlightSchedule.isSearched) {
      setSelectedMenuIndex(null);
      setSelectedFltIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oalFlightSchedule.isSearched]);

  useEffect(() => {
    // モーダルを開く際にスクロールする
    if (oalFlightSchedule.isOpenInputModal) {
      defaultScrollPosition.current = 0;
      if (scrollAreaRef.current) {
        if (props.oalFlightScheduleState.inputRowIndex !== null) {
          const fltSchedule = props.oalFlightScheduleState.fltScheduleList[props.oalFlightScheduleState.inputRowIndex];
          const firstLegIndex = props.oalFlightScheduleState.fltScheduleList.findIndex((f) => f.fltIndex === fltSchedule.fltIndex);
          const position = firstLegIndex * 40;
          if (firstLegIndex >= 0) {
            defaultScrollPosition.current = scrollAreaRef.current.scrollTop;
            smoothScroll(scrollAreaRef.current, position, 10);
          }
        }
      }
    } else if (!oalFlightSchedule.isOpenInputModal) {
      if (scrollAreaRef.current) {
        smoothScroll(scrollAreaRef.current, defaultScrollPosition.current, 10);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oalFlightSchedule.isOpenInputModal]);

  const setScrollHeight = () => {
    if (scrollAreaRef.current) {
      setScrollFooterHeight(scrollAreaRef.current.clientHeight - 60);
    }
  };

  const getIsForceError = (fieldName: keyof typeof serverErrorItems, fltSchedule: OalFlightSchedule) => {
    const errorItems = serverErrorItems[fieldName];
    if (fltSchedule) {
      for (let xi = 0; xi < errorItems.length; xi++) {
        const includes = fltSchedule.updateValidationErrors.includes(errorItems[xi]);
        if (includes) return true;
      }
    }
    return false;
  };

  const handleOpenMenu = (index: number) => () => {
    const row = document.getElementById(`fltRow_${index}`);
    if (row) {
      const menu = row.getElementsByClassName("menu");
      if (menu.length > 0) {
        const menuRect = menu[0].getBoundingClientRect();
        const { top, right } = menuRect;
        const isMenuVisible = getMenuVisible(index, props.oalFlightScheduleState.fltScheduleList);
        const selectFltIndex = props.oalFlightScheduleState.fltScheduleList[index].fltIndex;
        setIsMenuOpen(true);
        setMenuPos({ top, right });
        setSelectedMenuIndex(index);
        setSelectedFltIndex(selectFltIndex);
        setMenuVisible(isMenuVisible);
      }
    }
  };

  const editRowFromInitialValue = (
    updateItem: {
      rowStatus?: RowStatus;
      chgType?: ChgType;
      dispStatus?: string;
    },
    isAllLeg?: boolean
  ) => {
    if (selectedMenuIndex !== null) {
      if (props.oalFlightScheduleState.fltScheduleListInitial[selectedMenuIndex]) {
        const newFltSchedule = {
          ...props.oalFlightScheduleState.fltScheduleListInitial[selectedMenuIndex],
          ...updateItem,
        };
        dispatch(fltListEdit({ index: selectedMenuIndex, fltScheduleList: [newFltSchedule] }));
        // 他のLEGも初期値に更新
        if (isAllLeg) {
          let findedIndex = -1;
          for (;;) {
            findedIndex = props.oalFlightScheduleState.fltScheduleListInitial.findIndex(
              // eslint-disable-next-line @typescript-eslint/no-loop-func
              (f, index) => f.fltIndex === newFltSchedule.fltIndex && f.legIndex !== newFltSchedule.legIndex && index > findedIndex
            );
            if (findedIndex >= 0) {
              const newFltSchedule2 = {
                ...props.oalFlightScheduleState.fltScheduleListInitial[findedIndex],
                ...updateItem,
              };
              dispatch(fltListEdit({ index: findedIndex, fltScheduleList: [newFltSchedule2] }));
            } else {
              break;
            }
          }
          // マルチレグの１行目の場合、他のLEGにFLT情報をコピーする
        } else if (newFltSchedule.legIndex === 0) {
          let findedIndex = -1;
          for (;;) {
            findedIndex = props.oalFlightScheduleState.fltScheduleList.findIndex(
              // eslint-disable-next-line @typescript-eslint/no-loop-func
              (f, index) => f.fltIndex === newFltSchedule.fltIndex && f.legIndex !== newFltSchedule.legIndex && index > findedIndex
            );
            if (findedIndex >= 0) {
              const newFltSchedule2 = {
                ...props.oalFlightScheduleState.fltScheduleList[findedIndex],
                ...getFltInfo(newFltSchedule),
              };
              dispatch(fltListEdit({ index: findedIndex, fltScheduleList: [newFltSchedule2] }));
            } else {
              break;
            }
          }
        }
        setIsMenuOpen(false);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuEdit = (_e: any) => {
    if (selectedMenuIndex !== null) {
      const fltSchedule = props.oalFlightScheduleState.fltScheduleList[selectedMenuIndex];
      dispatch(
        setInputModal({
          isOpenInputModal: true,
          inputRowIndex: selectedMenuIndex,
          inputChgType: fltSchedule.chgType || "Other",
          inputNewRow: null,
        })
      );
      setIsMenuOpen(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuCnl = (_e: any) => {
    editRowFromInitialValue({
      rowStatus: "Edited",
      chgType: "CNL",
      dispStatus: "CNL",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuRin = (_e: any) => {
    editRowFromInitialValue({
      rowStatus: "Edited",
      chgType: "RIN",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuSkdTim = (_e: any) => {
    dispatch(
      setInputModal({
        isOpenInputModal: true,
        inputRowIndex: selectedMenuIndex,
        inputChgType: "SKD TIM",
        inputNewRow: null,
      })
    );
    setIsMenuOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuRteSkd = (_e: any) => {
    dispatch(
      setInputModal({
        isOpenInputModal: true,
        inputRowIndex: selectedMenuIndex,
        inputChgType: "RTE SKD",
        inputNewRow: null,
      })
    );
    setIsMenuOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuUndoLeg = (_e: any) => {
    editRowFromInitialValue({});
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuAddLeg = (_e: any) => {
    if (selectedMenuIndex !== null) {
      const { fltScheduleList } = props.oalFlightScheduleState;
      const chageType = fltScheduleList[selectedMenuIndex].chgType === "ADD FLT" ? "ADD FLT" : "ADD LEG";
      void dispatch(fltListAddLeg({ index: selectedMenuIndex || 0, chgType: chageType }));
      dispatch(
        setInputModal({
          isOpenInputModal: true,
          inputRowIndex: selectedMenuIndex + 1,
          inputChgType: chageType,
          inputNewRow: true,
        })
      );
      setIsMenuOpen(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuRemoveLeg = (_e: any) => {
    void dispatch(fltListRemoveLeg({ index: selectedMenuIndex || 0 }));
    setIsMenuOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuDeleteLeg = (_e: any) => {
    editRowFromInitialValue({
      rowStatus: "Edited",
      chgType: "DEL LEG",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuCopy = (_e: any) => {
    void dispatch(fltListCopyFlt({ index: selectedMenuIndex || 0 }));
    setIsMenuOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuFltNo = (_e: any) => {
    dispatch(
      setInputModal({
        isOpenInputModal: true,
        inputRowIndex: selectedMenuIndex,
        inputChgType: "FLT No.",
        inputNewRow: null,
      })
    );
    setIsMenuOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuUndoFlt = (_e: any) => {
    editRowFromInitialValue({}, true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuRemoveFlt = (_e: any) => {
    void dispatch(fltListRemoveFlt({ index: selectedMenuIndex || 0 }));
    setIsMenuOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickMenuDeleteFlt = (_e: any) => {
    editRowFromInitialValue(
      {
        rowStatus: "Edited",
        chgType: "DEL FLT",
      },
      true
    );
  };

  const inputModalOnRequestClose = () => {
    setIsMenuOpen(false);
  };

  const oalFlightScheduleListUpdate = () => {
    const search = () => dispatch(update());
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    void dispatch(showMessage({ message: SoalaMessage.M30010C({ onYesButton: search }) }));
  };

  const renderFlexPartOfFlights = (fltSchedule: OalFlightSchedule, fltScheduleInitial: OalFlightSchedule, enabled: ListItemEnabled) => (
    <>
      <div className="domInt">
        {fltSchedule.legIndex === 0 && (
          <TextColumn
            disabled={!enabled.intDomCat}
            value={fltSchedule.intDomCat}
            valueOrg={fltScheduleInitial.intDomCat}
            isError={getIsForceError("intDomCat", fltSchedule)}
          >
            {fltSchedule.intDomCat === "D" ? "DOM" : fltSchedule.intDomCat === "I" ? "INT" : ""}
          </TextColumn>
        )}
      </div>
      <div className="paxCgo">
        {fltSchedule.legIndex === 0 && (
          <TextColumn
            disabled={!enabled.paxCgoCat}
            value={fltSchedule.paxCgoCat}
            valueOrg={fltScheduleInitial.paxCgoCat}
            isError={getIsForceError("paxCgoCat", fltSchedule)}
          >
            {fltSchedule.paxCgoCat}
          </TextColumn>
        )}
      </div>
      <div className="skdNsk">
        {fltSchedule.legIndex === 0 && (
          <TextColumn
            disabled={!enabled.skdlNonskdlCat}
            value={fltSchedule.skdlNonskdlCat}
            valueOrg={fltScheduleInitial.skdlNonskdlCat}
            isError={getIsForceError("skdlNonskdlCat", fltSchedule)}
          >
            {fltSchedule.skdlNonskdlCat}
          </TextColumn>
        )}
      </div>
      <StatusColumn
        className="status"
        dirty={fltSchedule.dispStatus !== (fltScheduleInitial ? fltScheduleInitial.dispStatus : "")}
        lineThrough={fltSchedule.chgType === "RIN"}
      >
        {fltSchedule.dispStatus}
      </StatusColumn>
      <div className="dep">
        <TextColumn
          disabled={!enabled.depApoCd}
          value={fltSchedule.depApoCd}
          valueOrg={fltScheduleInitial.depApoCd}
          isError={getIsForceError("depApoCd", fltSchedule)}
        >
          {fltSchedule.depApoCd}
        </TextColumn>
      </div>
    </>
  );

  const renderFlights = () => {
    const {
      oalFlightScheduleState: { fltScheduleList, fltScheduleListInitial },
    } = props;

    return (
      <>
        {fltScheduleList &&
          fltScheduleList.map((fltSchedule, index) => {
            const fltScheduleInitial = fltScheduleListInitial[index];
            const enabled = getListItemEnabled(fltScheduleList[index]);
            const onwardForceDisabled = getOnwardForceDisabled(fltScheduleList[index]);

            return (
              <TableRow
                // eslint-disable-next-line react/no-array-index-key
                key={`${index}`}
                id={`fltRow_${index}`}
                tabIndex={0}
                isFocused={selectedFltIndex === fltScheduleList[index].fltIndex}
              >
                <td>
                  <div className="rowStatus">
                    {fltSchedule.rowStatus && <StyledLabel rowStatus={fltSchedule.rowStatus}>{fltSchedule.rowStatus}</StyledLabel>}
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-static-element-interactions */}
                  <div className="menu" onClick={handleOpenMenu(index)} tabIndex={0} onKeyUp={() => {}}>
                    <MenuIcon />
                  </div>
                  <ChgTypeColumn className="chgType">{fltSchedule.chgType}</ChgTypeColumn>
                  <div className="casual">
                    {fltSchedule.legIndex === 0 && (
                      <CheckBoxItem
                        disabled={!enabled.casFltFlg}
                        dirty={fltSchedule.casFltFlg !== (fltScheduleInitial ? fltScheduleInitial.casFltFlg : false)}
                      >
                        <CheckBox type="checkbox" checked={fltSchedule.casFltFlg} disabled />
                      </CheckBoxItem>
                    )}
                  </div>
                  <div className="flight">
                    {fltSchedule.legIndex === 0 && (
                      <TextColumn
                        disabled={!enabled.fltName}
                        value={fltSchedule.fltName}
                        valueOrg={fltScheduleInitial.fltName}
                        isError={getIsForceError("fltName", fltSchedule)}
                      >
                        {fltSchedule.fltName}
                      </TextColumn>
                    )}
                  </div>
                  <div className="date">
                    {fltSchedule.legIndex === 0 && (
                      <TextColumn
                        disabled={!enabled.orgDate}
                        value={fltSchedule.orgDate}
                        valueOrg={fltScheduleInitial.orgDate}
                        isError={getIsForceError("orgDate", fltSchedule)}
                      >
                        {fltSchedule.orgDateLcl ? dayjs(fltSchedule.orgDateLcl).format("DDMMM").toUpperCase() : ""}
                      </TextColumn>
                    )}
                  </div>
                  {storage.isPc && renderFlexPartOfFlights(fltSchedule, fltScheduleInitial, enabled)}
                </td>
                <td>
                  {!storage.isPc && renderFlexPartOfFlights(fltSchedule, fltScheduleInitial, enabled)}
                  <div className="arr">
                    <TextColumn
                      disabled={!enabled.arrApoCd}
                      value={fltSchedule.arrApoCd}
                      valueOrg={fltScheduleInitial.arrApoCd}
                      isError={getIsForceError("arrApoCd", fltSchedule)}
                    >
                      {fltSchedule.arrApoCd}
                    </TextColumn>
                  </div>
                  <div className="std">
                    <TextColumn
                      disabled={!enabled.std}
                      value={fltSchedule.std}
                      valueOrg={fltScheduleInitial.std}
                      isError={getIsForceError("std", fltSchedule)}
                    >
                      {fltSchedule.std}
                    </TextColumn>
                  </div>
                  <div className="etd">
                    <TextColumn
                      disabled={!enabled.etd}
                      value={fltSchedule.etd}
                      valueOrg={fltScheduleInitial.etd}
                      isError={getIsForceError("etd", fltSchedule)}
                    >
                      {fltSchedule.etd}
                    </TextColumn>
                  </div>
                  <div className="sta">
                    <TextColumn
                      disabled={!enabled.sta}
                      value={fltSchedule.sta}
                      valueOrg={fltScheduleInitial.sta}
                      isError={getIsForceError("sta", fltSchedule)}
                    >
                      {fltSchedule.sta}
                    </TextColumn>
                  </div>
                  <div className="eta">
                    <TextColumn
                      disabled={!enabled.eta}
                      value={fltSchedule.eta}
                      valueOrg={fltScheduleInitial.eta}
                      isError={getIsForceError("eta", fltSchedule)}
                    >
                      {fltSchedule.eta}
                    </TextColumn>
                  </div>
                  <div className="eqp">
                    <TextColumn
                      disabled={!enabled.shipTypeIataCd}
                      value={fltSchedule.shipTypeIataCd}
                      valueOrg={fltScheduleInitial.shipTypeIataCd}
                      isError={getIsForceError("shipTypeIataCd", fltSchedule)}
                    >
                      {fltSchedule.shipTypeIataCd}
                    </TextColumn>
                  </div>
                  <div className="ship">
                    <TextColumn
                      disabled={!enabled.shipNo}
                      value={fltSchedule.shipNo}
                      valueOrg={fltScheduleInitial.shipNo}
                      isError={getIsForceError("shipNo", fltSchedule)}
                    >
                      {fltSchedule.shipNo}
                    </TextColumn>
                  </div>
                  <div className="flightSts">
                    <TextColumn
                      disabled={!enabled.svcTypeDiaCd}
                      value={fltSchedule.svcTypeDiaCd}
                      valueOrg={fltScheduleInitial.svcTypeDiaCd}
                      isError={getIsForceError("svcTypeDiaCd", fltSchedule)}
                    >
                      {fltSchedule.svcTypeDiaCd}
                    </TextColumn>
                  </div>
                  <div className="cnxTo">
                    <TextColumn
                      disabled={onwardForceDisabled || !enabled.onward}
                      value={fltSchedule.onwardFltName}
                      valueOrg={fltScheduleInitial.onwardFltName}
                      isError={getIsForceError("onwardFltName", fltSchedule)}
                    >
                      {onwardForceDisabled ? "" : fltSchedule.onwardFltName}
                    </TextColumn>
                  </div>
                  <div className="date">
                    <TextColumn
                      disabled={onwardForceDisabled || !enabled.onward}
                      value={fltSchedule.onwardOrgDate}
                      valueOrg={fltScheduleInitial.onwardOrgDate}
                      isError={getIsForceError("onwardOrgDate", fltSchedule)}
                    >
                      {onwardForceDisabled
                        ? ""
                        : fltSchedule.onwardOrgDateLcl
                        ? dayjs(fltSchedule.onwardOrgDateLcl).format("DDMMM").toUpperCase()
                        : ""}
                    </TextColumn>
                  </div>
                  <div className="hideFlg">
                    <TextColumn
                      disabled={!enabled.hideFlgCd}
                      value={fltSchedule.hideFlgCd}
                      valueOrg={fltScheduleInitial.hideFlgCd}
                      isError={getIsForceError("hideFlgCd", fltSchedule)}
                    >
                      {fltSchedule.hideFlgCd}
                    </TextColumn>
                  </div>
                  <div className="codeShareFlight">
                    <TextColumnAny
                      disabled={!enabled.csFltNames}
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={fltSchedule.csFltNames}
                      valueOrg={fltScheduleInitial.csFltNames}
                      isError={getIsForceError("csFltNames", fltSchedule)}
                    >
                      {fltSchedule.csFltNames.map((flt, csFltNamesIndex) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={csFltNamesIndex}>{flt}</div>
                      ))}
                    </TextColumnAny>
                  </div>
                </td>
              </TableRow>
            );
          })}
      </>
    );
  };

  const {
    oalFlightScheduleState: { isUtc },
    apoOptions,
    flightStsOptions,
  } = props;
  const zMark = isUtc ? "(Z)" : "";
  const lMark = isUtc ? "(L)" : "";
  return (
    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
    <ListContainer tabIndex={200}>
      {menuVisible && (
        <Modal isOpen={isMenuOpen} style={menuCustomStyles(menuPos.top, menuPos.right)} onRequestClose={inputModalOnRequestClose}>
          <MenuContainer menuTop={menuPos.top} menuRight={menuPos.right}>
            {menuVisible.edit && <MenuItem onClick={handleClickMenuEdit}>Edit</MenuItem>}
            {menuVisible.edit && <Separator />}
            {menuVisible.cnl && (
              <MenuItem disabled={!menuVisible.cnlEnabled} onClick={menuVisible.cnlEnabled ? handleClickMenuCnl : undefined}>
                CNL
              </MenuItem>
            )}
            {menuVisible.rin && <MenuItem onClick={handleClickMenuRin}>RIN</MenuItem>}
            {menuVisible.skdTim && <MenuItem onClick={handleClickMenuSkdTim}>Schedule Time Change</MenuItem>}
            {menuVisible.rteSkd && <MenuItem onClick={handleClickMenuRteSkd}>Route Schedule Change</MenuItem>}
            {menuVisible.undoLeg && <MenuItem onClick={handleClickMenuUndoLeg}>Undo (LEG)</MenuItem>}
            {menuVisible.addLeg && <MenuItem onClick={handleClickMenuAddLeg}>Add (LEG)</MenuItem>}
            {menuVisible.removeLeg && <MenuItem onClick={handleClickMenuRemoveLeg}>Remove (LEG)</MenuItem>}
            {menuVisible.deleteLeg && <MenuItem onClick={handleClickMenuDeleteLeg}>Delete (LEG)</MenuItem>}
            {menuVisible.separator && <Separator />}
            {menuVisible.copy && (
              <MenuItem disabled={!menuVisible.fltEnabled} onClick={menuVisible.fltEnabled ? handleClickMenuCopy : undefined}>
                Copy
              </MenuItem>
            )}
            {menuVisible.fltNo && (
              <MenuItem disabled={!menuVisible.fltEnabled} onClick={menuVisible.fltEnabled ? handleClickMenuFltNo : undefined}>
                FLT No. Change
              </MenuItem>
            )}
            {menuVisible.undoFlt && (
              <MenuItem disabled={!menuVisible.fltEnabled} onClick={menuVisible.fltEnabled ? handleClickMenuUndoFlt : undefined}>
                Undo (FLT)
              </MenuItem>
            )}
            {menuVisible.removeFlt && (
              <MenuItem disabled={!menuVisible.fltEnabled} onClick={menuVisible.fltEnabled ? handleClickMenuRemoveFlt : undefined}>
                Remove (FLT)
              </MenuItem>
            )}
            {menuVisible.deleteFlt && (
              <MenuItem disabled={!menuVisible.fltEnabled} onClick={menuVisible.fltEnabled ? handleClickMenuDeleteFlt : undefined}>
                Delete (FLT)
              </MenuItem>
            )}
          </MenuContainer>
        </Modal>
      )}
      <OalFlightScheduleInputModal
        apoOptions={apoOptions}
        flightStsOptions={flightStsOptions}
        basePosition={scrollAreaRef.current ? scrollAreaRef.current.getBoundingClientRect().top : 0}
        zoomPercentageOfList={zoomPercentage}
      />
      <ScrollArea ref={scrollAreaRef}>
        <StickyTable footerHeight={scrollFooterHeight}>
          <thead>
            <TableRow>
              <th>
                <div className="rowStatus" />
                <div className="menu">Menu</div>
                <div className="chgType">CHG Type</div>
                <div className="casual">Casual</div>
                <div className="flight">Flight</div>
                <div className="date">Date{lMark}</div>
                {storage.isPc && (
                  <>
                    <div className="domInt">DOM/INT</div>
                    <div className="paxCgo">PAX/CGO</div>
                    <div className="skdNsk">SKD/NSK</div>
                    <div className="status">Status</div>
                    <div className="dep">DEP</div>
                  </>
                )}
              </th>
              <th>
                {!storage.isPc && (
                  <>
                    <div className="domInt">DOM/INT</div>
                    <div className="paxCgo">PAX/CGO</div>
                    <div className="skdNsk">SKD/NSK</div>
                    <div className="status">Status</div>
                    <div className="dep">DEP</div>
                  </>
                )}
                <div className="arr">ARR</div>
                <div className="std">STD{zMark}</div>
                <div className="etd">ETD{zMark}</div>
                <div className="sta">STA{zMark}</div>
                <div className="eta">ETA{zMark}</div>
                <div className="eqp">EQP</div>
                <div className="ship">SHIP</div>
                <div className="flightSts">FlightSTS</div>
                <div className="cnxTo">CNX To</div>
                <div className="date">Date{lMark}</div>
                <div className="hideFlg">Hide Flag</div>
                <div className="codeShareFlight">Code Share Flight</div>
              </th>
            </TableRow>
          </thead>
          <tbody>{renderFlights()}</tbody>
          <tfoot>
            <tr />
          </tfoot>
        </StickyTable>
      </ScrollArea>
      <Footer>
        <PrimaryButton text="Update" tabIndex={-1} disabled={!props.isEdited} onClick={oalFlightScheduleListUpdate} />
      </Footer>
    </ListContainer>
  );
};

const zoomPercentage = 90;

const ListContainer = styled.div`
  width: 100%;
  height: 100%;
  zoom: ${zoomPercentage}%;
`;

const ScrollArea = styled.div`
  position: relative;
  overflow: scroll;
  width: 100%;
  height: calc(100% - 64px);
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  justify-content: center;
  button {
    width: 100px;
  }
`;

const StickyTable = styled.table<{ footerHeight: number }>`
  border-collapse: collapse;
  border-spacing: 0;
  thead {
    /* ChromeとiOSに対応するためtheadとtrでstickyの指定が必要 */
    position: sticky; /* 縦スクロール時に固定する */
    top: 0px;
    z-index: 20; /* tbody内のセルより手前に表示する */
    > tr {
      height: 22px;
      position: sticky; /* 縦スクロール時に固定する */
      top: 0px;
      z-index: 20; /* tbody内のセルより手前に表示する */
      > th:first-child {
        /* 横スクロール時に固定する */
        position: sticky;
        left: 0;
        z-index: 21;
      }
      > th {
        padding: 0;
        border: solid #fff 1px;
        > div {
          /* text-align: center; */
          background-color: rgb(39, 153, 198);
          color: #fff;
        }
        .codeShareFlight {
          /* text-align: left; */
        }
      }
    }
  }
  tbody {
    tr {
      height: 40px;
      z-index: 10;
      > td:first-child {
        /* 横スクロール時に固定する */
        position: sticky;
        left: 0;
        z-index: 11;
      }
      > td {
        padding: 0;
        border: solid #fff 1px;
      }
    }
  }
  tfoot {
    tr {
      height: ${({ footerHeight }) => `${footerHeight}px`};
    }
  }
`;

const TableRow = styled.tr<{ isFocused?: boolean }>`
  display: flex;
  align-self: center;
  > th {
    font-size: 12px;
    display: flex;
    font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
    > div {
      display: flex; /* 上下中央に配置するため */
      overflow: visible;
      min-width: 80px;
      align-items: center;
      justify-content: flex-start;
      padding-left: 6px;
    }
  }
  > td {
    font-size: 18px;
    display: flex;
    font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
    > div {
      background-color: #eee;
      display: flex; /* 上下中央に配置するため */
      overflow: visible;
      min-width: 80px;
      align-items: center;
      justify-content: flex-start;
      > div {
        padding-left: 6px;
      }
    }
    .rowStatus {
      background-color: #fff;
    }
    .menu {
      cursor: pointer;
      background-color: #fff;
    }
    .chgType,
    .casual,
    .flight,
    .date:nth-child(6),
    .domInt,
    .paxCgo,
    .skdNsk {
      background-color: ${({ isFocused }) => (isFocused ? "#CEE2E2" : "#EEE")};
    }
  }
  > td:nth-child(2) {
    font-size: 18px;
    > div {
      background-color: #eee;
    }
  }
  .rowStatus {
    width: 70px;
    justify-content: center;
    padding-left: 0;
  }
  .menu {
    width: 44px;
    justify-content: center;
    padding-left: 0;
  }
  .chgType {
    width: 100px;
  }
  .casual {
    width: 44px;
    justify-content: center;
    padding-left: 0;
  }
  .flight {
    width: 112px;
  }
  .date {
    width: 80px;
  }
  .domInt {
    width: 76px;
  }
  .paxCgo {
    width: 76px;
  }
  .skdNsk {
    width: 76px;
  }
  .status {
    width: 70px;
  }
  .dep,
  .arr {
    width: 80px;
  }
  .std,
  .etd,
  .sta,
  .eta {
    width: 88px;
  }
  .tml {
    width: 88px;
  }
  .eqp {
    width: 64px;
  }
  .ship {
    width: 120px;
  }
  .flightSts {
    width: 80px;
  }
  .cnxTo {
    width: 112px;
  }
  .hideFlg {
    width: 64px;
  }
  .codeShareFlight {
    display: flex;
    width: 1600px;
    > div {
      display: flex;
      width: 100%;
      > div {
        display: flex;
        min-width: 80px;
        padding-left: 6px;
      }
    }
  }
`;

const ChgTypeColumn = styled.div`
  -webkit-text-stroke: 1px;
  color: ${({ theme }) => theme.color.text.CHANGED};
  padding-left: 6px;
`;

const StatusColumn = styled.div<{ dirty: boolean; lineThrough: boolean }>`
  -webkit-text-stroke: 1px;
  color: ${({ dirty, lineThrough, theme }) => (dirty || lineThrough ? theme.color.text.CHANGED : "#000")};
  text-decoration: ${({ lineThrough }) => (lineThrough ? "line-through" : "none")};
  padding-left: 6px;
`;

const CheckBoxItem = styled.div<{ disabled: boolean; dirty: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  background-color: ${({ disabled, dirty, theme }) => (disabled ? "rgba(0,0,0,0)" : dirty ? theme.color.background.DELETED : "#FFF")};
  input {
    transform: scale(0.6);
  }
`;

const TextColumn = styled.div<{ disabled: boolean; value?: string; valueOrg?: string; isError: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ value, valueOrg, theme }) => (value === valueOrg ? "#000" : theme.color.text.CHANGED)};
  -webkit-text-fill-color: ${({ value, valueOrg, theme }) => (value === valueOrg ? "#000" : theme.color.text.CHANGED)};
  background-color: ${({ disabled, value, valueOrg, theme }) =>
    disabled ? "rgba(0,0,0,0)" : !value && valueOrg ? theme.color.background.DELETED : "#FFF"};
  border: ${(props) => (props.isError ? `1px solid ${props.theme.color.border.ERROR}` : "unset")};
  text-align: center;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextColumnAny = styled.div<{ disabled: boolean; value: any; valueOrg: any; isError: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ value, valueOrg, theme }) => (isEqual(value, valueOrg) ? "#000" : theme.color.text.CHANGED)};
  -webkit-text-fill-color: ${({ value, valueOrg, theme }) => (isEqual(value, valueOrg) ? "#000" : theme.color.text.CHANGED)};
  background-color: ${({ disabled, value, valueOrg, theme }) =>
    disabled ? "rgba(0,0,0,0)" : isEmpty(value) && !isEmpty(valueOrg) ? theme.color.background.DELETED : "#FFF"};
  border: ${(props) => (props.isError ? `1px solid ${props.theme.color.border.ERROR}` : "unset")};
  text-align: center;
`;

const StyledLabel = styled.div<{ rowStatus: RowStatus }>`
  display: block;
  width: 66px;
  height: 24px;
  padding: 5px 0 !important;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: ${({ rowStatus, theme }) =>
    rowStatus === "Edited" ? "#E6B422" : rowStatus === "Updated" || rowStatus === "Skipped" ? "#76D100" : theme.color.text.CHANGED};
  border-radius: 8px;
  box-sizing: border-box;
`;

const MenuIcon = styled.img.attrs({ src: MenuIconSvg })`
  width: 19px;
  height: 13px;
`;

const menuCustomStyles = (menuTop: number, menuRight: number): Styles => ({
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    position: "absolute",
    width: "238px",
    height: "fit-content",
    top: `${menuTop}px`,
    left: `${menuRight}px`,
    padding: 0,
    backgroundColor: "#fff",
    borderRadius: "5px",
    transition: "opacity 0.25s",
    display: "inline-block",
  },
});

const MenuContainer = styled.div<{ menuTop: number; menuRight: number }>`
  margin: 8px 16px;
  /* &::after {
    content: "";
    position: fixed;
    top: ${({ menuTop }) => `${menuTop + 10}px`};
    left: ${({ menuRight }) => `${menuRight - 10}px`};
    border: 8px solid transparent;
    border-right: 12px solid #fff;
  } */
`;
const MenuItem = styled.div<{ disabled?: boolean }>`
  color: #346181;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  padding: 8px 8px;
  display: flex;
  align-items: center;
`;
const Separator = styled.div`
  height: 0;
  border-bottom: 2px solid #eee;
`;

/// ////////////////////////
// コネクト
/// ////////////////////////
interface ListStateProps {
  oalFlightScheduleState: OalFlightScheduleState;
}

const mapStateToProps = (state: RootState): ListStateProps => ({
  oalFlightScheduleState: state.oalFlightSchedule,
});

export default connect(mapStateToProps)(OalFlightScheduleList);
