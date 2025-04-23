import React from "react";
import Modal, { Styles } from "react-modal";
import styled from "styled-components";
import { removePictograph } from "../../lib/commonUtil";
import PrimaryButton from "../atoms/PrimaryButton";

interface Props {
  isOpen: boolean;
  width: number;
  // eslint-disable-next-line react/no-unused-prop-types
  height: number;
  top: number;
  left: number;
  initialRmksText: string;
  isSubmitable: boolean;
  placeholder: string;
  onClose: (rmksText: string) => void;
  update: (rmksText: string) => void;
}

interface State {
  rmksText: string;
}

class UpdateRmksPopup extends React.Component<Props, State> {
  private rmksTextPopup = React.createRef<HTMLTextAreaElement>();

  constructor(props: Props) {
    super(props);

    this.state = { rmksText: props.initialRmksText };

    this.handleRmksText = this.handleRmksText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if ((this.props.isOpen && !nextProps.isOpen) || nextProps.initialRmksText !== this.props.initialRmksText) {
      this.setState({ rmksText: nextProps.initialRmksText });
    }
  }

  handleRmksText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ rmksText: removePictograph(e.target.value) });
  };

  onSubmit = () => {
    const { isSubmitable, update } = this.props;
    const { rmksText } = this.state;

    if (isSubmitable) {
      update(rmksText);
    }
  };

  render() {
    const { isOpen, width, top, left, isSubmitable, placeholder, onClose } = this.props;
    const { rmksText } = this.state;
    const submitButtonHeight = 13 + 44 + 13;
    const textAreaHeight = isSubmitable ? 125 : 125 + submitButtonHeight;
    const modalHeight = 125 + submitButtonHeight + 2;

    return (
      <Modal
        isOpen={isOpen}
        style={customStyles(width, modalHeight, top, left)}
        onRequestClose={() => onClose(rmksText)}
        onAfterOpen={() => {
          const currentTextArea = this.rmksTextPopup.current;
          const rmksTextLength = rmksText ? rmksText.length : 0;
          if (currentTextArea) {
            currentTextArea.value = rmksText;
          }
          // リマークス欄クリック時に、textareaを一番下まで下げる
          if (currentTextArea && isSubmitable) {
            currentTextArea.setSelectionRange(rmksTextLength, rmksTextLength);
            currentTextArea.focus();
            currentTextArea.scrollTop = currentTextArea.scrollHeight;
          }
        }}
      >
        <div>
          <TextArea
            ref={this.rmksTextPopup}
            maxLength={2048}
            height={textAreaHeight}
            onChange={this.handleRmksText}
            readOnly={!isSubmitable}
            placeholder={placeholder}
          />
          {isSubmitable && (
            <ButtonContainer>
              <PrimaryButton text="Update" onClick={this.onSubmit} />
            </ButtonContainer>
          )}
        </div>
      </Modal>
    );
  }
}

Modal.setAppElement("#content");

const customStyles = (width: number, height: number, top: number, left: number): Styles => ({
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

const TextArea = styled.textarea<{ height: number }>`
  resize: none;
  width: 100%;
  height: ${(props) => `${props.height}px`};
  padding: 4px 6px;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 1px;
  display: block;
  word-wrap: break-word;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;

export default UpdateRmksPopup;
