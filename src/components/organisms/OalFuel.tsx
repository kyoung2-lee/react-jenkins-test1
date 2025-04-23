import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Field, InjectedFormProps, reduxForm, Normalizer, reset, FormSubmitHandler, getFormValues } from "redux-form";
import styled from "styled-components";
import { RootState } from "../../store/storeType";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import * as validates from "../../lib/validators";
import { OalFuelFormParams, closeOalFuel, updateOalFuel } from "../../reducers/oalFuel";
import PrimaryButton from "../atoms/PrimaryButton";
import TextInput from "../atoms/TextInput";
import CommonPopupModal from "../molecules/CommonPopupModal";
import arrowRightSvg from "../../assets/images/icon/arrow_right.svg";

type ComponentProps = {
  initialValues: Partial<OalFuelFormParams>;
};

type Props = ComponentProps & InjectedFormProps<OalFuelFormParams, ComponentProps>;

const OalFuel: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const oalFuel = useAppSelector((state) => state.oalFuel);

  useEffect(() => {
    if (!oalFuel.isOpen) {
      dispatch(reset(FORM_NAME));
    }
  }, [dispatch, oalFuel.isOpen]);

  const normalizeFuelWt: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!onlyNums) return "";
    const newValue = Number(onlyNums);
    return String(newValue);
  };

  const formatFuelStatus = (e: React.FocusEvent<HTMLInputElement> | undefined) => {
    if (e && e.target.value !== null) {
      props.change(e.target.name, e.target.value.toUpperCase());
    }
  };

  const handleSubmitKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target.value !== null && e.key === "Enter") {
      props.change(e.target.name, e.target.value.toUpperCase());
    }
  };

  const handleRequestClose = () => {
    if (props.dirty) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: () => dispatch(closeOalFuel()) }) });
    } else {
      dispatch(closeOalFuel());
    }
  };

  const { handleSubmit, dirty, initialValues } = props;

  return (
    <CommonPopupModal
      width={375}
      height={296}
      isOpen={oalFuel.isOpen}
      onRequestClose={handleRequestClose}
      flightHeader={oalFuel.flightDetailHeader}
    >
      <form onSubmit={handleSubmit}>
        <GroupBox>
          <GroupBoxRow marginTop="0">
            <div>
              <label>Fuel</label>
              <RowColumnItem width="70px">{oalFuel.rampFuelWt}</RowColumnItem>
            </div>
            <div>
              <RowColumnItem>
                <ArrowRightIcon />
              </RowColumnItem>
            </div>
            <div>
              <Field
                name="rampFuelWt"
                pattern="\d*"
                component={TextInput}
                width={72}
                height={40}
                autoFocus
                isShadowOnFocus
                maxLength={4}
                normalize={normalizeFuelWt}
                validate={[validates.isOkFuelWt]}
                isShowEditedColor
              />
            </div>
          </GroupBoxRow>

          <GroupBoxRow marginTop="19px">
            <div>
              <label>Fuel Status</label>
              <RowColumnItem width="70px">{initialValues.rampFuelCat}</RowColumnItem>
            </div>
            <div>
              <RowColumnItem>
                <ArrowRightIcon />
              </RowColumnItem>
            </div>
            <div>
              <Field
                name="rampFuelCat"
                component={TextInput}
                width={40}
                height={40}
                isShadowOnFocus
                maxLength={1}
                componentOnBlur={formatFuelStatus}
                onKeyPress={handleSubmitKeyPress}
                validate={[validates.isOkFuelStatus]}
                isShowEditedColor
              />
            </div>
          </GroupBoxRow>
        </GroupBox>
        <FooterContainer>
          <PrimaryButton type="submit" text="Update" width="110px" disabled={!dirty} />
        </FooterContainer>
      </form>
    </CommonPopupModal>
  );
};

const GroupBox = styled.div`
  background: #f6f6f6;
  border: #615e5e 1px solid;
  width: 355px;
  height: 160px;
  margin: 8px 10px 0px 10px;
  padding: 19px 22px 16px;
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

const ArrowRightIcon = styled.img.attrs({ src: arrowRightSvg })`
  vertical-align: bottom;
  margin: 0 30px 0 10px;
`;

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  justify-content: center;
  align-items: center;
`;

export const FORM_NAME = "OalFuelModalForm";

const handleSubmitForm: FormSubmitHandler<OalFuelFormParams, ComponentProps> = (formParams, dispatch, _props) => {
  NotificationCreator.create({
    dispatch,
    message: SoalaMessage.M30010C({
      onYesButton: () => {
        void dispatch(updateOalFuel(formParams));
      },
    }),
  });
};

const OalFuelModalForm = reduxForm<OalFuelFormParams, ComponentProps>({
  form: FORM_NAME,
  onSubmit: handleSubmitForm,
  enableReinitialize: true,
})(OalFuel);

const mapStateToProps = (state: RootState) => {
  const initialValues = {
    rampFuelWt: state.oalFuel.rampFuelWt || "",
    rampFuelCat: state.oalFuel.rampFuelCat || "",
  };

  return {
    initialValues,
    formValues: getFormValues(FORM_NAME)(state),
  };
};

export default connect(mapStateToProps)(OalFuelModalForm);
