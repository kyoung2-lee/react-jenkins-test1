import React, { useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { connect } from "react-redux";
import { Field, formValueSelector, InjectedFormProps, reduxForm } from "redux-form";
import TextInput from "../../atoms/TextInput";
import PrimaryButton from "../../atoms/PrimaryButton";
import { SoalaMessage } from "../../../lib/soalaMessages";
import * as validates from "../../../lib/validators";
import { useAppDispatch, usePrevious } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import { showMessage } from "../../../reducers/bulletinBoard";
import { closeBulletinBoardResponseModal } from "../../../reducers/bulletinBoardResponseEditorModal";
import { execWithLocationInfo } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import TextArea from "../../atoms/TextArea";

interface Props {
  opened: RootState["bulletinBoardResponseEditorModal"]["opened"];
  bbId: RootState["bulletinBoardResponseEditorModal"]["bbId"];
  response: RootState["bulletinBoardResponseEditorModal"]["response"];
  onCreateResponse: (params: BulletinBoardAddResponse.Request) => void;
  onUpdateResponse: (params: BulletinBoardUpdateResponse.Request) => void;
  formValues: FormParams;
}

export interface FormParams {
  title: string;
  text: string;
}

const Component: React.FC<Props & InjectedFormProps<FormParams, Props>> = (props) => {
  const dispatch = useAppDispatch();
  const prevResponse = usePrevious(props.response);

  useEffect(() => {
    if (props.response !== prevResponse) {
      props.change("title", props.response ? props.response.title : "");
      props.change("text", props.response ? props.response.text : "");
    } else if (!props.opened) {
      props.reset();
    }
  }, [prevResponse, props]);

  const submitable = () => {
    const { formValues, response } = props;
    const { title: initialTitle, text: initialText } = response || { title: "", text: "" };
    const { title, text } = formValues;

    if (!(text || "").trim()) {
      return false;
    }
    if (!response) {
      return true;
    }
    return (title || "") !== (initialTitle || "") || (text || "") !== (initialText || "");
  };

  const edited = () => {
    const { formValues, response } = props;
    const { title: initialTitle, text: initialText } = response || { title: "", text: "" };
    const { title, text } = formValues;

    if (!response) {
      return !!title || !!text;
    }
    return (title || "") !== (initialTitle || "") || (text || "") !== (initialText || "");
  };

  const submit = (values: FormParams) => {
    if (!submitable()) return;

    if (!isNew()) {
      updateResponse(values);
      return;
    }

    createResponse(values);
  };

  const close = () => {
    if (edited()) {
      void dispatch(
        showMessage({
          message: SoalaMessage.M40001C({
            onYesButton: () => dispatch(closeBulletinBoardResponseModal()),
          }),
        })
      );
    } else {
      dispatch(closeBulletinBoardResponseModal());
    }
  };

  const createResponse = (values: FormParams) => {
    const { bbId, onCreateResponse } = props;
    if (!bbId) return;
    // ロケーションを取得し実行する
    execWithLocationInfo(({ posLat, posLon }) => {
      onCreateResponse({ bbId, resTitle: values.title, resText: values.text, posLat, posLon });
    });
  };

  const updateResponse = (values: FormParams) => {
    const { response, onUpdateResponse } = props;
    if (!response) return;
    const resId = response.id;
    const resTitle = values.title;
    const resText = values.text;
    // ロケーションを取得し実行する
    execWithLocationInfo(({ posLat, posLon }) => {
      onUpdateResponse({ resId, resTitle, resText, posLat, posLon });
    });
  };

  const isNew = () => !props.response;

  const customStyles = () => ({
    overlay: {
      background: "rgba(0, 0, 0, 0.5)",
      overflow: "auto",
      zIndex: 999999990 /* reapop(999999999)の下 */,
    },
    content: {
      borderRadius: "0",
      border: "none",
      width: storage.isIphone ? "100%" : "1012px",
      top: storage.isIphone ? 0 : "calc(50% - 200px)",
      left: 0,
      right: 0,
      bottom: "auto",
      margin: "22px auto",
      padding: "0",
    },
  });

  const { opened, handleSubmit } = props;

  return (
    <Modal isOpen={opened} onRequestClose={close} style={customStyles()}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <form onSubmit={handleSubmit(submit)}>
        <Content>
          <Header>Response</Header>
          <InputRow>
            <Field name="title" component={TextInput} width="100%" placeholder="Title" autoFocus maxLength={300} />
          </InputRow>
          <InputRow>
            <Field
              name="text"
              component={TextArea}
              width="100%"
              height={150}
              validate={[validates.required, validates.isOkUnlimitedTextByte]}
            />
          </InputRow>
          <SubmitRow>
            <PrimaryButton disabled={!submitable()} text="Update" type="submit" />
          </SubmitRow>
        </Content>
      </form>
    </Modal>
  );
};

const Form = reduxForm<FormParams, Props>({
  form: "bulletinBoardResponseEditorModal",
  initialValues: { title: "", text: "" },
})(Component);

const selector = formValueSelector("bulletinBoardResponseEditorModal");

export const ResponseEditorModal = connect((state: RootState) => ({
  ...state.bulletinBoardResponseEditorModal,
  formValues: selector(state, "title", "text") as FormParams,
}))(Form);

const Content = styled.div`
  background-color: #f6f6f6;
  overflow-x: hidden;
  padding: 16px 24px;
`;

const InputRow = styled.div`
  margin-bottom: 4px;
`;

const Header = styled.p`
  font-size: 14px;
  margin: 0 0 4px 0;
`;

const SubmitRow = styled.div`
  margin: auto;
  width: 100px;
`;
