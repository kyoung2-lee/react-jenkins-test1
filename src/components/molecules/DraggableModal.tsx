import React from "react";
import Draggable from "react-draggable";
import Modal from "react-modal";
import styled from "styled-components";
import GestureHandler from "../atoms/GestureHandler";
import CloseButton from "../atoms/CloseButton";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";
import RoundButtonReload from "../atoms/RoundButtonReload";

type Props = {
  title?: string;
  onFocus: () => void;
  onReload?: () => void;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  reloadButtonBottomHeight?: number;
  posRight?: boolean;
  isFetching?: boolean;
  showCloseButton?: boolean;
} & Modal.Props;

interface State {
  isMinimize: boolean;
  position: { x: number; y: number };
}

// eslint-disable-next-line import/no-mutable-exports
export let draggableModal: DraggableModal | undefined;
class DraggableModal extends React.Component<Props, State> {
  modalWidth = 375;
  deviceTopMargin = storage.terminalCat === Const.TerminalCat.iPhone ? 54 : 5;
  offsetX = storage.terminalCat === Const.TerminalCat.iPhone ? 0 : 10;
  offsetY = storage.terminalCat === Const.TerminalCat.pc ? 5 : storage.terminalCat === Const.TerminalCat.iPad ? 5 + 22 : 22 + 15;
  headHeight = 40;

  constructor(props: Props) {
    super(props);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    draggableModal = this;
    const { offsetX, offsetY, modalWidth } = this;
    // 最初に開く位置を指定
    let x: number;
    let y: number;
    if (this.props.posRight) {
      y = offsetY;
      x = window.innerWidth - modalWidth - offsetX;
    } else {
      y = offsetY;
      x = this.offsetX;
    }

    this.state = {
      isMinimize: false,
      position: { x, y },
    };

    this.handleMinimize = this.handleMinimize.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  protected handleMinimize = (e: HammerInput) => {
    if (storage.isPc) {
      this.setState((prevState) => ({ isMinimize: !prevState.isMinimize }));
      e.preventDefault();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected handleStop = (_e: any, position: any) => {
    // モーダルが画面からはみ出さないようにする
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let { x, y } = position;

    const Ymin = 0;
    const Ymax = window.innerHeight - this.headHeight; // 60はヘッダの高さ
    const Xmin = 60 - this.modalWidth; // 60は指の大きさ
    const Xmax = window.innerWidth - 60; // 60は指の大きさ

    if (y < Ymin) y = Ymin;
    if (y > Ymax) y = Ymax;
    if (x < Xmin) x = Xmin;
    if (x > Xmax) x = Xmax;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.setState({ position: { x, y } });

    // このモーダルに、フォーカスを合わせる
    this.props.onFocus();
  };

  // 最小化状態で閉じられたモードレスを、非最小化状態で開くようにする
  protected handleOnOpen = () => {
    if (this.state.isMinimize) {
      this.setState({ isMinimize: false });
    }
  };

  render() {
    const {
      children,
      onFocus,
      title,
      header,
      reloadButtonBottomHeight,
      onReload,
      onClose = () => {},
      isFetching,
      showCloseButton = true,
      ...modalProps
    } = this.props;
    const { modalWidth, deviceTopMargin, offsetY, headHeight } = this;

    const { isMinimize } = this.state;
    const bodyHeight = `calc(100vh - ${headHeight + offsetY + deviceTopMargin}px)`;
    return (
      <ModalWithAnimation
        terminalCat={storage.terminalCat}
        {...modalProps}
        isOpen={modalProps.isOpen}
        onAfterOpen={this.handleOnOpen}
        closeTimeoutMS={300}
      >
        <Draggable handle=".handle" position={this.state.position} disabled={!storage.isPc} onStart={onFocus} onStop={this.handleStop}>
          <Content width={modalWidth}>
            <GestureHandler onDoubleTap={this.handleMinimize}>
              <Header className="handle" headHeight={headHeight}>
                {header || <Title>{title}</Title>}
                {showCloseButton ? <CloseButton onClick={onClose} /> : null}
              </Header>
            </GestureHandler>
            <Body terminalCat={storage.terminalCat} isMinimize={isMinimize} height={bodyHeight}>
              {children}
              {onReload && (
                <ModalReloadButtonContainer bottomHeight={reloadButtonBottomHeight || 60}>
                  <RoundButtonReload isFetching={isFetching} disabled={false} onClick={onReload} />
                </ModalReloadButtonContainer>
              )}
            </Body>
          </Content>
        </Draggable>
      </ModalWithAnimation>
    );
  }
}

const ModalWithAnimation = styled(Modal)<{ terminalCat: string | null }>`
  opacity: 0;
  position: absolute;
  top: ${({ terminalCat }) => (terminalCat === Const.TerminalCat.iPhone ? "100vh" : "-100px")};
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: 0;
    transition: all 300ms;
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    top: ${({ terminalCat }) => (terminalCat === Const.TerminalCat.iPhone ? "100vh" : "-100px")};
    transition: all 300ms;
  }

  /* .react-draggable {
    height: 100%;
  } */
`;

const Content = styled.div<{ width: number }>`
  width: ${(props) => props.width}px;
  pointer-events: all;
  background: #fff;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.8);
  position: absolute;
`;

const Header = styled.div<{ headHeight: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: ${(props) => props.headHeight}px;
  height: ${(props) => props.headHeight}px;
`;

const Title = styled.div`
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 23px;
  line-height: 31px;
`;

const ModalReloadButtonContainer = styled.div<{ bottomHeight: number | undefined }>`
  position: fixed;
  right: 10px;
  bottom: ${(props) => props.bottomHeight}px;
  margin-top: -55px;
  z-index: 1;
`;

const Body = styled.div<{ terminalCat: string | null; isMinimize: boolean; height: string }>`
  /* position: relative; */
  height: ${(props) => (props.isMinimize ? "0" : props.height)};
  ${(props) => props.terminalCat === Const.TerminalCat.pc && "transition: height 0.2s linear;"};
  * {
    ${(props) => props.isMinimize && "display: none !important;"};
  }
`;

export default DraggableModal;
