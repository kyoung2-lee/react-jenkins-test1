import dayjs from "dayjs";
import React, { useEffect } from "react";
import { Dispatch } from "redux";
import Modal from "react-modal";
import { connect } from "react-redux";
import {
  Field,
  FormErrors,
  FormSubmitHandler,
  formValueSelector,
  getFormSyncErrors,
  getFormValues,
  InjectedFormProps,
  reduxForm,
} from "redux-form";
import styled from "styled-components";
import { useAppDispatch } from "../../../store/hooks";
import { formatFlt, isObjectNotEmpty } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
import { RootState } from "../../../store/storeType";
import { fetchAllBulletinBoardFlightLeg } from "../../../reducers/broadcastBulletinBoard";
// eslint-disable-next-line import/no-cycle
import { resetFlightLegForm, submitFlightLegForm, flightLegSubmitFailedField } from "../../../reducers/broadcastFlightLegSearch";
import { openDateTimeInputPopup } from "../../../reducers/dateTimeInputPopup";
import { openFlightNumberInputPopup } from "../../../reducers/flightNumberInputPopup";
import PrimaryButton from "../../atoms/PrimaryButton";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import { BroadcastFormErrors } from "./Broadcast";
import FlightLeg = Broadcast.Bb.FlightLeg;
import CheckBoxWithLabel from "../../atoms/CheckBoxWithLabel";

interface OwnProps {
  isOpen: boolean;
  onClickFlightLeg: (flightLeg: FlightLeg) => void;
  handleClose: () => void;
}

type MyProps = OwnProps & ReturnType<typeof mapStateToProps>;

type Props = MyProps & InjectedFormProps<FlightLegSearchFormParams, MyProps>;
const flightLegKey = (flightLeg: FlightLeg): string =>
  `${flightLeg.orgDateLcl}-${flightLeg.alCd}-${flightLeg.fltNo}-${flightLeg.casFltNo}-${flightLeg.skdDepApoCd}-${flightLeg.skdArrApoCd}-${flightLeg.skdLegSno}`;

const FLIGHT_LEG_FIELDS = ["fltNo", "date", "casFltFlg"];

const FlightLegSearchModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!isOpen) {
      void dispatch(resetFlightLegForm());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  const displayDate = () => dayjs(props.date, "YYYY-MM-DD").format("DDMMM").toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const formatFltNo = (e: React.FocusEvent<any> | undefined) => (e ? props.change("fltNo", formatFlt(e.target.value as string)) : () => {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCasFltNo = (e: React.FocusEvent<any> | undefined) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    e ? props.change("fltNo", (e.target.value as string).toUpperCase()) : () => {};

  const clearFltNo = () => props.change("fltNo", "");

  const handleFlightNumberInputPopup = () => {
    clearFltNo();
    dispatch(
      openFlightNumberInputPopup({
        formName: FORM_NAME,
        fieldName: "fltNo",
        currentFlightNumber: props.fltNo,
        executeSubmit: true,
        onEnter: () => {},
        canOnlyAlCd: false,
      })
    );
  };

  const handleDateTimeInputPopup = () => {
    dispatch(
      openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD",
        currentValue: props.date,
        onEnter: (value) => props.change("date", value),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onUpdate: async (value) => {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.change("date", value);
          await dispatch(submitFlightLegForm());
        },
        customUpdateButtonName: "Search",
        unableDelete: true,
      })
    );
  };

  const handleFltNoKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      props.change("fltNo", formatFlt(e.target.value));
    }
  };

  const handleClose = () => {
    clearFltNo();
    props.handleClose();
  };

  const { isOpen, flightLegs, onClickFlightLeg, handleSubmit } = props;
  const { isPc } = storage;

  return (
    <Modal isOpen={isOpen} style={modalStyle} onRequestClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <Row width={706}>
            <Flex>
              <Flex width={254}>
                <Field
                  name="date"
                  tabIndex={-1}
                  component={TextInput}
                  width={68}
                  showKeyboard={handleDateTimeInputPopup}
                  validate={[validates.required]}
                  isShadowOnFocus
                  displayValue={displayDate()}
                />
                <Field
                  name="fltNo"
                  id="fltNo"
                  tabIndex={0}
                  placeholder="FLT"
                  component={TextInput}
                  width={124}
                  maxLength={10}
                  onKeyPress={handleFltNoKeyPress}
                  showKeyboard={isPc ? undefined : handleFlightNumberInputPopup}
                  validate={
                    props.casFltFlg
                      ? [validates.requiredFlt, validates.halfWidthCasFlt]
                      : [validates.requiredFlt, validates.lengthFlt3, validates.halfWidthFlt]
                  }
                  componentOnBlur={props.casFltFlg ? formatCasFltNo : formatFltNo}
                  isShadowOnFocus
                  autoFocus
                />
                <Field
                  name="casFltFlg"
                  id="casFltFlg"
                  tabIndex={1}
                  component={CheckBoxWithLabel}
                  checked={props.casFltFlg}
                  disabled={false}
                  isShadowOnFocus
                  text="Casual"
                />
              </Flex>
              <Col width={120}>
                <PrimaryButton text="Search" type="submit" />
              </Col>
            </Flex>
          </Row>
        </ModalHeader>
        <ModalBody>
          <Row width={424}>
            {flightLegs.map((flightLeg) =>
              isObjectNotEmpty(flightLeg) ? (
                <Flex position="center" key={flightLegKey(flightLeg)}>
                  <Col width={150}>
                    <LegButton
                      type="button"
                      onClick={() => {
                        onClickFlightLeg(flightLeg);
                        handleClose();
                      }}
                      isPc={storage.isPc}
                    >
                      {flightLeg.lstDepApoCd}-{flightLeg.lstArrApoCd}
                    </LegButton>
                  </Col>
                </Flex>
              ) : null
            )}
          </Row>
        </ModalBody>
      </form>
    </Modal>
  );
};

const onSubmit: FormSubmitHandler<FlightLegSearchFormParams, MyProps, string> = (params, dispatch, props): void => {
  const { date, fltNo, casFltFlg, formSyncErrors } = props;
  const formattedFlt = (params && params.fltNo) || fltNo;
  if (storage.isPc && showFlightLegSearchValidationError(formSyncErrors, dispatch)) {
    return;
  }

  dispatch(
    fetchAllBulletinBoardFlightLeg({
      orgDateLcl: date,
      alCd: casFltFlg ? "" : formattedFlt.slice(0, 2),
      fltNo: casFltFlg ? "" : formattedFlt.slice(2),
      casFltNo: casFltFlg ? formattedFlt : "",
      casFltFlg,
    })
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
const showFlightLegSearchValidationError = (formSyncErrors: FormErrors<{}, string>, dispatch: Dispatch<any>) => {
  const formErrors = formSyncErrors as unknown as BroadcastFormErrors;
  const errorFields: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessages: Array<{ messageFunction: any }> = [];
  for (let i = 0; i < FLIGHT_LEG_FIELDS.length; i++) {
    const field = FLIGHT_LEG_FIELDS[i];
    if (formErrors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const messageFunction = formErrors[field] as any;
      if (messageFunction) {
        errorFields.push(field);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        errorMessages.push({ messageFunction });
      }
    }
  }
  dispatch(flightLegSubmitFailedField({ fields: errorFields }));
  return !!errorMessages.length;
};

const ModalHeader = styled.div`
  padding: 20px 20px 24px 20px;
  background: #f6f6f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Row = styled.div<{ width: number }>`
  margin: 0;
  width: ${(props) => props.width}px;
`;

const Flex = styled.div<{ width?: number; position?: string }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.position || "space-between"};
  width: ${(props) => (props.width ? `${props.width}px` : "auto")};
`;

const Col = styled.div<{ width: number }>`
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => props.width}px;
`;

const ModalBody = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 187px;
  > div > div {
    margin: 26px;
  }
`;

const modalStyle = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    width: "426px",
    left: "calc(50% - 200px)",
    padding: 0,
    height: "280px",
    top: "calc(100vh/2 - 140px)",
    overflow: "hidden",
  },
};

const LegButton = styled.button<{ isPc: typeof storage.isPc }>`
  width: 100%;
  background: ${(props) => props.theme.color.WHITE};
  height: 44px;
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  padding: 0;
  border: solid 1px ${(props) => props.theme.color.PRIMARY};
  font-size: 17px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);

  ${({ theme, isPc }) => `
      cursor: pointer;
      ${
        isPc
          ? `
        &:hover, &:focus {
          background: ${theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
        }
        &:active {
          background: ${theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
        }
      `
          : `
        &:active {
          background: ${theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
        }
      `
      }
  `};
`;

interface FlightLegSearchFormParams {
  date: string;
  fltNo: string;
  casFltFlg: boolean;
}

export const FORM_NAME = "flightLegSearchForm";

const FlightLegSearchForm = reduxForm<FlightLegSearchFormParams, MyProps>({
  form: FORM_NAME,
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  enableReinitialize: true,
})(FlightLegSearchModal);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state: RootState) => {
  const {
    common: {
      headerInfo: { apoTimeLcl },
    },
    broadcast: {
      BulletinBoard: { flightLegs },
    },
  } = state;
  const date = (apoTimeLcl ? dayjs(apoTimeLcl) : dayjs()).format("YYYY-MM-DD");
  const initialValues = {
    date,
  };
  return {
    // eslint-disable-next-line react/no-unused-prop-types
    initialValues,
    flightLegs,
    // eslint-disable-next-line react/no-unused-prop-types
    formValues: getFormValues(FORM_NAME)(state),
    // eslint-disable-next-line react/no-unused-prop-types
    formSyncErrors: getFormSyncErrors(FORM_NAME)(state),
    date: (selector(state, "date") || "") as string,
    fltNo: (selector(state, "fltNo") || "") as string,
    casFltFlg: (selector(state, "casFltFlg") || false) as boolean,
  };
};

export default connect(mapStateToProps)(FlightLegSearchForm);
