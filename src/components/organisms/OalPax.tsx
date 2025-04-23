import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Field, InjectedFormProps, reduxForm, Normalizer, reset, FormSubmitHandler, getFormValues } from "redux-form";
import styled from "styled-components";
import { RootState } from "../../store/storeType";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import * as validates from "../../lib/validators";
import PrimaryButton from "../atoms/PrimaryButton";
import TextInput from "../atoms/TextInput";
import CommonPopupModal from "../molecules/CommonPopupModal";
import { closeOalPax, updateOalPax } from "../../reducers/oalPax";
import iconArrowDownSvg from "../../assets/images/icon/icon-arrow_down.svg";

type ComponentProps = {
  initialValues: Partial<OalPaxApi.OalPaxFormParams>;
};

type Props = ComponentProps & InjectedFormProps<OalPaxApi.OalPaxFormParams, ComponentProps>;

const OalPax: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const oalPax = useAppSelector((state) => state.oalPax);

  useEffect(() => {
    if (!oalPax.isOpen) {
      dispatch(reset(FORM_NAME));
    }
  }, [dispatch, oalPax.isOpen]);

  const normalizePax: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!onlyNums) return "";
    const newValue = Number(onlyNums);
    return String(newValue);
  };

  const handleRequestClose = () => {
    if (props.dirty) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: () => dispatch(closeOalPax()) }) });
    } else {
      dispatch(closeOalPax());
    }
  };

  const renderOrgTable = () => {
    const { initialValues } = props;
    return (
      <PassengerTable>
        <thead>
          <tr className="cls-cd">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th />
            <td>F</td>
            <td>C</td>
            <td>W</td>
            <td>Y</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="data-cd">Salable</td>
            <td className="cnt">
              <span>{initialValues.salableFCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.salableCCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.salableWCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.salableYCnt}</span>
            </td>
          </tr>
          <tr>
            <td className="data-cd">Booked</td>
            <td className="cnt">
              <span>{initialValues.bookedFCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.bookedCCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.bookedWCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.bookedYCnt}</span>
            </td>
          </tr>
          <tr>
            <td className="data-cd">Actual</td>
            <td className="cnt">
              <span>{initialValues.actualFCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.actualCCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.actualWCnt}</span>
            </td>
            <td className="cnt">
              <span>{initialValues.actualYCnt}</span>
            </td>
          </tr>
        </tbody>
      </PassengerTable>
    );
  };

  const renderFormTable = () => (
    <PassengerTable>
      <tbody>
        <tr>
          <td className="data-cd">Salable</td>
          <td className="cnt">
            <Field
              name="salableFCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="salableCCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="salableWCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="salableYCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
        </tr>
        <tr>
          <td className="data-cd">Booked</td>
          <td className="cnt">
            <Field
              name="bookedFCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="bookedCCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="bookedWCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="bookedYCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
        </tr>
        <tr>
          <td className="data-cd">Actual</td>
          <td className="cnt">
            <Field
              name="actualFCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="actualCCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="actualWCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
          <td className="cnt">
            <Field
              name="actualYCnt"
              pattern="\d*"
              component={TextInput}
              width={56}
              height={40}
              isShadowOnFocus
              maxLength={3}
              normalize={normalizePax}
              validate={[validates.lengthPax]}
              isShowEditedColor
            />
          </td>
        </tr>
      </tbody>
    </PassengerTable>
  );

  return (
    <CommonPopupModal
      flightHeader={oalPax.flightDetailHeader}
      isOpen={oalPax.isOpen}
      onRequestClose={handleRequestClose}
      width={375}
      height={488}
    >
      <PaxForm onSubmit={props.handleSubmit}>
        <Box>
          {renderOrgTable()}
          <DownArrowIcon />
          {renderFormTable()}
        </Box>
        <FooterContainer>
          <PrimaryButton type="submit" text="Update" width="100px" disabled={!props.dirty} />
        </FooterContainer>
      </PaxForm>
    </CommonPopupModal>
  );
};

const PaxForm = styled.form`
  height: 448px;
  text-align: center;
`;
const Box = styled.div`
  background: #f6f6f6;
  border: #222222 1px solid;
  width: 355px;
  height: 352px;
  margin: 8px 10px;
  padding: 16px;
`;

const PassengerTable = styled.table`
  width: 305px;
  margin: auto;
  > tr {
    height: 32px;
  }
  .cls-cd,
  .data-cd {
    font-size: 12px;
  }
  td.cnt {
    font-size: 18px;
    width: 60px;
    > span,
    div {
      width: 56px;
      display: grid;
      place-items: center;
    }

    > span {
      height: 26px;
      margin: 3px;
    }
    > div {
      height: 40px;
      margin: 2px 4px;
    }
    > div input {
      text-align: center;
    }
  }
`;

const DownArrowIcon = styled.img.attrs({ src: iconArrowDownSvg })`
  height: 26px;
  margin: 6px auto 8px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
`;

export const FORM_NAME = "OalPaxModalForm";

const handleSubmitForm: FormSubmitHandler<OalPaxApi.OalPaxFormParams, ComponentProps> = (formParams, dispatch, _props) => {
  NotificationCreator.create({ dispatch, message: SoalaMessage.M30010C({ onYesButton: () => dispatch(updateOalPax(formParams)) }) });
};

const OalPaxModalForm = reduxForm<OalPaxApi.OalPaxFormParams, ComponentProps>({
  form: FORM_NAME,
  onSubmit: handleSubmitForm,
  enableReinitialize: true,
})(OalPax);

const mapStateToProps = (state: RootState) => {
  const { oalPaxList } = state.oalPax;
  const orgSalableF = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "F");
  const orgSalableC = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "C");
  const orgSalableW = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "W");
  const orgSalableY = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "Y");

  const orgBookedF = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "F");
  const orgBookedC = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "C");
  const orgBookedW = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "W");
  const orgBookedY = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "Y");

  const orgActualF = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "F");
  const orgActualC = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "C");
  const orgActualW = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "W");
  const orgActualY = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "Y");

  const initialValues = {
    salableFCnt: orgSalableF && orgSalableF.cnt !== null ? orgSalableF.cnt.toString() : "",
    salableCCnt: orgSalableC && orgSalableC.cnt !== null ? orgSalableC.cnt.toString() : "",
    salableWCnt: orgSalableW && orgSalableW.cnt !== null ? orgSalableW.cnt.toString() : "",
    salableYCnt: orgSalableY && orgSalableY.cnt !== null ? orgSalableY.cnt.toString() : "",
    bookedFCnt: orgBookedF && orgBookedF.cnt !== null ? orgBookedF.cnt.toString() : "",
    bookedCCnt: orgBookedC && orgBookedC.cnt !== null ? orgBookedC.cnt.toString() : "",
    bookedWCnt: orgBookedW && orgBookedW.cnt !== null ? orgBookedW.cnt.toString() : "",
    bookedYCnt: orgBookedY && orgBookedY.cnt !== null ? orgBookedY.cnt.toString() : "",
    actualFCnt: orgActualF && orgActualF.cnt !== null ? orgActualF.cnt.toString() : "",
    actualCCnt: orgActualC && orgActualC.cnt !== null ? orgActualC.cnt.toString() : "",
    actualWCnt: orgActualW && orgActualW.cnt !== null ? orgActualW.cnt.toString() : "",
    actualYCnt: orgActualY && orgActualY.cnt !== null ? orgActualY.cnt.toString() : "",
  };

  return {
    initialValues,
    formValues: getFormValues(FORM_NAME)(state),
  };
};

export default connect(mapStateToProps)(OalPaxModalForm);
