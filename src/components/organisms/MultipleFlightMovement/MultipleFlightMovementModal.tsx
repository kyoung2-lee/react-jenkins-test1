import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Styles } from "react-modal";
import { InjectedFormProps, FormSubmitHandler, Field, FieldArray, FieldArrayFieldsProps } from "redux-form";
import styled from "styled-components";
import { List } from "immutable";
import useScrollbarSize from "react-scrollbar-size";
import findindex from "lodash.findindex";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { NotificationCreator } from "../../../lib/notifications";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { storage } from "../../../lib/storage";
import { storageOfUser } from "../../../lib/StorageOfUser";
import * as validates from "../../../lib/validators";
// eslint-disable-next-line import/no-cycle
import { requiredEtaLd, requiredEtd } from "../../../lib/validators/MultipleFlightMovementValidator";
import layoutStyle from "../../../styles/layoutStyle";
import RoundButtonReload from "../../atoms/RoundButtonReload";
import SelectBox from "../../atoms/SelectBox";
import PrimaryButton from "../../atoms/PrimaryButton";
import TextInput from "../../atoms/TextInput";
import RawTextInput from "../../atoms/RawTextInput";
import TimeInputPlusMinusButtons from "../../molecules/TimeInputPlusMinusButtons";

import {
  MultipleFlightMovementModal as MultipleFlightMovementModalState,
  FormValues,
  RowFormValues,
  LoadLeg,
  RowStatus,
  fetchMultipleFlightMovement,
  focusToMultipleFlightMovement,
  closeMultipleFlightMovement,
  updateMultipleFlightMovement,
  valueChanged,
  plusMinusEtaLd,
  plusMinusEtd,
  copySkdToEtd,
} from "../../../reducers/multipleFlightMovementModals";
import DraggableModalFree from "../../molecules/DraggableModalFree";
import FreeModalHeader from "../../molecules/FreeModalHeader";
import { FisRow } from "../../../reducers/fisType";
import { StatusLabel } from "./MultipleFlightMovementRowStatus";
import { getfisStsOptions, severErrorItems } from "../FlightMovementModal/FlightMovementType";

export interface MyProps {
  isDep: boolean;
  modal: MultipleFlightMovementModalState;
  rowStatusList: RowStatus[];
  initialValues: FormValues;
  filteredFisRows: List<{ date: string; fis: FisRow }>;
  fisCenterContentRef: React.RefObject<HTMLInputElement>;
}

type Props = MyProps & InjectedFormProps<FormValues, MyProps>;

export const MultipleFlightMovementModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const common = useAppSelector((state) => state.common);
  const formContentRef = useRef<HTMLFormElement>(null);
  const [isBbEditing, setIsBbEditing] = useState(false);
  const [modalWidth, setModalWidth] = useState(0);
  const [flightLinesSubmited, setFlightLinesSubmited] = useState(false);
  const [displayFlightLines, setDisplayFlightLines] = useState("5");
  const [initialDisplayFlightLines, setInitialDisplayFlightLines] = useState("5");
  const [loadDisplayFlight, setLoadDisplayFlight] = useState(false);
  const [resizeFlg, setResizeFlg] = useState(false);
  const scrollbarWidth = useScrollbarSize().width;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    change,
    isDep,
    modal: { isOpen, selectedLegKey, isFetching },
  } = props;

  const tentativeOptions = useMemo(
    () => [
      { label: "MNR", value: "MNR" },
      { label: "TTV", value: "TTV" },
      { label: "UNK", value: "UNK" },
    ],
    []
  );

  const leftPosition = useMemo(() => {
    if (resizeFlg) setResizeFlg(false);
    if (props.fisCenterContentRef.current) {
      const centerContentWidth = props.fisCenterContentRef.current.getBoundingClientRect().width;
      const centerContentLeft = props.fisCenterContentRef.current.getBoundingClientRect().left;
      if (isDep) {
        return centerContentLeft + centerContentWidth - modalWidth;
      }
      return centerContentLeft;
    }
    return 0;
  }, [isDep, modalWidth, props.fisCenterContentRef, resizeFlg]);

  useEffect(() => {
    // 上下ボタンで特定のフィールドをフォーカス移動する処理
    const handleKeyDown = (event: KeyboardEvent) => {
      const form = formContentRef.current;
      if (form) {
        const currentFocus = document.activeElement as HTMLInputElement;
        if (currentFocus && /\bmainField\b/.test(currentFocus.className)) {
          const fields = form.querySelectorAll<HTMLInputElement>(".mainField");
          const currentIndex = Array.from(fields).indexOf(currentFocus);
          if (event.key === "ArrowUp") {
            if (currentIndex >= 1) {
              fields[currentIndex - 1].focus();
              fields[currentIndex - 1].select(); // 全選択
            }
            event.preventDefault();
          } else if (event.key === "ArrowDown") {
            if (currentIndex < fields.length - 1) {
              fields[currentIndex + 1].focus();
              fields[currentIndex + 1].select(); // 全選択
            }
            event.preventDefault();
          }
        }
      }
    };

    let resizeTimeout: number | undefined;
    // デバウンスを使ってリサイズが完了したイベントを補足
    const triggerResize = () => {
      clearTimeout(resizeTimeout); // すでにタイマーがセットされていたらクリア
      resizeTimeout = window.setTimeout(() => {
        setResizeFlg(true);
      }, 200); // 200ms 後にリサイズが完了したとみなす
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", triggerResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", triggerResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // 便区間表示件数の取得
      const storageDisplayFlightLines = storageOfUser.getDisplayFlightLines({ isDep });
      setDisplayFlightLines(storageDisplayFlightLines ? storageDisplayFlightLines.toString() : "5");
      setInitialDisplayFlightLines(storageDisplayFlightLines ? storageDisplayFlightLines.toString() : "5");
      setLoadDisplayFlight(true); // displayFlightLinesが反映されてからデータ読み込みを行いたい為
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (loadDisplayFlight) {
      loadFlightData();
      setLoadDisplayFlight(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDisplayFlight]);

  useEffect(() => {
    setModalWidth((isDep ? 690 : 624) + scrollbarWidth);
  }, [isDep, scrollbarWidth]);

  // FIS画面に表示されている便区間を取得する
  const getFisFlightData = useCallback(() => {
    if (!selectedLegKey) return null;
    const fligntLines = Number(displayFlightLines);
    if (Number.isNaN(fligntLines)) return null;
    const loadLegList: LoadLeg[] = [];

    let rowIndex = props.filteredFisRows.findIndex((r) => {
      const legData = isDep ? r.fis.dep : r.fis.arr;
      if (legData) {
        return (
          legData.orgDateLcl === selectedLegKey.orgDateLcl &&
          legData.alCd === selectedLegKey.alCd &&
          legData.fltNo === selectedLegKey.fltNo &&
          legData.casFltNo === selectedLegKey.casFltNo &&
          legData.skdDepApoCd === selectedLegKey.skdDepApoCd &&
          legData.skdArrApoCd === selectedLegKey.skdArrApoCd &&
          legData.skdLegSno === selectedLegKey.skdLegSno
        );
      }
      return false;
    });
    if (rowIndex < 0) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40027C({}) });
      return null;
    }
    const fisArray = props.filteredFisRows.toArray();
    while (fligntLines > 0 && loadLegList.length < fligntLines) {
      rowIndex = findindex(
        fisArray,
        (r) => {
          if (isDep && r.fis.dep) {
            return r.fis.dep.legCnlFlg === false;
          }
          if (!isDep && r.fis.arr) {
            return r.fis.arr.legCnlFlg === false && r.fis.isDivAtbOrgApo === false;
          }
          return false;
        },
        rowIndex
      );
      if (rowIndex < 0) {
        break;
      } else {
        const legData = isDep ? fisArray[rowIndex].fis.dep : fisArray[rowIndex].fis.arr;
        if (legData) {
          const { orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno, isOal } = legData;
          const { arrOrgApoCd, depDstApoCd } = fisArray[rowIndex].fis;
          loadLegList.push({
            legKey: {
              orgDateLcl,
              alCd,
              fltNo,
              casFltNo: casFltNo || "",
              skdDepApoCd,
              skdArrApoCd,
              skdLegSno,
            },
            isOal,
            arrOrgApoCd,
            depDstApoCd,
          });
        }
        rowIndex += 1;
      }
    }
    return loadLegList;
  }, [dispatch, displayFlightLines, isDep, props.filteredFisRows, selectedLegKey]);

  // データ読み込み
  const loadFlightData = () => {
    const loadLegList = getFisFlightData();
    if (loadLegList) {
      void dispatch(fetchMultipleFlightMovement({ loadLegList, isDep })).then(() => {
        const form = formContentRef.current;
        if (form) {
          const fields = form.querySelectorAll<HTMLInputElement>(".mainField");
          if (fields.length > 0) {
            fields[0].focus();
            fields[0].select(); // 全選択
          }
        }
      });
    }
  };

  const handleFocus = () => {
    dispatch(focusToMultipleFlightMovement({ isDep }));
  };

  const handleClose = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation();
    }
    const executeClose = () => {
      void dispatch(closeMultipleFlightMovement({ isDep }));
    };
    if (props.rowStatusList.find((s) => s.status === "Edited" || s.status === "Error" || s.status === "Failed")) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: executeClose }) });
    } else {
      executeClose();
    }
  };

  const headerElement = useMemo(
    () => <FreeModalHeader legkey={props.modal.selectedLegKey} isDep={isDep} />,
    [props.modal.selectedLegKey, isDep]
  );

  const handleClickClose = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation();
    }
    const onClose = () => {
      setIsBbEditing(false);
      handleClose(e);
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

  const handleOnChange = useCallback(
    ({ rowIndex, fieldName }: { rowIndex: number; fieldName: keyof typeof severErrorItems }) =>
      () => {
        // formの値が反映された後に実行する
        setTimeout(() => {
          void dispatch(valueChanged({ isDep, rowIndex, fieldName }));
        }, 10);
      },
    [dispatch, isDep]
  );

  const correctToUpperValue = useCallback(
    ({ e, fullFieldName }: { e: React.FocusEvent<HTMLInputElement> | undefined; fullFieldName: string }) => {
      if (e) {
        const upperValue = e.target.value.toUpperCase();
        if (upperValue !== e.target.value) {
          change(fullFieldName, upperValue);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const checkDisplayFlightLines = useCallback((value: string): number => {
    if (!value) {
      return -1;
    }
    const checkedValue = Number(value);
    if (Number.isNaN(checkedValue) || !(checkedValue >= 1 && checkedValue <= 20)) {
      return -2;
    }
    return checkedValue;
  }, []);

  const handleReload = () => {
    const checkedValue = checkDisplayFlightLines(displayFlightLines);
    setFlightLinesSubmited(true);
    if (checkedValue === -1) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M50016C() });
      return;
    }
    if (checkedValue < 0) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M50032C() });
      return;
    }

    const executeLoadData = () => {
      setFlightLinesSubmited(false);
      // ストレージへの保存
      storageOfUser.saveDisplayFlightLines({ isDep, displayFlightLines: checkedValue });
      // 初期値の設定
      setInitialDisplayFlightLines(checkedValue.toString());
      // データ読み込み
      loadFlightData();
    };

    if (props.rowStatusList.find((s) => s.status === "Edited" || s.status === "Error" || s.status === "Failed")) {
      NotificationCreator.create({
        dispatch,
        message: SoalaMessage.M40011C({ onYesButton: executeLoadData }),
      });
    } else {
      executeLoadData();
    }
  };

  const renderRowsArr = useCallback(
    (fp: { fields: FieldArrayFieldsProps<RowFormValues> }) => (
      <>
        {fp.fields.map((rowName, rowIndex) => {
          const initialValue = props.initialValues.rows[rowIndex];
          const fisOptions = initialValue ? getfisStsOptions(initialValue.fisFltSts, false, initialValue.isOal) : [];
          return (
            <RowArr key={initialValue.rowNo}>
              <div>
                <StatusLabel isDep={false} rowIndex={rowIndex} />
              </div>
              <div>
                <AirLineCode casFltNo={initialValue.casFltNo}>
                  {initialValue.casFltNo ? (
                    <span className="casFltNo">{initialValue.casFltNo}</span>
                  ) : (
                    <span>{initialValue.alCd + initialValue.fltNo}</span>
                  )}
                  {`/${initialValue.orgDay}`}
                </AirLineCode>
              </div>
              <div>{initialValue.arrOrgApoCd}</div>
              <div>
                <Field
                  name={`${rowName}.fisFltSts`}
                  width="100%"
                  height={40}
                  component={SelectBox}
                  options={fisOptions}
                  disabled={initialValue.legCnlFlg || initialValue.isDivAtbOrgApo}
                  hasBlank
                  maxMenuHeight={350}
                  onSelect={handleOnChange({ rowIndex, fieldName: "fisFltSts" })}
                  isShadowOnFocus
                  isShowEditedColor
                  isSearchable
                />
              </div>
              <div>{initialValue.arrInfo.sta}</div>
              <div>
                <TimeInputPlusMinusButtons
                  onClickPlusCustomEvent={() => {
                    void dispatch(plusMinusEtaLd({ rowIndex, isPlus: true }));
                  }}
                  onClickMinusCustomEvent={() => {
                    void dispatch(plusMinusEtaLd({ rowIndex, isPlus: false }));
                  }}
                  disabled={initialValue.legCnlFlg || initialValue.isDivAtbOrgApo}
                  showDisabled
                  notFocus
                >
                  <Field
                    className="mainField"
                    name={`${rowName}.arrInfo.etaLd`}
                    width={58}
                    height={40}
                    type="text"
                    component={TextInput}
                    placeholder="hhmm"
                    fontSizeOfPlaceholder={14}
                    maxLength={4}
                    disabled={initialValue.legCnlFlg || initialValue.isDivAtbOrgApo}
                    validate={[requiredEtaLd, validates.time]}
                    componentOnBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      correctToUpperValue({ e, fullFieldName: `${rowName}.arrInfo.etaLd` });
                    }}
                    handleInputChange={handleOnChange({ rowIndex, fieldName: "arrInfo.etaLd" })}
                    isShadowOnFocus
                    isShowEditedColor
                  />
                </TimeInputPlusMinusButtons>
              </div>
              <div>
                <Field
                  name={`${rowName}.arrInfo.etaLdCd`}
                  width="100%"
                  height={40}
                  component={SelectBox}
                  options={tentativeOptions}
                  disabled={initialValue.legCnlFlg || initialValue.isDivAtbOrgApo}
                  hasBlank
                  onSelect={handleOnChange({ rowIndex, fieldName: "arrInfo.etaLdCd" })}
                  isShadowOnFocus
                  isShowEditedColor
                  isSearchable
                />
              </div>
            </RowArr>
          );
        })}
      </>
    ),
    [correctToUpperValue, dispatch, handleOnChange, props.initialValues.rows, tentativeOptions]
  );

  const renderRowsDep = useCallback(
    (fp: { fields: FieldArrayFieldsProps<RowFormValues> }) => (
      <>
        {fp.fields.map((rowName, rowIndex) => {
          const initialValue = props.initialValues.rows[rowIndex];
          const fisOptions = getfisStsOptions(initialValue.fisFltSts, false, initialValue.isOal);
          return (
            <RowDep key={initialValue.rowNo}>
              <div>
                <StatusLabel isDep rowIndex={rowIndex} />
              </div>
              <div>
                <AirLineCode casFltNo={initialValue.casFltNo}>
                  {initialValue.casFltNo ? (
                    <span className="casFltNo">{initialValue.casFltNo}</span>
                  ) : (
                    <span>{initialValue.alCd + initialValue.fltNo}</span>
                  )}
                  {`/${initialValue.orgDay}`}
                </AirLineCode>
              </div>
              <div>{initialValue.depDstApoCd}</div>
              <div>
                <Field
                  name={`${rowName}.fisFltSts`}
                  width="100%"
                  height={40}
                  component={SelectBox}
                  options={fisOptions}
                  disabled={initialValue.legCnlFlg}
                  hasBlank
                  maxMenuHeight={350}
                  onSelect={handleOnChange({ rowIndex, fieldName: "fisFltSts" })}
                  isShadowOnFocus
                  isShowEditedColor
                  isSearchable
                />
              </div>
              <div>{initialValue.depInfo.std}</div>
              <div>
                <TimeInputPlusMinusButtons
                  onClickPlusCustomEvent={() => {
                    void dispatch(plusMinusEtd({ rowIndex, isPlus: true }));
                  }}
                  onClickMinusCustomEvent={() => {
                    void dispatch(plusMinusEtd({ rowIndex, isPlus: false }));
                  }}
                  disabled={initialValue.legCnlFlg}
                  showDisabled
                  notFocus
                >
                  <Field
                    className="mainField"
                    name={`${rowName}.depInfo.etd`}
                    width={58}
                    height={40}
                    type="text"
                    component={TextInput}
                    placeholder="hhmm"
                    fontSizeOfPlaceholder={14}
                    maxLength={4}
                    disabled={initialValue.legCnlFlg}
                    validate={!initialValue.depInfo.std ? [requiredEtd, validates.time] : [requiredEtd, validates.timeOrSkd]}
                    componentOnBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      correctToUpperValue({ e, fullFieldName: `${rowName}.depInfo.etd` });
                    }}
                    handleInputChange={handleOnChange({ rowIndex, fieldName: "depInfo.etd" })}
                    isShadowOnFocus
                    isShowEditedColor
                  />
                </TimeInputPlusMinusButtons>
              </div>
              <div>
                <PrimaryButton
                  type="button"
                  text="SKD"
                  height="40px"
                  disabled={initialValue.legCnlFlg || !initialValue.depInfo.std}
                  onClick={() => {
                    void dispatch(copySkdToEtd({ rowIndex }));
                  }}
                  tabIndex={-1}
                />
              </div>
              <div>
                <Field
                  name={`${rowName}.depInfo.etdCd`}
                  width="100%"
                  height={40}
                  component={SelectBox}
                  options={tentativeOptions}
                  disabled={initialValue.legCnlFlg}
                  hasBlank
                  onSelect={handleOnChange({ rowIndex, fieldName: "depInfo.etdCd" })}
                  isShadowOnFocus
                  isShowEditedColor
                  isSearchable
                />
              </div>
            </RowDep>
          );
        })}
      </>
    ),
    [correctToUpperValue, dispatch, handleOnChange, props.initialValues.rows, tentativeOptions]
  );

  return (
    <>
      {props.modal.focusedAt ? (
        <DraggableModalFree
          isOpen={props.modal.isOpen}
          style={customStyles((800000000 + Math.round((props.modal.focusedAt.getTime() - common.initDate.getTime()) / 100)) % 900000000)} // 800..番台でz-indexを設定(精度を下げて有効桁数を増やす為、下2桁を丸める)
          header={headerElement}
          onFocus={handleFocus}
          onClose={handleClickClose}
          width={modalWidth}
          height={100}
          top={(storage.isPc ? parseInt(layoutStyle.header.default, 10) : parseInt(layoutStyle.header.tablet, 10)) + 24 + 28}
          left={leftPosition}
        >
          <Container>
            <FormContent onSubmit={props.handleSubmit} ref={formContentRef} autoComplete="off">
              {!isDep ? (
                <>
                  <SubHeaderArr>
                    <div />
                    <div>Flight</div>
                    <div>ORG</div>
                    <div>Status</div>
                    <div>STA</div>
                    <div>ETA(L/D)</div>
                    <div>M/T/U</div>
                  </SubHeaderArr>
                  <ScrollArea displayFlightLines={Number(initialDisplayFlightLines)}>
                    <FieldArray name="rows" component={renderRowsArr} /* validate={validate} */ />
                  </ScrollArea>
                </>
              ) : (
                <>
                  <SubHeaderDep>
                    <div />
                    <div>Flight</div>
                    <div>DST</div>
                    <div>Status</div>
                    <div>STD</div>
                    <div>ETD</div>
                    <div />
                    <div>M/T/U</div>
                  </SubHeaderDep>
                  <ScrollArea displayFlightLines={Number(initialDisplayFlightLines)}>
                    <FieldArray name="rows" component={renderRowsDep} />
                  </ScrollArea>
                </>
              )}
              <Footer>
                <PrimaryButton
                  type="submit"
                  text="Update"
                  width="110px"
                  disabled={!props.rowStatusList.find((s) => s.status === "Edited")}
                />
                <FlightLineArea>
                  <div>
                    Display Flight
                    <br />
                    lines(max20)
                  </div>
                  <div>
                    <FlightLineInput
                      value={displayFlightLines}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.value) {
                          const value = Number(e.target.value);
                          if (!Number.isNaN(value)) {
                            setDisplayFlightLines(Math.abs(value).toString());
                          }
                        } else {
                          setDisplayFlightLines("");
                        }
                      }}
                      maxLength={2}
                      type="text"
                      disabled={false}
                      isShadowOnFocus
                      isFixedFocus={false}
                      isDirty={displayFlightLines !== initialDisplayFlightLines}
                      isForceError={flightLinesSubmited && checkDisplayFlightLines(displayFlightLines) < 0}
                      terminalCat={storage.terminalCat}
                    />
                  </div>
                  <div>
                    <RoundButtonReload scale={0.7} isFetching={isFetching} onClick={handleReload} />
                  </div>
                </FlightLineArea>
              </Footer>
            </FormContent>
          </Container>
        </DraggableModalFree>
      ) : (
        <></>
      )}
    </>
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

const Container = styled.div``;

const FormContent = styled.form`
  font-size: 18px;
`;

const SubHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  background: #2799c6;
  font-size: 12px;
  color: #fff;
  height: 20px;
  margin-top: 8px;
`;

const SubHeaderArr = styled(SubHeader)`
  > div:nth-child(1) {
    flex-basis: 81px;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    padding: 0 40px;
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
`;

const SubHeaderDep = styled(SubHeader)`
  > div:nth-child(1) {
    flex-basis: 81px;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    padding: 0 40px;
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 4px;
    flex-basis: 64px;
  }
  > div:nth-child(8) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
`;

const ScrollArea = styled.div<{ displayFlightLines: number }>`
  padding: 8px 0 calc(48px * 2) 0;
  overflow-y: auto;
  min-height: calc(48px * 5 + 8px);
  max-height: calc(48px * 12 + 8px);
  height: ${({ displayFlightLines }) => `calc(48px * ${displayFlightLines + 2} + 8px)`};
`;

const Row = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
`;

const RowArr = styled(Row)`
  > div:nth-child(1) {
    flex-basis: 81px;
    display: flex;
    justify-content: center;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 7px;
    flex-basis: 74px;
  }
`;

const RowDep = styled(Row)`
  > div:nth-child(1) {
    flex-basis: 81px;
    display: flex;
    justify-content: center;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 4px;
    flex-basis: 64px;
  }
  > div:nth-child(8) {
    margin: 0 7px;
    flex-basis: 74px;
  }
`;

const AirLineCode = styled.div<{ casFltNo: string | null }>`
  span.casFltNo {
    ${({ casFltNo }) => (casFltNo && casFltNo.length > 8 ? "font-size: 12px" : casFltNo && casFltNo.length > 6 ? "font-size: 14px" : "")};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 6px;
  height: 67px;
  width: 100%;
`;

const FlightLineArea = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
  align-items: center;
  height: 44px;
  width: 100%;
  pointer-events: none;
  > div {
    pointer-events: auto;
  }
  > div:nth-child(1) {
    font-size: 12px;
    padding-right: 8px;
    line-height: 15px;
  }
`;

const FlightLineInput = styled(RawTextInput)`
  width: 40px;
  height: 40px;
  font-size: 18px;
  text-align: right;
`;

export const onSubmit: FormSubmitHandler<FormValues, MyProps> = (formValues, dispatch, props) => {
  if (!props.rowStatusList.find((s) => s.status === "Edited")) return;
  const { isDep } = props;
  dispatch(updateMultipleFlightMovement({ isDep, formValues }));
};

export default MultipleFlightMovementModal;
