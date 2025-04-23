import React, { Component } from "react";
import { Field } from "redux-form";
import styled from "styled-components";
import { toUpperCase } from "../../lib/commonUtil";
import * as validates from "../../lib/validators";
import { FormValues, SpotNoRow } from "../../reducers/spotNumber";
import { SpotInfo } from "../atoms/ArrDepBars";
import TextInput from "../atoms/TextInput";
import { Target } from "../atoms/ArrDepTargetButtons";
import ArrDepTargetButtonsAndBars from "./ArrDepTargetButtonsAndBars";
import ArrDepUpdateStatus from "./ArrDepUpdateStatus";

interface Props {
  formValues?: FormValues;
  spotNoRow: SpotNoRow;
  formIndex: number | null;
  onClickTarget: (target: Target) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: (field: string, value: any) => void;
  dirtyForms: { [id in number]: { arr: boolean; dep: boolean } };
  setDirtyForm: (payload: { givenId: number; isArrDirty: boolean | undefined; isDepDirty: boolean | undefined }) => void;
  removeDirtyForm: (payload: { givenId: number }) => void;
  setFormValues?: (payload: { formValues: FormValues }) => void;
  removeFormValue?: (payload: { givenId: number; formValues: FormValues }) => void;
}

export default class SpotNumberForm extends Component<Props> {
  arrSpotRef = React.createRef<HTMLInputElement>();
  depSpotRef = React.createRef<HTMLInputElement>();
  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.spotNoRow.targetSelect !== this.props.spotNoRow.targetSelect) {
      if (this.props.spotNoRow.targetSelect === "DEP") {
        if (this.depSpotRef.current) {
          this.depSpotRef.current.focus();
        }
      } else if (this.arrSpotRef.current) {
        this.arrSpotRef.current.focus();
      }
    }
  }

  componentWillUnmount() {
    this.props.removeDirtyForm({ givenId: this.props.spotNoRow.givenId });
    if (this.props.removeFormValue != null && this.props.formValues) {
      this.props.removeFormValue({
        givenId: this.props.spotNoRow.givenId,
        formValues: this.props.formValues,
      });
    }
  }

  getBarProps = ({ isDep }: { isDep: boolean }): SpotInfo | null => {
    const legInfo = isDep ? this.props.spotNoRow.dep.legInfo : this.props.spotNoRow.arr.legInfo;
    if (!legInfo) return null;
    return {
      alCd: legInfo.alCd,
      fltNo: legInfo.fltNo,
      casFltNo: legInfo.casFltNo,
      lstDepApoCd: legInfo.lstDepApoCd,
      lstArrApoCd: legInfo.lstArrApoCd,
      orgSpotNo: legInfo.spotNo,
    };
  };

  changeFieldToUpperCase = (e: React.FocusEvent<HTMLInputElement> | undefined, fieldName: string) => {
    if (e) {
      this.props.change(fieldName, toUpperCase(e.target.value));
    }
  };

  handleSubmitKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.key === "Enter") {
      this.props.change(fieldName, toUpperCase(e.target.value));
    }
  };

  setForceDirty = (e: React.ChangeEvent<HTMLInputElement>, field: "arr" | "dep") => {
    const value = e.target.value.toUpperCase();
    const initial = this.props.spotNoRow[field].legInfo?.spotNo;
    const payload: Parameters<Props["setDirtyForm"]>[0] = {
      givenId: this.props.spotNoRow.givenId,
      isArrDirty: field === "arr" ? value !== initial : undefined,
      isDepDirty: field === "dep" ? value !== initial : undefined,
    };
    this.props.setDirtyForm(payload);
  };

  setFormValues = (e: React.ChangeEvent<HTMLInputElement>, field: "arr" | "dep") => {
    if (this.props.setFormValues == null || this.props.formValues == null) return;
    this.props.setFormValues({
      formValues: {
        ...this.props.formValues,
        rows: this.props.formValues.rows.map((row, i) =>
          i === this.props.formIndex ? { ...row, [field]: { ...row[field], spotNo: e.target.value.toUpperCase() } } : row
        ),
      },
    });
  };

  render() {
    const {
      spotNoRow: { givenId, targetSelect, arr, dep },
      formIndex,
      onClickTarget,
      dirtyForms,
    } = this.props;

    const arrDisabled = targetSelect === "ARR_DEP_SAME" ? arr.updateSucceeded || dep.updateSucceeded : arr.updateSucceeded;
    const depDisabled = dep.updateSucceeded;

    return (
      <>
        {givenId ? (
          <StatusWrapper>
            <label>#{givenId}</label>
            <ArrDepUpdateStatus arrStatus={arr.statusValue} depStatus={dep.statusValue} />
          </StatusWrapper>
        ) : (
          <ArrDepUpdateStatus arrStatus={arr.statusValue} depStatus={dep.statusValue} />
        )}
        <ArrDepTargetButtonsAndBars
          targetButtonsFixed={!arr.legInfo || !dep.legInfo || arr.updateSucceeded || dep.updateSucceeded || arr.hasError || dep.hasError}
          selectedTarget={targetSelect}
          onClickTarget={onClickTarget}
          arr={this.getBarProps({ isDep: false })}
          dep={this.getBarProps({ isDep: true })}
        />
        <SpotContainer isArrDepBoth={targetSelect === "ARR_DEP_DIFF"}>
          {formIndex !== null && (targetSelect === "ARR" || targetSelect === "ARR_DEP_SAME" || targetSelect === "ARR_DEP_DIFF") ? (
            <div>
              <div>
                <label>SPOT</label>
                <Field
                  innerRef={this.arrSpotRef}
                  name={`rows[${formIndex}].arr.spotNo`}
                  component={TextInput}
                  width={96}
                  height={36}
                  isShadowOnFocus
                  maxLength={4}
                  isShowEditedColor
                  disabled={arrDisabled}
                  validate={[validates.halfWidthSpot]}
                  componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) =>
                    this.changeFieldToUpperCase(e, `rows[${formIndex}].arr.spotNo`)
                  }
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                  onKeyPress={(e: any) => this.handleSubmitKeyPress(e, `rows[${formIndex}].arr.spotNo`)}
                  props={{
                    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      this.setForceDirty(e, "arr");
                      this.setFormValues(e, "arr");
                    },
                    isForceDirty: dirtyForms[givenId]?.arr,
                  }}
                />
              </div>
            </div>
          ) : null}
          {formIndex !== null && (targetSelect === "DEP" || targetSelect === "ARR_DEP_DIFF") ? (
            <div>
              <div>
                <label>SPOT</label>
                <Field
                  innerRef={this.depSpotRef}
                  name={`rows[${formIndex}].dep.spotNo`}
                  component={TextInput}
                  width={96}
                  height={36}
                  isShadowOnFocus
                  maxLength={4}
                  isShowEditedColor
                  disabled={depDisabled}
                  validate={[validates.halfWidthSpot]}
                  componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) =>
                    this.changeFieldToUpperCase(e, `rows[${formIndex}].dep.spotNo`)
                  }
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                  onKeyPress={(e: any) => this.handleSubmitKeyPress(e, `rows[${formIndex}].dep.spotNo`)}
                  props={{
                    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      this.setForceDirty(e, "dep");
                      this.setFormValues(e, "dep");
                    },
                    isForceDirty: dirtyForms[givenId]?.dep,
                  }}
                />
              </div>
            </div>
          ) : null}
        </SpotContainer>
      </>
    );
  }
}

const StatusWrapper = styled.div`
  display: flex;
  > label {
    font-size: 24px;
    color: #8ea6b7;
    margin: 7px 33px auto 15px;
  }
`;

const SpotContainer = styled.div<{ isArrDepBoth: boolean }>`
  display: flex;
  > div {
    width: ${({ isArrDepBoth }) => (isArrDepBoth ? "50%" : "100%")};
    text-align: left;
    > div {
      width: 96px;
      margin: auto;
      > label {
        font-size: 12px;
      }
    }
  }
`;
