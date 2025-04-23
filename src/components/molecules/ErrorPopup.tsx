import React from "react";
import Modal, { Styles } from "react-modal";
import styled from "styled-components";
import { AppDispatch } from "../../store/storeType";
import PrimaryButton from "../atoms/PrimaryButton";

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: AppDispatch;
  isError: boolean;
  retry: () => void;
}

class ErrorPopup extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    // eslint-disable-next-line react/no-unused-state
    this.state = { time: "" };
  }

  onSubmit = () => {
    const { retry } = this.props;
    retry();
  };

  render() {
    const { isError } = this.props;

    return (
      <Modal isOpen={isError} style={customStyles}>
        <div>
          <Header>
            <div>情報の取得に失敗しました</div>
          </Header>
          <Content>
            <PrimaryButton text="リトライ" onClick={this.onSubmit} />
          </Content>
        </div>
      </Modal>
    );
  }
}

Modal.setAppElement("#content");

const customStyles: Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999999, // 最大値
  },
  content: {
    position: "static",
    width: "370px",
  },
};

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
  margin: -20px -20px 9px;
  border-bottom: 1px solid #c9d3d0;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ErrorPopup;
