import dayjs from "dayjs";
import React from "react";
import { Field, WrappedFieldInputProps } from "redux-form";
import styled from "styled-components";
import { AsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../store/storeType";
import { NotificationCreator } from "../../../lib/notifications";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { halfWidthApoCd, required } from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/flightMovementValidator";
// import { ThunkAction } from "../../../reducers";
import { MovementInfo, SelectedIrrStsType } from "../../../reducers/flightMovementModal";
import StatusButton from "../../atoms/StatusButton";
import SuggestSelectBox from "../../atoms/SuggestSelectBox";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import { FormValue } from "../../organisms/FlightMovementModal/FlightMovementModal";
import { severErrorItems } from "../../organisms/FlightMovementModal/FlightMovementType";
import ArrowRightIconSvg from "../../../assets/images/icon/arrow_right.svg";

interface Props {
  airports: MasterApi.Airport[];
  initialValues: Partial<FormValue>;
  movementInfo: MovementInfo;
  // eslint-disable-next-line react/no-unused-prop-types
  formName: string;
  formValues: FormValue | undefined;
  reset: () => void;
  showMessage: AsyncThunk<void, { message: NotificationCreator.Message }, { dispatch: AppDispatch }>;
  getIsForceError: (fieldName: keyof typeof severErrorItems) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (fieldName: keyof typeof severErrorItems) => (e: React.ChangeEvent<any> | undefined) => any;
  handleDateTimeInputPopup: (dateTimeValue: string | undefined, fieldName: keyof typeof severErrorItems) => () => void;
  dispatch: AppDispatch;
}

//
class IrregularContent extends React.Component<Props> {
  static formatToDDHHmm(dateTimeValue: string): string {
    if (dateTimeValue && dayjs(dateTimeValue).isValid()) {
      return dayjs(dateTimeValue).format("DDHHmm");
    }
    return "";
  }

  getIrregularStatusLabels(): SelectedIrrStsType[] {
    const {
      movementInfo: {
        arrInfo: { actLdLcl },
        depInfo: { actToLcl, atdLcl },
        irrSts,
      },
    } = this.props;

    if (!actLdLcl && actToLcl && !irrSts) {
      // 飛行中
      return ["ATB", "DIV"];
    }
    if (!actLdLcl && !actToLcl && atdLcl && !irrSts) {
      // 出発空港Taxing中
      return ["GTB"];
    }
    if (!actLdLcl && !actToLcl && !atdLcl && !irrSts) {
      // 実績未設定
      return ["ATB", "DIV"];
    }
    if (irrSts) {
      if (irrSts === "GTB" && !actLdLcl) {
        // GTB発生時
        return ["GTB CNL"];
      }
      if (irrSts === "ATB" && !actLdLcl) {
        // ATB発生時
        return ["ATB CNL"];
      }
      if (irrSts === "DIV" && !actLdLcl) {
        // DIV発生時
        return ["DIV CNL", "DIV COR"];
      }
    }

    return [];
  }

  getSupplementaryText(): string {
    const { formValues } = this.props;

    if (formValues) {
      if (formValues.selectedIrrSts === "ATB") {
        return "*for ATB APT";
      }
      if (formValues.selectedIrrSts === "DIV" || formValues.selectedIrrSts === "DIV COR") {
        return "*for DIV APT";
      }
    }

    return "";
  }

  handleIrregularStatusClick = (input: WrappedFieldInputProps, value: string) => {
    const { formValues, dispatch, showMessage, reset } = this.props;
    const editing = formValues && (formValues.irrInfo.lstArrApoCd || formValues.irrInfo.estLd);
    const checked = input.value === value;
    const update = () => {
      reset();
      input.onChange(checked ? "" : value);
    };

    if (editing) {
      void dispatch(showMessage({ message: SoalaMessage.M40001C({ onYesButton: update }) }));
    } else {
      update();
    }
  };

  visibleArrApoCd(): boolean {
    const { formValues } = this.props;

    return !!formValues && (formValues.selectedIrrSts === "DIV" || formValues.selectedIrrSts === "DIV COR");
  }

  visibleEta(): boolean {
    const { formValues } = this.props;

    return (
      !!formValues &&
      (formValues.selectedIrrSts === "ATB" || formValues.selectedIrrSts === "DIV" || formValues.selectedIrrSts === "DIV COR")
    );
  }

  render() {
    const { initialValues, airports, formValues, handleDateTimeInputPopup } = this.props;
    const irregularStatusLabels = this.getIrregularStatusLabels();
    const visibleArrApoCd = this.visibleArrApoCd();
    const visibleEta = this.visibleEta();
    const supplementaryText = this.getSupplementaryText();

    return (
      <Content>
        <GroupBox marginBottom="8px">
          <IrrStatusRow>
            <label>IRR Status</label>
          </IrrStatusRow>
          <GroupBoxRow>
            <div>
              <RowColumnItem width="51px">{initialValues.irrSts}</RowColumnItem>
            </div>
            <div>
              <RowColumnItem marginLeft="3px">
                <ArrowRightIcon />
              </RowColumnItem>
            </div>
            {irregularStatusLabels.map(
              (irregularStatusLabel, index) =>
                irregularStatusLabel && (
                  <Field
                    option={{ label: irregularStatusLabel, value: irregularStatusLabel }}
                    id={`selectedIrrSts${index}`}
                    name="selectedIrrSts"
                    height="40px"
                    marginLeft="16px"
                    component={StatusButton}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    onClickInput={this.handleIrregularStatusClick}
                  />
                )
            )}
          </GroupBoxRow>
        </GroupBox>
        {(() => {
          if (!visibleArrApoCd && !visibleEta) {
            return <></>;
          }

          return (
            <GroupBox paddingTop="17px" height={visibleArrApoCd && visibleEta ? "168px" : "96px"}>
              {visibleArrApoCd ? (
                <GroupBoxRow>
                  <div>
                    <label>DIV APT</label>
                    <RowColumnItem width="75px">{initialValues.arrInfo ? initialValues.arrInfo.orgArrApoCd : ""}</RowColumnItem>
                  </div>
                  <div>
                    <RowColumnItem marginLeft="3px" marginRight="24px">
                      <ArrowRightIcon />
                    </RowColumnItem>
                  </div>
                  <Field
                    name="irrInfo.lstArrApoCd"
                    width={80}
                    height={40}
                    component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                    options={airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                    maxMenuHeight={170}
                    isShadowOnFocus
                    isShowEditedColor
                    maxLength={3}
                    validate={[required, halfWidthApoCd]}
                    isForceError={this.props.getIsForceError("irrInfo.lstArrApoCd")}
                    onChange={this.props.onChange("irrInfo.lstArrApoCd")}
                  />
                </GroupBoxRow>
              ) : null}
              {visibleEta ? (
                <GroupBoxRow marginTop={visibleArrApoCd ? "20px" : undefined}>
                  <div>
                    <label>ETA(L/D)</label>
                    <RowColumnItem width="75px">
                      {initialValues.arrInfo && initialValues.arrInfo.orgEtaLd
                        ? dayjs(initialValues.arrInfo.orgEtaLd).format("DDHHmm")
                        : ""}
                    </RowColumnItem>
                  </div>
                  <div>
                    <RowColumnItem marginLeft="3px" marginRight="24px">
                      <ArrowRightIcon />
                    </RowColumnItem>
                  </div>
                  <Field
                    name="irrInfo.estLd"
                    width={96}
                    height={40}
                    component={TextInput}
                    placeholder="ddhhmm"
                    fontSizeOfPlaceholder={17}
                    showKeyboard={handleDateTimeInputPopup((formValues && formValues.irrInfo.estLd) || "", "irrInfo.estLd")}
                    displayValue={IrregularContent.formatToDDHHmm((formValues && formValues.irrInfo.estLd) || "")}
                    maxLength={6}
                    validate={[required, myValidates.rangeMovementDate]}
                    isShadowOnFocus
                    isShowEditedColor
                    isForceError={this.props.getIsForceError("irrInfo.estLd")}
                    onChange={this.props.onChange("irrInfo.estLd")}
                  />
                  {supplementaryText ? <SupplementaryText>{supplementaryText}</SupplementaryText> : null}
                </GroupBoxRow>
              ) : null}
            </GroupBox>
          );
        })()}
      </Content>
    );
  }
}

const Content = styled.div`
  padding-top: 8px;
`;

const SupplementaryText = styled.div`
  font-size: 12px;
  margin-left: 8px;
  height: 40px;
  justify-content: center;
`;

const GroupBox = styled.div<{ pinkColor?: boolean; paddingTop?: string; height?: string; marginBottom?: string }>`
  padding: ${({ paddingTop }) => paddingTop || "10px"} 13px 0 13px;
  margin-bottom: ${({ marginBottom }) => marginBottom || "0"};
  width: 100%;
  height: ${({ height }) => height || "88px"};
  border: 1px solid #222;
  background-color: ${({ pinkColor }) => (pinkColor ? "#E5C7C6" : "#FFF")};
  div::before {
    z-index: 0;
  }
`;

const GroupBoxRow = styled.div<{ marginTop?: string }>`
  display: flex;
  align-items: flex-end;
  margin-top: ${({ marginTop }) => marginTop || "0"};

  > div {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    label {
      font-size: 12px;
    }
  }
`;

const ArrowRightIcon = styled.img.attrs({ src: ArrowRightIconSvg })`
  vertical-align: bottom;
`;

const RowColumnItem = styled.div<{ width?: string; marginLeft?: string; marginRight?: string }>`
  display: flex;
  align-items: center;
  height: 40px;
  ${({ width }) => (width ? `width: ${width}` : "")};
  ${({ marginLeft }) => (marginLeft ? `margin-left: ${marginLeft}` : "")};
  ${({ marginRight }) => (marginRight ? `margin-right: ${marginRight}` : "")};
`;

const IrrStatusRow = styled.div`
  font-size: 12px;
  margin-bottom: 2px;
`;

export default IrregularContent;
