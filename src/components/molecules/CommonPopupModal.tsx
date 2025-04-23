import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import PopupCommonHeader, { Props as PopupCommonHeaderProps } from "../atoms/PopupCommonHeader";

type Props = {
  width?: number;
  height?: number;
} & PopupCommonHeaderProps &
  Modal.Props;

interface State {
  style: Modal.Styles;
}

class CommonPopupModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      style: {},
    };
  }

  UNSAFE_componentWillMount() {
    const { width, height, ...modalProps } = this.props;
    this.setState({ style: modalProps.style || modalStyle(width, height) });
  }

  componentWillUnmount() {
    this.setState({ style: {} });
  }

  render() {
    const { children, width, flightHeader = null, arr = null, dep = null, ...modalProps } = this.props;

    return (
      <Modal {...modalProps} style={this.state.style}>
        <Content width={width}>
          <PopupCommonHeader flightHeader={flightHeader} arr={arr} dep={dep} />
          {children}
        </Content>
      </Modal>
    );
  }
}

Modal.setAppElement("#content");

const modalStyle = (width?: number, height?: number): Modal.Styles => ({
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    borderRadius: "0",
    border: "none",
    width: `${width || 375}px`,
    maxHeight: `${height || 0}px`,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "auto",
    padding: "0",
    overflow: "hidden",
  },
});

const Content = styled.div<{ width?: number }>`
  width: ${(props) => props.width || 375}px;
  pointer-events: all;
  background: #fff;
  position: absolute;
`;

export default CommonPopupModal;
