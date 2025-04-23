import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useAppDispatch, usePrevious } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import SendIcon from "../../../assets/images/icon/send.svg?component";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { showMessage } from "../../../reducers/bulletinBoard";
import { UserAvatar } from "./UserAvatar";
import InputButton from "../../atoms/InputButton";

interface Props {
  onChangeText: (bbId: number, text: string) => void;
  onSubmit: (bbId: number) => void;
  selectedBBCmtId?: number;
  bbId: number;
  text: string;
  updateTime: string;
  submitable: boolean;
  disabled: boolean;
  profileImg: string;
  setTextAreaRef?: (element: HTMLTextAreaElement) => void;
  cdCtrlDtls: MasterApi.CdCtrlDtl[];
}

const Component: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const [isError, setIsError] = useState(false);
  const prevSelectedBBCmtId = usePrevious(props.selectedBBCmtId);

  useEffect(() => {
    if ((!prevSelectedBBCmtId && !!props.selectedBBCmtId) || (props.selectedBBCmtId && prevSelectedBBCmtId !== props.selectedBBCmtId)) {
      // 編集モードになった時にフォーカスを当てる
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(props.text.length, props.text.length);
      }
    } else if (!!prevSelectedBBCmtId && !props.selectedBBCmtId) {
      // 編集モードをキャンセルされたらフォーカスを外す
      if (textAreaRef.current) {
        textAreaRef.current.blur();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevSelectedBBCmtId, props.selectedBBCmtId]);

  useEffect(() => {
    if (textAreaRef.current) {
      resizeTextArea(textAreaRef.current);
    }
  }, [props.text]);

  useEffect(() => {
    if (isError) {
      setIsError(false);
    }
  }, [isError, props.bbId, props.selectedBBCmtId, props.updateTime, props.disabled]);

  const setTextAreaRef = (element: HTMLTextAreaElement) => {
    textAreaRef.current = element;
    // 親にもRefを渡す
    if (props.setTextAreaRef) {
      props.setTextAreaRef(element);
    }
  };

  const resizeTextArea = (elm: HTMLTextAreaElement) => {
    const element = elm;
    element.style.height = "auto";
    element.style.height = `${elm.scrollHeight}px`;
  };

  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsError(false);
    const text = e.target.value;
    resizeTextArea(e.currentTarget);
    props.onChangeText(props.bbId, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && e.ctrlKey) submit();
  };

  const submit = () => {
    if (!props.submitable) {
      return;
    }
    if (hasValidationErrors()) {
      setIsError(true);
      void dispatch(showMessage({ message: SoalaMessage.M50016C() }));
      return;
    }
    const errMessage = validates.isOkBBComment(props.text);
    if (errMessage) {
      setIsError(true);
      void dispatch(showMessage({ message: errMessage() }));
      return;
    }

    props.onSubmit(props.bbId);
  };

  const hasValidationErrors = () => !props.text || !props.text.trim();

  const insertFixedPhrase = (text: string) => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
    document.execCommand("insertText", false, text);
  };

  const fixComment = props.cdCtrlDtls
    .filter((code) => code.cdCls === "028")
    .sort((a, b) => a.num1 - b.num1)
    .map((code) => ({
      name: storage.isIphone ? code.txt3 : code.txt2,
      text: code.txt1,
    }));

  return (
    <>
      <Container>
        <UserAvatar src={props.profileImg} />
        <CommentInputContainer>
          <TextareaContainer disabled={props.disabled} isError={isError}>
            <Textarea
              ref={setTextAreaRef}
              placeholder="Comment"
              rows={1}
              onChange={change}
              value={props.text}
              disabled={props.disabled}
              onKeyDown={handleKeyDown}
              maxLength={3200} /* 3200文字で入力を制限するが、最終的に3200byteでバリデーションを行っている */
            />
          </TextareaContainer>
        </CommentInputContainer>
        <SendButtonCol>
          <SendButton onClick={submit} disabled={!props.submitable} />
        </SendButtonCol>
      </Container>
      {fixComment.length > 0 && (
        <InputButtonContainer>
          {fixComment.map((c, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <InputButton key={i} text={c.name} onClick={() => insertFixedPhrase(c.text)} />
          ))}
        </InputButtonContainer>
      )}
    </>
  );
};

export const CommentInput = connect((state: RootState) => ({
  cdCtrlDtls: state.account.master.cdCtrlDtls,
}))(Component);

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  position: relative;
`;

const CommentInputContainer = styled.div`
  flex: 1;
`;

const InputButtonContainer = styled.div`
  margin-top: 12px;
  margin-right: 24px;
  padding: 0 10px;
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-end;
  position: relative;
  > button {
    margin-left: 10px;
  }
  > button:first-child {
    margin-left: 0;
  }
`;

const TextareaContainer = styled.div<{ disabled: boolean; isError: boolean }>`
  border: 1px solid ${(props) => (props.isError ? props.theme.color.border.ERROR : "#346181")};
  border-radius: 20px;
  flex: 1;
  align-items: flex-end;
  display: flex;
  padding: 8px 3px;
  // min-width: ${storage.isIphone ? "250px" : "530px"};
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")};
  background: ${({ disabled }) => (disabled ? "#EBEBE4" : "#FFF")};
`;

const Textarea = styled.textarea`
  height: 100%;
  flex: 1;
  max-height: 100px;
  padding-left: 10px;
  border: none;
  background: transparent;
  resize: none;
  ::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;

const SendButtonCol = styled.div`
  margin-left: 10px;
`;

const SendButton = styled(SendIcon)<{ disabled: boolean; onClick: () => void }>`
  width: 24px;
  height: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  fill: ${(props) => (props.disabled ? "#aaa" : "#46627f")};
`;
