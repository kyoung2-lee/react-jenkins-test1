import React, { useState, useEffect } from "react";
import Modal, { Styles } from "react-modal";
import styled from "styled-components";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector, usePrevious } from "../../store/hooks";
import { removePictograph, formatFltNo } from "../../lib/commonUtil";
import { storage } from "../../lib/storage";
import PrimaryButton from "../atoms/PrimaryButton";
import * as editRmksPopupActions from "../../reducers/editRmksPopup";

const EditRmksPopup: React.FC = () => {
  const dispatch = useAppDispatch();

  const editRmksPopup = useAppSelector((state) => state.editRmksPopup);

  const [rmksText, setRmksText] = useState(editRmksPopup.rmksText);
  const [initialRmksText, setInitialRmksText] = useState(editRmksPopup.rmksText);

  const rmksTextRef = React.useRef<HTMLTextAreaElement>(null);

  const prevIsFetching = usePrevious(editRmksPopup.isFetching);

  useEffect(() => {
    if (!editRmksPopup.isFetching && prevIsFetching) {
      setRmksText(editRmksPopup.rmksText);
      setInitialRmksText(editRmksPopup.rmksText);

      const rmksTextLength = editRmksPopup.rmksText ? editRmksPopup.rmksText.length : 0;
      if (rmksTextRef.current) {
        rmksTextRef.current.value = editRmksPopup.rmksText;
        // リマークス欄クリック時に、textareaを一番下まで下げる
        if (editRmksPopup.isEnabled) {
          rmksTextRef.current.setSelectionRange(rmksTextLength, rmksTextLength);
          rmksTextRef.current.scrollTop = rmksTextRef.current.scrollHeight;
          if (rmksTextRef.current) {
            rmksTextRef.current.focus();
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRmksPopup.isFetching]);

  const handleRmksText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRmksText(removePictograph(e.target.value));
  };

  const onSubmit = () => {
    const { isEnabled, key, mode } = editRmksPopup;

    if (initialRmksText === rmksText) {
      void dispatch(editRmksPopupActions.showNotificationNoChange());
    } else if (isEnabled && key) {
      void dispatch(
        editRmksPopupActions.updateFlightRmks({
          orgDateLcl: key.orgDateLcl,
          alCd: key.alCd,
          fltNo: key.fltNo,
          casFltNo: key.casFltNo || "",
          skdDepApoCd: key.skdDepApoCd,
          skdArrApoCd: key.skdArrApoCd,
          skdLegSno: key.skdLegSno,
          oalTblFlg: key.oalTblFlg,
          rmksTypeCd: mode,
          rmksText,
        })
      );
    }
  };

  const { isOpen, position, isEnabled, isFetching, placeholder, alCd, fltNo, casFltNo, orgDateLcl, lstDepApoCd, lstArrApoCd } =
    editRmksPopup;
  const submitButtonHeight = 13 + 44 + 13;
  const textAreaHeight = 125;
  const height = 42 + textAreaHeight + submitButtonHeight + 2;
  const width = position.width || 500;
  const top = position.top || (window.innerHeight - height) / 2; // position.top=0の場合は中央にする。
  const left = position.left || (window.innerWidth - width) / 2; // position.left=0の場合は中央にする。
  return (
    <Modal
      isOpen={isOpen}
      style={customStyles({ height, width, top, left }) as Styles}
      onRequestClose={() => {
        if (initialRmksText === rmksText) {
          dispatch(editRmksPopupActions.closeEditRmksPopup());
          setRmksText("");
          setInitialRmksText("");
        } else {
          void dispatch(
            editRmksPopupActions.showConfirmation({
              onClickYes: () => {
                dispatch(editRmksPopupActions.closeEditRmksPopup());
                setRmksText("");
                setInitialRmksText("");
              },
            })
          );
        }
      }}
    >
      <Content hidden={storage.isPc ? isFetching : false}>
        {" "}
        {/* iPadは、hiddenするとフォーカスが当たらなくなるのでやらない */}
        <Title casFltNo={casFltNo}>
          <div className="fltNo">
            {casFltNo ? (
              <span>{casFltNo}</span>
            ) : (
              <>
                <small>{alCd}</small>
                {formatFltNo(fltNo)}
              </>
            )}
          </div>
          <div className="date">{orgDateLcl && `/${dayjs(orgDateLcl).format("DDMMM").toUpperCase()}`}</div>
          <div className="apoCd">
            {lstDepApoCd}
            {lstArrApoCd && `-${lstArrApoCd}`}
          </div>
        </Title>
        <TextArea
          ref={rmksTextRef}
          autoFocus
          maxLength={2048}
          height={textAreaHeight}
          onChange={handleRmksText}
          readOnly={!isEnabled}
          placeholder={placeholder}
        />
        <ButtonContainer>
          <PrimaryButton text="Update" onClick={onSubmit} disabled={!isEnabled || isFetching} />
        </ButtonContainer>
      </Content>
    </Modal>
  );
};

Modal.setAppElement("#content");

const customStyles = ({ width, height, top, left }: { width: number; height: number; top: number; left: number }) => ({
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    position: "absolute",
    width: `${width}px`,
    height: `${height}px`,
    top: `${top}px`,
    left: `${left}px`,
    padding: 0,
    borderRadius: 0,
  },
});

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 0;
  background: #f6f6f6;
  button {
    width: 100px;
  }
`;

const Content = styled.div`
  background: #f6f6f6;
  padding: 0px 10px;
`;

const Title = styled.div<{ casFltNo: string }>`
  display: flex;
  padding: 8px;
  height: 42px;
  vertical-align: bottom;
  justify-content: center;
  align-items: flex-end;
  font-size: 22px;
  .fltNo {
    small {
      font-size: 16px;
    }
    span {
      ${({ casFltNo }) => (casFltNo ? (casFltNo.length > 6 ? "font-size: 15px;" : "font-size: 22px;") : "")}
    }
  }
  .date {
    margin-right: 2px;
  }
  .apoCd {
    margin-left: 14px;
    font-size: 20px;
  }
`;

const TextArea = styled.textarea<{ height: number }>`
  background: #fff;
  resize: none;
  width: 100%;
  height: ${(props) => `${props.height}px`};
  padding: 4px 6px;
  border: none;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 1px;
  display: block;
  word-wrap: break-word;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;

export default EditRmksPopup;
