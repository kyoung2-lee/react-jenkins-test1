import React, { ChangeEvent, useEffect } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, InjectedFormProps, reduxForm, getFormValues, FormSubmitHandler } from "redux-form";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../store/storeType";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import * as validates from "../../lib/validators";
import * as myValidates from "../../lib/validators/userSettingValidator";
import { toUpperCase } from "../../lib/commonUtil";
import { storage } from "../../lib/storage";
import { SoalaMessage } from "../../lib/soalaMessages";
import * as flightNumberInputPopupActions from "../../reducers/flightNumberInputPopup";
// eslint-disable-next-line import/no-cycle
import * as userSettingActions from "../../reducers/userSetting";
import SelectBox from "../atoms/SelectBox";
import SuggestSelectBox from "../atoms/SuggestSelectBox";
import TextInput from "../atoms/TextInput";
import ToggleInput from "../atoms/ToggleInput";
import PrimaryButton from "../atoms/PrimaryButton";
import iconCloseSvg from "../../assets/images/icon/icon-close.svg";

type MyProps = {
  apoNtfFlg: boolean;
  fltNtfFlg: boolean;
  bbNtfFlg: boolean;
  cmtNtfFlg: boolean;
  typeValues: Array<"FLT" | "LEG" | "CAS">;
  triggerValues: string[];
  formValues: UserSettingFormParams;
  canNotifyBulletinBoard: boolean;
  canNotifyMySchedule: boolean;
  myskdlNtfFlg: boolean;
};

type Props = MyProps & InjectedFormProps<UserSettingFormParams, MyProps>;

const UserSetting: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const master = useAppSelector((state) => state.account.master);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const userSetting = useAppSelector((state) => state.userSetting);
  const { apoNtfFlg, fltNtfFlg, bbNtfFlg, typeValues, formValues, canNotifyBulletinBoard, canNotifyMySchedule } = props;

  useEffect(() => {
    void dispatch(userSettingActions.getUserSetting());
    void dispatch(userSettingActions.setCheckHasDifference(checkHasDifference));
    void dispatch(userSettingActions.checkUserSettingFuncAuth({ jobAuth: jobAuth.jobAuth }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userSetting.isCleared) {
      void dispatch(userSettingActions.getUserSetting());
    }
  }, [dispatch, userSetting.isCleared]);

  const clearAirportField = (index: number) => {
    if (apoNtfFlg) {
      props.change(`apoNtfList[][${index}][apoCode]`, "");
      props.change(`apoNtfList[][${index}][eventCode]`, "");
    }
  };

  const clearFlightField = (index: number) => {
    if (fltNtfFlg) {
      props.change(`fltNtfList[][${index}][type]`, "");
      props.change(`fltNtfList[][${index}][trigger]`, "");
      props.change(`fltNtfList[][${index}][triggerDep]`, "");
      props.change(`fltNtfList[][${index}][triggerArr]`, "");
      props.change(`fltNtfList[][${index}][fltEventCode]`, "");
      props.change(`fltNtfList[][${index}][legEventCode]`, "");
    }
  };

  const handleFlightNumberInputPopup = (index: number) => {
    dispatch(
      flightNumberInputPopupActions.openFlightNumberInputPopup({
        formName: FORM_NAME,
        fieldName: `fltNtfList[][${index}][trigger]`,
        currentFlightNumber: props.triggerValues[index],
        executeSubmit: false,
        onEnter: () => {},
        canOnlyAlCd: false,
      })
    );
  };

  const onChangebbNtfFlg = (checked: boolean) => {
    if (!checked) {
      props.change("cmtNtfFlg", false);
    }
  };

  const onChangeFltNtfListType = (index: number) => {
    props.change(`fltNtfList[][${index}][triggerDep]`, "");
    props.change(`fltNtfList[][${index}][triggerArr]`, "");
    props.change(`fltNtfList[][${index}][trigger]`, "");
    props.change(`fltNtfList[][${index}][legEventCode]`, "");
    props.change(`fltNtfList[][${index}][fltEventCode]`, "");
  };

  const confirmationSwich = (fieldName: string) => {
    const isApo = fieldName === "apoNtfFlg";
    const swichFlg = isApo ? apoNtfFlg : fltNtfFlg;
    const changeSwitch = () => {
      const { apoNtfList, fltNtfList } = userSetting;
      props.change(fieldName, !swichFlg);
      if (isApo) {
        if (apoNtfList && apoNtfList.length < 5) {
          for (let i = 0; i < 5; i++) {
            clearAirportField(i);
          }
        }
        userSettingActions.setApoNtfFrom(apoNtfList, dispatch);
      } else {
        if (fltNtfList && fltNtfList.length < 5) {
          for (let i = 0; i < 5; i++) {
            clearFlightField(i);
          }
        }
        userSettingActions.setFltNtfFrom(fltNtfList, dispatch);
      }
    };
    if (swichFlg) {
      // 差分確認
      const hasDifference = isApo ? checkHasDifferenceApoNtfList() : checkHasDifferenceFltNtfList();
      if (hasDifference) {
        void dispatch(
          userSettingActions.showMessage({
            message: SoalaMessage.M40006C({
              onYesButton: changeSwitch,
            }),
          })
        );
      } else {
        changeSwitch();
      }
    } else {
      changeSwitch();
    }
  };

  const checkHasDifference = () => {
    const wGrpNtfFlg = userSetting.grpNtfFlg === undefined ? true : userSetting.grpNtfFlg;
    const wFltNtfFlg = userSetting.fltNtfFlg === undefined ? true : userSetting.fltNtfFlg;
    const wApoNtfFlg = userSetting.apoNtfFlg === undefined ? true : userSetting.apoNtfFlg;
    const wBbNtfFlg = userSetting.bbNtfFlg === undefined ? true : userSetting.bbNtfFlg;
    const wCmtNtfFlg = userSetting.bbNtfFlg === undefined ? true : userSetting.cmtNtfFlg;
    const wMyskdlNtfFlg = userSetting.myskdlNtfFlg === undefined ? true : userSetting.myskdlNtfFlg;

    return (
      formValues.grpNtfFlg !== wGrpNtfFlg ||
      formValues.fltNtfFlg !== wFltNtfFlg ||
      formValues.apoNtfFlg !== wApoNtfFlg ||
      formValues.bbNtfFlg !== wBbNtfFlg ||
      formValues.cmtNtfFlg !== wCmtNtfFlg ||
      formValues.myskdlNtfFlg !== wMyskdlNtfFlg ||
      checkHasDifferenceApoNtfList() ||
      checkHasDifferenceFltNtfList()
    );
  };

  const checkHasDifferenceApoNtfList = () => {
    const formApoNtfList = formValues.apoNtfList || [];
    const apoNtfList = userSetting.apoNtfList || [];
    let hasDifference = formApoNtfList.length !== apoNtfList.length;
    if (!hasDifference) {
      hasDifference = apoNtfList.some(
        (apoNtf, index) => apoNtf.apoCode !== formApoNtfList[index].apoCode || apoNtf.eventCode !== formApoNtfList[index].eventCode
      );
    }
    return hasDifference;
  };

  const checkHasDifferenceFltNtfList = () => {
    const formFltNtfList = formValues.fltNtfList || [];
    const fltNtfList = userSetting.fltNtfList || [];
    let hasDifference = formFltNtfList.length !== fltNtfList.length;

    if (!hasDifference) {
      hasDifference = fltNtfList.some((fltNtf, index) => {
        if (fltNtf.type !== formFltNtfList[index].type) return true;
        switch (fltNtf.type) {
          case "LEG":
            return (
              fltNtf.trigger !== `${formFltNtfList[index].triggerDep || ""}-${formFltNtfList[index].triggerArr || ""}` ||
              fltNtf.eventCode !== formFltNtfList[index].legEventCode
            );
          case "FLT":
            return fltNtf.trigger !== formFltNtfList[index].trigger || fltNtf.eventCode !== formFltNtfList[index].fltEventCode;
          default:
            return fltNtf.trigger !== formFltNtfList[index].trigger || fltNtf.eventCode !== formFltNtfList[index].fltEventCode;
        }
      });
    }
    return hasDifference;
  };

  return (
    <Wrapper isIphone={storage.isIphone} hasApo={!!jobAuth.user.myApoCd}>
      <UserSettingInputForm isIphone={storage.isIphone} onSubmit={props.handleSubmit}>
        <ScrollSection isIphone={storage.isIphone} hasApo={!!jobAuth.user.myApoCd}>
          <ContentsArea isIphone={storage.isIphone}>
            <RadioWrapper isIphone={storage.isIphone}>
              <div>Issue of My Airport Event</div>
              <Field name="grpNtfFlg" disabled component={ToggleInput} />
            </RadioWrapper>
            <Description>If an event occurs on your Airport, it will always be notified.</Description>
            {storage.isIpad && (
              <>
                <Separater isIphone={storage.isIphone} />
                <RadioWrapper isIphone={storage.isIphone}>
                  <div>Issue of Other Airport Event</div>
                  <Field name="apoNtfFlg" component={ToggleInput} confirmation={() => confirmationSwich("apoNtfFlg")} />
                </RadioWrapper>
                <Description>If an event occurs on your focused Airport, it will be notified. (Max 5)</Description>
                <SettingList>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div className="row" key={`otherAirport-${index}`}>
                      <div className="rowContent">
                        <Field
                          name={`apoNtfList[][${index}][apoCode]`}
                          component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                          placeholder="APO"
                          maxLength={3}
                          options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                          width={105}
                          validate={[validates.halfWidthApoCd, myValidates.requiredSameRowApo, myValidates.duplicationValusSameRowApo]}
                          disabled={!apoNtfFlg}
                        />
                        <Field
                          name={`apoNtfList[][${index}][eventCode]`}
                          component={SelectBox as "select" & typeof SelectBox}
                          options={master.ntfInfo.airportNtfList}
                          placeholder="Event"
                          width={storage.isIphone ? 216 : 235}
                          validate={[myValidates.requiredSameRowApo, myValidates.duplicationValusSameRowApo]}
                          disabled={!apoNtfFlg}
                          hasBlank
                        />
                      </div>
                      <ClearRowButton className="button" onClick={() => clearAirportField(index)} disabled={!apoNtfFlg}>
                        <IconClose />
                      </ClearRowButton>
                    </div>
                  ))}
                </SettingList>
              </>
            )}
            <Separater isIphone={storage.isIphone} />
            <RadioWrapper isIphone={storage.isIphone}>
              <div>Issue of Flight Event</div>
              <Field name="fltNtfFlg" component={ToggleInput} confirmation={() => confirmationSwich("fltNtfFlg")} />
            </RadioWrapper>
            <Description>If an event occurs on your focused Flight or LEG, it will be notified. (Max 5)</Description>
            <SettingList>
              {[0, 1, 2, 3, 4].map((index) => (
                <div className="row" key={`flightNotify-${index}`}>
                  <div className="rowContent">
                    <Field
                      name={`fltNtfList[][${index}][type]`}
                      component={SelectBox as "select" & typeof SelectBox}
                      options={[
                        { label: "FLT", value: "FLT" },
                        { label: "LEG", value: "LEG" },
                        { label: "Casual", value: "CAS" },
                      ]}
                      width={60}
                      menuWidth={72}
                      placeholder="Type"
                      validate={[myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt]}
                      disabled={!fltNtfFlg}
                      onChange={() => onChangeFltNtfListType(index)}
                      hasBlank
                    />
                    {props.typeValues[index] === "LEG" ? (
                      <>
                        <Field
                          name={`fltNtfList[][${index}][triggerDep]`}
                          component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                          placeholder="DEP"
                          options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                          width={77}
                          maxLength={3}
                          validate={[validates.halfWidthApoCd, myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt]}
                          disabled={!fltNtfFlg || !typeValues[index]}
                        />
                        <Field
                          name={`fltNtfList[][${index}][triggerArr]`}
                          component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                          placeholder="ARR"
                          options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                          width={77}
                          maxLength={3}
                          validate={[validates.halfWidthApoCd, myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt]}
                          disabled={!fltNtfFlg || !typeValues[index]}
                        />
                      </>
                    ) : (
                      <Field
                        name={`fltNtfList[][${index}][trigger]`}
                        component={TextInput}
                        showKeyboard={typeValues[index] === "FLT" ? () => handleFlightNumberInputPopup(index) : undefined}
                        width={160}
                        placeholder={typeValues[index] === "FLT" || typeValues[index] === "CAS" ? "FLT" : "Trigger"}
                        validate={
                          typeValues[index] === "FLT"
                            ? [myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt]
                            : [myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt, validates.isOkCasualFlt]
                        }
                        disabled={!fltNtfFlg || !typeValues[index]}
                        maxLength={typeValues[index] === "FLT" ? 6 : 10}
                        componentOnBlur={
                          typeValues[index] === "FLT"
                            ? undefined
                            : (e: React.FocusEvent<HTMLInputElement> | undefined) => {
                                if (e) {
                                  props.change(`fltNtfList[][${index}][trigger]`, toUpperCase(e.target.value));
                                }
                              }
                        }
                        onKeyPress={
                          typeValues[index] === "FLT"
                            ? undefined
                            : (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
                                if (e.key === "Enter") {
                                  props.change(`fltNtfList[][${index}][trigger]`, toUpperCase(e.target.value));
                                }
                              }
                        }
                      />
                    )}
                    <Field
                      name={typeValues[index] === "LEG" ? `fltNtfList[][${index}][legEventCode]` : `fltNtfList[][${index}][fltEventCode]`}
                      component={SelectBox as "select" & typeof SelectBox}
                      options={typeValues[index] === "LEG" ? [...master.ntfInfo.legNtfList] : [...master.ntfInfo.flightNoNtfList]}
                      width={storage.isIphone ? 95 : 114}
                      menuWidth={200}
                      menuLeft={storage.isIphone ? 95 - 200 : 114 - 200}
                      placeholder="Event"
                      validate={[myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt]}
                      disabled={!fltNtfFlg || !typeValues[index]}
                      hasBlank
                    />
                  </div>
                  <ClearRowButton className="button" onClick={() => clearFlightField(index)} disabled={!fltNtfFlg}>
                    <IconClose />
                  </ClearRowButton>
                </div>
              ))}
            </SettingList>
            {canNotifyBulletinBoard ? (
              <>
                <Separater isIphone={storage.isIphone} />
                <RadioWrapper isIphone={storage.isIphone}>
                  <div>Issue of Bulletin Board(update)</div>
                  <Field
                    name="bbNtfFlg"
                    component={ToggleInput}
                    onChange={(_event?: ChangeEvent, checked?: unknown) => onChangebbNtfFlg(!!checked)}
                  />
                </RadioWrapper>
                <Description>If there are any updates on the Bulletin Board, it will be notified.</Description>
                <CheckBoxContainer>
                  <CheckBoxLabel htmlFor="cmtNtfFlg">
                    <Field name="cmtNtfFlg" id="cmtNtfFlg" disabled={!bbNtfFlg} component="input" tabIndex={22} type="checkbox" />
                    Comments
                  </CheckBoxLabel>
                </CheckBoxContainer>
                <Description>Please check mark if you want to be notified.</Description>
              </>
            ) : null}
            {canNotifyMySchedule && storage.isIpad && (
              <>
                <Separater isIphone={storage.isIphone} />
                <RadioWrapper isIphone={storage.isIphone}>
                  <div>Issue of My Schedule(update)</div>
                  <Field name="myskdlNtfFlg" component={ToggleInput} />
                </RadioWrapper>
                <Description>If your Job Pattern has be changed by Lily, it will always be notified.</Description>
              </>
            )}
          </ContentsArea>
        </ScrollSection>
        <SubmitContainer isIphone={storage.isIphone}>
          <PrimaryButton text="Update" type="submit" />
        </SubmitContainer>
      </UserSettingInputForm>
    </Wrapper>
  );
};

const updateAreaHeight = { iPhone: "74px", iPad: "94px" };

const Wrapper = styled.div<{ isIphone: boolean; hasApo: boolean }>`
  overflow: scroll;
  height: calc(
    100vh
      ${({
        isIphone,
        theme: {
          layout: { header, footer },
        },
        hasApo,
      }) =>
        isIphone ? (hasApo ? `- ${header.mobile} - ${footer.mobile}` : `- ${header.statusBar} - ${footer.mobile}`) : `- ${header.tablet}`}
  );
`;

const UserSettingInputForm = styled.form<{ isIphone: boolean }>`
  height: 100%;
  width: ${({ isIphone }) => (isIphone ? "100%" : "464px")};
  padding-bottom: 20px;
  margin: 0 auto;
  background: #fff;
`;

const SubmitContainer = styled.div<{ isIphone: boolean }>`
  display: flex;
  justify-content: center;
  height: ${({ isIphone }) => (isIphone ? updateAreaHeight.iPhone : updateAreaHeight.iPad)};
  width: 100%;
  background: #fff;
  button {
    width: 200px;
    margin: auto;
  }
`;

const ScrollSection = styled.div<{ isIphone: boolean; hasApo: boolean }>`
  overflow-y: auto;
  overflow-x: hidden;
  width: "100%";
  height: calc(
    100vh -
      ${({
        isIphone,
        theme: {
          layout: { header, footer },
        },
        hasApo,
      }) =>
        isIphone
          ? hasApo
            ? `${header.mobile} - ${footer.mobile} - ${updateAreaHeight.iPhone}`
            : `${header.statusBar} - ${footer.mobile} - ${updateAreaHeight.iPhone}`
          : `${header.tablet} - ${updateAreaHeight.iPad}`}
  );
  -webkit-overflow-scrolling: touch;
`;

const ContentsArea = styled.div<{ isIphone: boolean }>`
  width: inherit;
  height: inherit;
  margin: 0 ${({ isIphone }) => (isIphone ? "0" : "34px")};
`;

const Separater = styled.div<{ isIphone: boolean }>`
  width: auto;
  height: 0;
  margin-top: 20px;
  margin-bottom: 0;
  margin-right: ${({ isIphone }) => (isIphone ? "10px" : "0")};
  margin-left: ${({ isIphone }) => (isIphone ? "10px" : "0")};
  border-bottom: 1px solid #c9d3d0;
`;

const RadioWrapper = styled.div<{ isIphone: boolean }>`
  display: flex;
  justify-content: space-between;
  margin: 20px 20px 0 10px;
  > div {
    font-size: 20px;
    line-height: 27px;
  }
`;

const Description = styled.div`
  margin: 8px 20px 0 40px;
`;

const SettingList = styled.div`
  width: 100%;
  margin: 8px 0 0 0;
  padding: 12px 5px 12px 8px;
  background: #f6f6f6;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    :last-child {
      margin-bottom: 0;
    }
    .rowContent {
      display: flex;
      justify-content: right;
      > div {
        margin-right: 6px;
        :last-child {
          margin-right: 0;
        }
      }
    }
    .button {
    }
  }
`;

const ClearRowButton = styled.div<{ disabled: boolean }>`
  width: 32px;
  height: 32px;
  padding: 5px;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
`;
const IconClose = styled.img.attrs({ src: iconCloseSvg })`
  width: 100%;
`;

const CheckBoxContainer = styled.div`
  margin: 28px 20px 0 40px;
  align-self: flex-end;
`;

const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 44px;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  input[type="checkbox"] {
    margin-right: 6px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    background: #fff;
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
    }
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
      }
    }
  }
`;

export interface UserSettingFormParams {
  grpNtfFlg: boolean;
  apoNtfFlg: boolean;
  apoNtfList: UserSettingApi.ApoNtfList[];
  fltNtfFlg: boolean;
  fltNtfList: FltNtfList[];
  bbNtfFlg: boolean;
  cmtNtfFlg: boolean;
  myskdlNtfFlg: boolean;
}

interface FltNtfList {
  type: string;
  trigger: string;
  triggerDep: string;
  triggerArr: string;
  eventCode: string;
  legEventCode: string;
  fltEventCode: string;
  fltNtfOrder: number;
}

export const FORM_NAME = "userSetting";

const submit: FormSubmitHandler<UserSettingFormParams, MyProps> = (formParams, dispatch: AppDispatch, _props) => {
  void dispatch(userSettingActions.updateUserSetting(formParams));
};

const UserSettingForm = reduxForm<UserSettingFormParams, MyProps>({
  form: FORM_NAME,
  onSubmit: submit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  enableReinitialize: true,
})(UserSetting);

const selector = formValueSelector(FORM_NAME);

export default connect((state: RootState) => {
  const apoNtfFlg = selector(state, "apoNtfFlg") as boolean;
  const fltNtfFlg = selector(state, "fltNtfFlg") as boolean;
  const bbNtfFlg = selector(state, "bbNtfFlg") as boolean;
  const cmtNtfFlg = selector(state, "cmtNtfFlg") as boolean;
  const myskdlNtfFlg = selector(state, "myskdlNtfFlg") as boolean;
  const typeValues = [0, 1, 2, 3, 4].map((index) => selector(state, `fltNtfList[][${index}][type]`) as "FLT" | "LEG" | "CAS");
  const triggerValues = [0, 1, 2, 3, 4].map((_, index) => selector(state, `fltNtfList[][${index}][trigger]`) as string);

  return {
    apoNtfFlg,
    fltNtfFlg,
    bbNtfFlg,
    cmtNtfFlg,
    myskdlNtfFlg,
    typeValues,
    triggerValues,
    canNotifyBulletinBoard: state.userSetting.canNotifyBulletinBoard,
    canNotifyMySchedule: state.userSetting.canNotifyMySchedule,
    initialValues: { grpNtfFlg: true, apoNtfFlg: true, fltNtfFlg: true, bbNtfFlg: false, cmtNtfFlg: false, myskdlNtfFlg: false },
    formValues: getFormValues(FORM_NAME)(state) as UserSettingFormParams,
  };
})(UserSettingForm);
