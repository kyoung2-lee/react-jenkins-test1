import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Field, getFormValues, InjectedFormProps, reduxForm, reset } from "redux-form";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { toUpperCase } from "../../lib/commonUtil";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";

import * as validates from "../../lib/validators";
import { RootState, AppDispatch } from "../../store/storeType";
import PrimaryButton from "../atoms/PrimaryButton";
import TextInput from "../atoms/TextInput";
import CommonPopupModal from "../molecules/CommonPopupModal";
import { OalPaxStatusState, closeOalPaxStatusModal, updateOalPaxStatus } from "../../reducers/oalPaxStatus";
import ArrowRightIconSvg from "../../assets/images/icon/arrow_right.svg";

type ComponentProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  formValues: OalPaxStatusApi.Post.OalPaxStatusFormParams;
  // eslint-disable-next-line react/no-unused-prop-types
  initialValues: Partial<OalPaxStatusApi.Post.OalPaxStatusFormParams>;
  oalPaxStatus: OalPaxStatusState;
};

type Props = ComponentProps & InjectedFormProps<OalPaxStatusApi.Post.OalPaxStatusFormParams, ComponentProps>;

const OalPaxStatus: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 閉じたらフォームの入力値をクリアする
    if (!props.oalPaxStatus.isOpen) {
      dispatch(reset(FORM_NAME));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.oalPaxStatus.isOpen]);

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
    const { dirty } = props;
    if (dirty) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: () => dispatch(closeOalPaxStatusModal()) }) });
    } else {
      dispatch(closeOalPaxStatusModal());
    }
  };

  const { handleSubmit, dirty, oalPaxStatus } = props;

  return (
    <CommonPopupModal
      flightHeader={oalPaxStatus.flightDetailHeader}
      isOpen={oalPaxStatus.isOpen}
      onRequestClose={handleRequestClose}
      height={392}
    >
      <form onSubmit={handleSubmit}>
        <GroupBox>
          <GroupBoxRow marginTop="0">
            <div>
              <label>Gate</label>
              <RowColumnItem width="73px">{oalPaxStatus.depGateNo}</RowColumnItem>
            </div>
            <div>
              <RowColumnItem>
                <ArrowRightIcon />
              </RowColumnItem>
            </div>
            <div>
              <Field
                name="depGateNo"
                type="string"
                component={TextInput}
                width={88}
                height={40}
                autoFocus={oalPaxStatus.forcusInputName === "depGateNo"}
                isShadowOnFocus
                maxLength={4}
                componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "depGateNo")}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                onKeyPress={(e: any) => handleSubmitKeyPress(e, "depGateNo")}
                validate={[validates.isOkGateNo]}
                isShowEditedColor
              />
            </div>
          </GroupBoxRow>
        </GroupBox>

        <GroupBox>
          <GroupBoxRow marginTop="0">
            <div>
              <label>Ck-in Status</label>
              <RowColumnItem width="73px">{oalPaxStatus.acceptanceSts}</RowColumnItem>
            </div>
            <div>
              <RowColumnItem>
                <ArrowRightIcon />
              </RowColumnItem>
            </div>
            <div>
              <Field
                name="acceptanceSts"
                type="string"
                component={TextInput}
                width={64}
                height={40}
                autoFocus={oalPaxStatus.forcusInputName === "acceptanceSts"}
                isShadowOnFocus
                maxLength={2}
                componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "acceptanceSts")}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                onKeyPress={(e: any) => handleSubmitKeyPress(e, "acceptanceSts")}
                validate={[validates.isOkCkinSts]}
                isShowEditedColor
              />
            </div>
          </GroupBoxRow>
          <GroupBoxRow marginTop="19px">
            <div>
              <label>Gate Status</label>
              <RowColumnItem width="73px">{oalPaxStatus.boardingSts}</RowColumnItem>
            </div>
            <div>
              <RowColumnItem>
                <ArrowRightIcon />
              </RowColumnItem>
            </div>
            <div>
              <Field
                name="boardingSts"
                type="string"
                component={TextInput}
                width={64}
                height={40}
                autoFocus={oalPaxStatus.forcusInputName === "boardingSts"}
                isShadowOnFocus
                maxLength={2}
                componentOnBlur={(e: React.FocusEvent<HTMLInputElement> | undefined) => changeFieldToUpperCase(e, "boardingSts")}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                onKeyPress={(e: any) => handleSubmitKeyPress(e, "boardingSts")}
                validate={[validates.isOkGateSts]}
                isShowEditedColor
              />
            </div>
          </GroupBoxRow>
        </GroupBox>
        <FooterContainer>
          <PrimaryButton type="submit" text="Update" width="100px" disabled={!dirty} />
        </FooterContainer>
      </form>
    </CommonPopupModal>
  );
};

const GroupBox = styled.div`
  background: #f6f6f6;
  border: #222222 1px solid;
  margin: 8px 10px 0;
  padding: 19px 22px 15px;
  font-size: 18px;
`;

const GroupBoxRow = styled.div<{ marginTop?: string }>`
  display: flex;
  align-items: flex-end;
  margin-top: ${({ marginTop }) => marginTop || "16px"};
  > div {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    label {
      font-size: 12px;
    }
  }
`;

const RowColumnItem = styled.div<{ width?: string }>`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: ${({ width }) => width};
  font-size: 18px;
`;

const ArrowRightIcon = styled.img.attrs({ src: ArrowRightIconSvg })`
  vertical-align: bottom;
  margin-right: 24px;
`;

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  justify-content: center;
  align-items: center;
`;

export const FORM_NAME = "oalPaxStatusForm";

const handleSubmitForm = (formValues: OalPaxStatusApi.Post.OalPaxStatusFormParams, dispatch: AppDispatch, _props: ComponentProps) => {
  NotificationCreator.create({
    dispatch,
    message: SoalaMessage.M30010C({
      onYesButton: () => {
        void dispatch(updateOalPaxStatus(formValues));
      },
    }),
  });
};

const OalPaxStatusModalForm = reduxForm<OalPaxStatusApi.Post.OalPaxStatusFormParams, ComponentProps>({
  form: FORM_NAME,
  onSubmit: handleSubmitForm,
  enableReinitialize: true,
})(OalPaxStatus);

const mapStateToProps = (state: RootState) => {
  const orgDepGateNo = state.oalPaxStatus.depGateNo || "";
  const orgAcceptanceSts = state.oalPaxStatus.acceptanceSts || "";
  const orgBoardingSts = state.oalPaxStatus.boardingSts || "";
  const { oalPaxStatus } = state;

  const initialValues: Partial<OalPaxStatusApi.Post.OalPaxStatusFormParams> = {
    depGateNo: orgDepGateNo ? orgDepGateNo.substring(0, 4) : "",
    acceptanceSts: orgAcceptanceSts || "",
    boardingSts: orgBoardingSts || "",
  };

  return {
    initialValues,
    formValues: getFormValues(FORM_NAME)(state) as OalPaxStatusApi.Post.OalPaxStatusFormParams,
    orgDepGateNo,
    orgAcceptanceSts,
    orgBoardingSts,
    oalPaxStatus,
  };
};

export default connect(mapStateToProps)(OalPaxStatusModalForm);
