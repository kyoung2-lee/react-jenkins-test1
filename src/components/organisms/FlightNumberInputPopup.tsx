import React, { useState } from "react";
import Modal from "react-modal";
import { change, submit } from "redux-form";

import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { removePictograph, formatFlt } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import * as validates from "../../lib/validators";
import KeyTop from "../atoms/KeyTop";
import KeyboardInputNumber from "./KeyboardInputNumber";
import KeyboardInputAlphabet from "./KeyboardInputAlphabet";
import { closeFlightNumberInputPopup } from "../../reducers/flightNumberInputPopup";
import KeybordIcon from "../../assets/images/icon/icon-keybord.svg?component";
import EnterIcon from "../../assets/images/icon/icon-enter.svg?component";
import KeyTopExecutable from "../atoms/KeyTopExecutable";
import RawTextInput from "../atoms/RawTextInput";

interface State {
  flightNo: string;
  isAlphabetKeybord: boolean;
}

const initialState: State = {
  flightNo: "",
  isAlphabetKeybord: false,
};

const FlightNumberInputPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const flightNumberInputPopup = useAppSelector((state) => state.flightNumberInputPopup);
  const [flightNo, setFlightNo] = useState(initialState.flightNo);
  const [isAlphabetKeybord, setIsAlphabetKeybord] = useState(initialState.isAlphabetKeybord);

  // eslint-disable-next-line @typescript-eslint/require-await
  const onEnter = async () => {
    const { formName, fieldName } = flightNumberInputPopup;
    const formatedFligntNo = formatFlt(flightNo);
    dispatch(change(formName, fieldName, formatedFligntNo));
    flightNumberInputPopup.onEnter();
    await closeModal();
  };

  const onSubmit = async () => {
    const { formName, executeSubmit } = flightNumberInputPopup;
    await onEnter();
    if (executeSubmit) {
      dispatch(submit(formName));
    }
    await closeModal();
  };

  const onRequestClose = async (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
    e.stopPropagation();
    await closeModal();
  };

  // eslint-disable-next-line react/sort-comp
  const checkCanSubmit = (): boolean => {
    const { canOnlyAlCd } = flightNumberInputPopup;
    return validates.hasValue(flightNo) && validates.isOnlyHalfWidth(flightNo) && canOnlyAlCd ? flightNo.length >= 2 : flightNo.length >= 3;
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const closeModal = async () => {
    setFlightNo(initialState.flightNo);
    setIsAlphabetKeybord(initialState.isAlphabetKeybord);
    dispatch(closeFlightNumberInputPopup());
  };

  const clearFlightNo = () => {
    setFlightNo(flightNo.slice(0, -1));
  };

  // eslint-disable-next-line react/sort-comp
  const handleAirLineCode = (airLineCode: string) => {
    setFlightNo(airLineCode);
  };

  const handleButtomInputFlightNo = (inputString: string) => {
    setFlightNoState(flightNo + inputString);
  };

  const setFlightNoState = (nextFlightNo: string) => {
    const maxLength = 6;
    if (nextFlightNo.length <= maxLength) {
      setFlightNo(nextFlightNo);
    }
  };

  const switchKeybord = () => {
    setIsAlphabetKeybord((prevIsAlphabetKeybord) => !prevIsAlphabetKeybord);
  };

  const canSubmit = checkCanSubmit();

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Modal isOpen={flightNumberInputPopup.isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div>
        <Header>
          <SwitchBottom input={switchKeybord}>{isAlphabetKeybord ? "123" : "abc"}</SwitchBottom>
          <div>
            <RawTextInput
              value={flightNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlightNoState(e.target.value)}
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setFlightNoState(removePictograph(e.target.value))}
              placeholder="FLT"
              maxLength={6}
              disabled={storage.terminalCat !== Const.TerminalCat.pc}
              isShowingShadow
              isFixedFocus
              terminalCat={storage.terminalCat}
              autoFocus={storage.terminalCat === Const.TerminalCat.pc}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onEnter={onEnter}
            />
          </div>
          {canSubmit ? (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <EnterBottom input={onEnter}>
              <EnterIcon />
            </EnterBottom>
          ) : (
            <DisabledEnterBottom>
              <EnterIcon />
            </DisabledEnterBottom>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <CloseBottom input={closeModal}>
            <KeybordIcon />
          </CloseBottom>
        </Header>
        <TopColumn>
          {Const.AIRLINES.map((al) => (
            <AirLineCodeKeyTop
              key={al.alCd}
              input={() => {
                void handleAirLineCode(al.alCd);
              }}
            >
              {al.alCd}
            </AirLineCodeKeyTop>
          ))}
        </TopColumn>
        <Content>
          {isAlphabetKeybord ? (
            <KeyboardInputAlphabet
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={onSubmit}
              clear={clearFlightNo}
              canSubmit={canSubmit}
              handle={(value) => handleButtomInputFlightNo(value)}
            />
          ) : (
            <KeyboardInputNumber
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={onSubmit}
              clear={clearFlightNo}
              canSubmit={canSubmit}
              handle={(value) => handleButtomInputFlightNo(value)}
            />
          )}
        </Content>
      </div>
    </Modal>
  );
};

Modal.setAppElement("#content");

const customStyles: Modal.Styles = {
  overlay: {
    zIndex: 999999990 /* reapop(999999999)の下 */,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  content: {
    position: "static",
    width: "370px",
    padding: 0,
  },
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #c9d3d0;
  padding: 10px;
  background-color: #f0f0f0;
`;

const CloseBottom = styled(KeyTopExecutable)`
  width: 50px;
  background: #abb3bb;
  padding: 9px 5px 5px 5px;

  svg {
    width: 50px;
    .a {
      fill: #222;
    }
    .b,
    .c {
      fill: none;
    }
    .c {
      stroke: #222;
    }
    .d {
      stroke: none;
    }
  }
`;

const EnterBottom = styled(KeyTopExecutable)`
  width: 50px;
  background: #1075e7;

  svg {
    width: 15px;
    .a {
      fill: none;
      stroke: #fff;
      stroke-width: 2px;
    }
  }
`;

const DisabledEnterBottom = styled(KeyTopExecutable)`
  width: 50px;

  svg {
    width: 15px;
    .a {
      fill: none;
      stroke: #fff;
      stroke-width: 2px;
      stroke: #000;
    }
  }
`;

const SwitchBottom = styled(KeyTop)`
  font-size: 18px;
  width: 50px;
  background: #abb3bb;
`;

const Content = styled.div`
  padding: 10px;
  background-color: #c8c8c8;
`;

const TopColumn = styled.div`
  width: 100%;
  padding: 10px 10px 0 10px;
  display: flex;
  justify-content: space-between;
  background-color: #c8c8c8;
`;

const AirLineCodeKeyTop = styled(KeyTop)`
  width: 50px;
  font-size: 22px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default FlightNumberInputPopup;
