import React from "react";
import Modal, { Styles } from "react-modal";
import styled from "styled-components";
import PrimaryButton from "../atoms/PrimaryButton";

interface Props {
  isOpen: boolean;
  url: string;
  onClose: () => void;
}

class ExternalUrlPopup extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = () => {
    const { onClose } = this.props;

    onClose();
  };

  render() {
    const { isOpen, url } = this.props;

    return (
      <Modal isOpen={isOpen} style={customStyles}>
        <Frame>
          <Content src={url} />
        </Frame>
        <Footer>
          <PrimaryButton text="Close" onClick={this.onSubmit} />
        </Footer>
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
    width: "100%",
    height: "100%",
  },
};

const Frame = styled.div`
  width: 100%;
  height: calc(100vh - 84px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #c9d3d0;
`;

const Content = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ExternalUrlPopup;
