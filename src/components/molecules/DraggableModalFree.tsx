import React, { useState, useCallback } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import Modal from "react-modal";
import styled from "styled-components";
import GestureHandler from "../atoms/GestureHandler";
import CloseButton from "../atoms/CloseButton";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";

type Props = {
  onFocus: () => void;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  header?: React.ReactNode;
  showCloseButton?: boolean;
  width: number;
  height: number;
  top?: number;
  left: number;
} & Modal.Props;

const DraggableModalFree: React.FC<Props> = (props) => {
  const { children, onFocus, header, onClose = () => {}, showCloseButton = true, width, height, top, left, ...modalProps } = props;
  const headHeight = 40;
  const bodyHeight = `${height - headHeight}px)`;
  const [isMinimize, setIsMinimize] = useState(false);
  const [position, setPosition] = useState({
    x: Math.floor(left),
    y: top !== undefined ? top : Math.floor((window.innerHeight - height) / 2), // topが設定されていなければ画面の中央
  });

  const handleMinimize = useCallback(
    (e: HammerInput) => {
      if (storage.isPc) {
        setIsMinimize(!isMinimize);
        e.preventDefault();
      }
    },
    [isMinimize]
  );

  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    // モーダルが画面からはみ出さないようにする
    let { x, y } = data;

    const Ymin = 0;
    const Ymax = window.innerHeight - headHeight; // 60はヘッダの高さ
    const Xmin = 60 - props.width; // 60は指の大きさ
    const Xmax = window.innerWidth - 60; // 60は指の大きさ

    if (y < Ymin) y = Ymin;
    if (y > Ymax) y = Ymax;
    if (x < Xmin) x = Xmin;
    if (x > Xmax) x = Xmax;

    setPosition({ x, y });

    // このモーダルに、フォーカスを合わせる
    props.onFocus();
  };

  // 最小化状態で閉じられたモードレスを、非最小化状態で開くようにする
  const handleOnOpen = useCallback(() => {
    if (isMinimize) {
      setIsMinimize(false);
    }
  }, [isMinimize]);

  return (
    <ModalWithAnimation
      terminalCat={storage.terminalCat}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onAfterOpen={handleOnOpen}
      closeTimeoutMS={300}
      {...modalProps}
      isOpen={modalProps.isOpen}
    >
      <Draggable handle=".handle" position={position} disabled={!storage.isPc} onStart={onFocus} onStop={handleStop}>
        <Content width={width}>
          <GestureHandler onDoubleTap={handleMinimize}>
            <Header className="handle" headHeight={headHeight}>
              {header}
              {showCloseButton ? <CloseButton onClick={onClose} /> : null}
            </Header>
          </GestureHandler>
          <Body terminalCat={storage.terminalCat} isMinimize={isMinimize} height={bodyHeight}>
            {children}
          </Body>
        </Content>
      </Draggable>
    </ModalWithAnimation>
  );
};

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

const Body = styled.div<{ terminalCat: string | null; isMinimize: boolean; height: string }>`
  height: ${(props) => (props.isMinimize ? "0" : props.height)};
  ${(props) => props.terminalCat === Const.TerminalCat.pc && "transition: height 0.2s linear;"};
  * {
    ${(props) => props.isMinimize && "display: none !important;"};
  }
`;

export default DraggableModalFree;
