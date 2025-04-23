import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Field, FormSubmitHandler, InjectedFormProps, reduxForm, getFormValues } from "redux-form";
import styled from "styled-components";
import { RootState, AppDispatch } from "../../store/storeType";
import { useAppDispatch, useAppSelector, usePrevious } from "../../store/hooks";
import { toUpperCase } from "../../lib/commonUtil";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import * as validates from "../../lib/validators";
import { FormValues, Target, closeOalAircraftModal, targetSelected, updateOalAircraft } from "../../reducers/oalAircraft";
import { EqpInfo } from "../atoms/ArrDepBars";
import { ArrDep } from "../atoms/PopupCommonHeader";
import PrimaryButton from "../atoms/PrimaryButton";
import TextInput from "../atoms/TextInput";
import CommonPopupModal from "../molecules/CommonPopupModal";
import ArrDepTargetButtonsAndBars from "../molecules/ArrDepTargetButtonsAndBars";
import ArrDepUpdateStatus from "../molecules/ArrDepUpdateStatus";

type Props = InjectedFormProps<FormValues>;

const OalAircraft: React.FC<Props> = (props) => {
  const arrShipNoRef = useRef<HTMLInputElement>(null);
  const depShipNoRef = useRef<HTMLInputElement>(null);

  const oalAircraftState = useAppSelector((state) => state.oalAircraft);
  const prevTargetSelect = usePrevious(oalAircraftState.targetSelect);
  const dispatch = useAppDispatch();

  const [arrDisabled, setArrDisabled] = useState(false);
  const [depDisabled, setDepDisabled] = useState(false);

  useEffect(() => {
    setArrDisabled(
      oalAircraftState.targetSelect === "ARR_DEP_SAME"
        ? oalAircraftState.arr.updateSucceeded || oalAircraftState.dep.updateSucceeded
        : oalAircraftState.arr.updateSucceeded
    );
    setDepDisabled(oalAircraftState.dep.updateSucceeded);
  }, [oalAircraftState.arr.updateSucceeded, oalAircraftState.dep.updateSucceeded, oalAircraftState.targetSelect]);

  useEffect(() => {
    if (prevTargetSelect !== oalAircraftState.targetSelect) {
      if (oalAircraftState.targetSelect === "DEP" || oalAircraftState.targetSelect === "ARR_DEP_SAME") {
        if (depShipNoRef.current) {
          depShipNoRef.current.focus();
        }
      } else if (arrShipNoRef.current) {
        arrShipNoRef.current.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oalAircraftState.targetSelect]);

  const changeFieldToUpperCase = (e: React.FocusEvent<HTMLInputElement> | undefined, fieldName: string) => {
    if (e) {
      props.change(fieldName, toUpperCase(e.target.value));
    }
  };

  const handleSubmitKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.key === "Enter") {
      props.change(fieldName, toUpperCase(e.target.value));
    }
  };

  const handleRequestClose = () => {
    if (props.dirty) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: () => dispatch(closeOalAircraftModal()) }) });
    } else {
      dispatch(closeOalAircraftModal());
    }
  };

  const handleClickTarget = (target: Target) => {
    if (props.dirty && target !== oalAircraftState.targetSelect) {
      const onYesButton = () => {
        props.reset();
        dispatch(targetSelected({ target }));
      };
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40012C({ onYesButton }) });
    } else {
      dispatch(targetSelected({ target }));
    }
  };

  const getHeaderInfo = ({ isDep }: { isDep: boolean }): ArrDep | null => {
    const legInfo = isDep ? oalAircraftState.dep.legInfo : oalAircraftState.arr.legInfo;
    if (!legInfo) return null;
    return {
      orgDateLcl: legInfo.orgDateLcl,
      alCd: legInfo.alCd,
      fltNo: legInfo.fltNo,
      casFltNo: legInfo.casFltNo,
      csFlg: legInfo.csFlg,
    };
  };

  const getBarProps = ({ isDep }: { isDep: boolean }): EqpInfo | null => {
    const legInfo = isDep ? oalAircraftState.dep.legInfo : oalAircraftState.arr.legInfo;
    if (!legInfo) return null;
    return {
      alCd: legInfo.alCd,
      fltNo: legInfo.fltNo,
      casFltNo: legInfo.casFltNo,
      lstDepApoCd: legInfo.lstDepApoCd,
      lstArrApoCd: legInfo.lstArrApoCd,
      orgShipNo: legInfo.shipNo || "",
      orgEqp: legInfo.shipTypeIataCd,
    };
  };

  return (
    <CommonPopupModal
      isOpen={oalAircraftState.isOpen}
      onRequestClose={handleRequestClose}
      height={440}
      arr={getHeaderInfo({ isDep: false })}
      dep={getHeaderInfo({ isDep: true })}
    >
      <EqpForm onSubmit={props.handleSubmit}>
        <div>
          <ArrDepUpdateStatus arrStatus={oalAircraftState.arr.statusValue} depStatus={oalAircraftState.dep.statusValue} />
          <ArrDepTargetButtonsAndBars
            targetButtonsFixed={
              !oalAircraftState.arr.legInfo ||
              !oalAircraftState.dep.legInfo ||
              oalAircraftState.arr.updateSucceeded ||
              oalAircraftState.dep.updateSucceeded ||
              oalAircraftState.arr.hasError ||
              oalAircraftState.dep.hasError
            }
            selectedTarget={oalAircraftState.targetSelect}
            onClickTarget={handleClickTarget}
            arr={getBarProps({ isDep: false })}
            dep={getBarProps({ isDep: true })}
          />
          <EqpBox>
            {oalAircraftState.targetSelect === "ARR" || oalAircraftState.targetSelect === "ARR_DEP_DIFF" ? (
              <ArrDepGroupBox isArrDepBoth={oalAircraftState.targetSelect === "ARR_DEP_DIFF"}>
                <div>
                  <GroupBoxRow>
                    <label>SHIP</label>
                    <Field
                      innerRef={arrShipNoRef}
                      name="arr.shipNo"
                      component={TextInput}
                      width={144}
                      height={40}
                      disabled={arrDisabled}
                      isShadowOnFocus
                      maxLength={10}
                      componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "arr.shipNo")}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) =>
                        handleSubmitKeyPress(e, "arr.shipNo")
                      }
                      validate={[validates.lengthShip, validates.halfWidthShip]}
                      isShowEditedColor
                    />
                  </GroupBoxRow>
                  <GroupBoxRow>
                    <label>EQP</label>
                    <Field
                      name="arr.eqp"
                      component={TextInput}
                      width={72}
                      height={40}
                      disabled={arrDisabled}
                      isShadowOnFocus
                      maxLength={3}
                      componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "arr.eqp")}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) =>
                        handleSubmitKeyPress(e, "arr.eqp")
                      }
                      validate={[validates.required, validates.isEQP]}
                      isShowEditedColor
                    />
                  </GroupBoxRow>
                </div>
              </ArrDepGroupBox>
            ) : null}
            {oalAircraftState.targetSelect === "DEP" ||
            oalAircraftState.targetSelect === "ARR_DEP_SAME" ||
            oalAircraftState.targetSelect === "ARR_DEP_DIFF" ? (
              <ArrDepGroupBox isArrDepBoth={oalAircraftState.targetSelect === "ARR_DEP_DIFF"}>
                <div>
                  <GroupBoxRow>
                    <label>SHIP</label>
                    <Field
                      innerRef={depShipNoRef}
                      name="dep.shipNo"
                      component={TextInput}
                      width={144}
                      height={40}
                      disabled={depDisabled}
                      isShadowOnFocus
                      maxLength={10}
                      componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "dep.shipNo")}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) =>
                        handleSubmitKeyPress(e, "dep.shipNo")
                      }
                      validate={[validates.lengthShip, validates.halfWidthShip]}
                      isShowEditedColor
                    />
                  </GroupBoxRow>
                  <GroupBoxRow>
                    <label>EQP</label>
                    <Field
                      name="dep.eqp"
                      component={TextInput}
                      width={72}
                      height={40}
                      disabled={depDisabled}
                      isShadowOnFocus
                      maxLength={3}
                      componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "dep.eqp")}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) =>
                        handleSubmitKeyPress(e, "dep.eqp")
                      }
                      validate={[validates.required, validates.isEQP]}
                      isShowEditedColor
                    />
                  </GroupBoxRow>
                </div>
              </ArrDepGroupBox>
            ) : null}
          </EqpBox>
        </div>
        <FooterContainer>
          <PrimaryButton type="submit" text="Update" width="100px" disabled={!props.dirty} />
        </FooterContainer>
      </EqpForm>
    </CommonPopupModal>
  );
};

const EqpForm = styled.form`
  text-align: center;
  font-size: 18px;
  > div:first-child {
    background-color: #f6f6f6;
    height: 320px;
  }
`;

const EqpBox = styled.div`
  height: 130px;
  width: 100%;
  display: flex;
`;

const ArrDepGroupBox = styled.div<{ isArrDepBoth: boolean }>`
  width: calc(100% / ${({ isArrDepBoth }) => (isArrDepBoth ? 2 : 1)});
  > div {
    margin: auto;
    width: 144px;
  }
`;

const GroupBoxRow = styled.div`
  margin-bottom: 8px;
  text-align: left;
  label {
    font-size: 12px;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -3px 3px #dfdfdf;
`;

export const FORM_NAME = "oalAircraft";

const handleSubmitForm: FormSubmitHandler<FormValues> = (formValues: FormValues, dispatch: AppDispatch) => {
  NotificationCreator.create({
    dispatch,
    message: SoalaMessage.M30010C({
      onYesButton: () => {
        void dispatch(updateOalAircraft(formValues));
      },
    }),
  });
};

const OalAircraftModalForm = reduxForm<FormValues>({
  form: FORM_NAME,
  onSubmit: handleSubmitForm,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(OalAircraft);

const mapStateToProps = (state: RootState) => ({
  initialValues: state.oalAircraft.initialFormValues,
  formValues: getFormValues(FORM_NAME)(state),
});

export default connect(mapStateToProps)(OalAircraftModalForm);
