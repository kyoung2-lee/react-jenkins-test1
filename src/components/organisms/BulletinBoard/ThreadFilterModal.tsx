import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { connect } from "react-redux";
import { Field, InjectedFormProps, reduxForm, Normalizer, formValueSelector } from "redux-form";
import { useAppDispatch } from "../../../store/hooks";
import { isOnlyHalfWidthSymbol, isDateOrYYYYMMDD, getFormatFromDateInput } from "../../../lib/validators";
import TextInput from "../../atoms/TextInput";
import PrimaryButton from "../../atoms/PrimaryButton";
import SecondaryButton from "../../atoms/SecondaryButton";
import SelectBox from "../../atoms/SelectBox";
import { Master } from "../../../reducers/account";
import { RootState } from "../../../store/storeType";
import { Const } from "../../../lib/commonConst";
import { openDateTimeInputPopup } from "../../../reducers/dateTimeInputPopup";

type Props = FilterStateProps & {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: () => void;
};

export interface FormParams {
  keyword: string;
  catCdList: { value: string }[];
  from: string;
  to: string;
  archiveDateLcl: string;
}

const Component: React.FC<Props & InjectedFormProps<FormParams, Props>> = (props) => {
  const dispatch = useAppDispatch();

  const reset = () => {
    props.reset();
  };

  const categories = () =>
    props.cdCtrlDtls
      .filter((code) => code.cdCls === Const.CodeClass.BULLETIN_BOARD_CATEGORY)
      .sort((code1, code2) => code1.num1 - code2.num1)
      .map((cat) => ({
        label: cat.txt1,
        value: cat.cdCat1,
        color: cat.cd1,
      }));

  const submit = () => {
    props.onSubmit();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blurFrom = (e: React.FocusEvent<any> | undefined) => {
    if (!e) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    props.change("from", String(e.target.value).toUpperCase());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blurTo = (e: React.FocusEvent<any> | undefined) => {
    if (!e) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    props.change("to", String(e.target.value).toUpperCase());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blurArchiveDateLcl = (e: React.FocusEvent<any> | undefined) => {
    if (!e) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const formattedDate = getFormatFromDateInput(e.target.value, "YYYY/MM/DD");
    if (formattedDate) {
      props.change("archiveDateLcl", formattedDate);
    }
  };

  const handleDateInputPopup = () => {
    dispatch(
      openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD",
        currentValue: props.innerArchiveDateLclValue,
        onEnter: (value) => props.change("archiveDateLcl", getFormatFromDateInput(value, "YYYY/MM/DD")),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onUpdate: async (value) => {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.change("archiveDateLcl", getFormatFromDateInput(value, "YYYY/MM/DD"));
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await submit();
        },
        customUpdateButtonName: "Filter",
      })
    );
  };

  const normalizeFromTo: Normalizer = (value?: string) => (value ? [...value].filter((c) => isOnlyHalfWidthSymbol(c)).join("") : "");

  const { isOpen, onRequestClose, handleSubmit } = props;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <form onSubmit={handleSubmit(submit)}>
        <Grid>
          <HeaderRow>
            <Col>
              <Label>Keyword</Label>
            </Col>
          </HeaderRow>
          <InputRow>
            <Col>
              <InputGroup>
                <Field name="keyword" component={TextInput} width="100%" autoFocus isShadowOnFocus maxLength={30} />
              </InputGroup>
            </Col>
          </InputRow>
          <HeaderRow>
            <Col>
              <Label>Category</Label>
            </Col>
          </HeaderRow>
          <InputRow>
            <Col>
              <InputGroup>
                <Field name="catCdList" isMulti component={SelectBox} width="100%" options={categories()} isShadowOnFocus />
              </InputGroup>
            </Col>
          </InputRow>
          <HeaderRow>
            <Col>
              <Label>From</Label>
            </Col>
            <Col>
              <Label>To</Label>
            </Col>
          </HeaderRow>
          <InputRow>
            <Col>
              <InputGroup>
                <Field
                  name="from"
                  component={TextInput}
                  width="100%"
                  isShadowOnFocus
                  componentOnBlur={blurFrom}
                  maxLength={10}
                  normalize={normalizeFromTo}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Field
                  name="to"
                  component={TextInput}
                  width="100%"
                  isShadowOnFocus
                  componentOnBlur={blurTo}
                  maxLength={10}
                  normalize={normalizeFromTo}
                />
              </InputGroup>
            </Col>
          </InputRow>
          <HeaderRow>
            <Col>
              <Label>Archive</Label>
            </Col>
          </HeaderRow>
          <InputRow>
            <Col>
              <InputGroup>
                <Field
                  name="archiveDateLcl"
                  component={TextInput}
                  width={114}
                  showKeyboard={handleDateInputPopup}
                  isShadowOnFocus
                  componentOnBlur={blurArchiveDateLcl}
                  maxLength={10}
                  placeholder="yyyymmdd"
                  validate={[isDateOrYYYYMMDD]}
                />
              </InputGroup>
            </Col>
          </InputRow>
          <SubmitRow>
            <SubmitCol>
              <SecondaryButton text="Clear" type="button" onClick={reset} />
            </SubmitCol>
            <SubmitCol>
              <PrimaryButton text="Filter" type="submit" />
            </SubmitCol>
          </SubmitRow>
        </Grid>
      </form>
    </Modal>
  );
};

const Form = reduxForm<FormParams, Props>({
  form: "bulletinBoardThreadFilterModal",
  initialValues: { keyword: "" },
})(Component);

interface FilterStateProps {
  cdCtrlDtls: Master["cdCtrlDtls"];
  innerArchiveDateLclValue: string;
}

const selector = formValueSelector("bulletinBoardThreadFilterModal");

const mapStateToProps = (state: RootState): FilterStateProps => ({
  cdCtrlDtls: state.account.master.cdCtrlDtls,
  innerArchiveDateLclValue: selector(state, "archiveDateLcl") as string,
});

const enhancer = connect(mapStateToProps);

export const ThreadFilterModal = enhancer(Form);

const customStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    borderRadius: "0",
    border: "none",
    maxWidth: "400px",
    top: 0,
    left: 0,
    right: 0,
    bottom: "auto",
    margin: "22px auto",
    padding: "0",
  },
};

const Grid = styled.div`
  background-color: #f6f6f6;
  overflow-x: hidden;
`;

const Row = styled.div`
  display: flex;
  margin: 0 -10px;
`;

const InputRow = styled(Row)`
  padding: 0 25px;
`;

const HeaderRow = styled(InputRow)`
  background: #119ac2;
`;

const SubmitRow = styled(Row)`
  padding: 0 60px;
  margin-bottom: 20px;
`;

const Col = styled.div`
  position: relative;
  flex: 1;
  padding: 0 10px;
`;

const SubmitCol = styled(Col)`
  padding: 0 15px;
`;

const Label = styled.label`
  display: block;
  padding: 5px 0;
  font-size: 12px;
  color: #fff;
`;

const InputGroup = styled.div`
  padding: 25px 0;
`;
