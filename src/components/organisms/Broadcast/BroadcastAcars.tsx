import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { change, Field } from "redux-form";
import { useAppDispatch } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import { storage } from "../../../lib/storage";
import { toUpperCase as toUpperCaseCommon } from "../../../lib/commonUtil";
import * as validates from "../../../lib/validators";
import EventListener from "../../atoms/EventListener";
import MultipleSelectBox from "../../atoms/MultipleSelectBox";
import TextArea from "../../atoms/TextArea";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import {
  CheckBoxContainer,
  CheckBoxLabel,
  createOption,
  DEFAULT_TEXTAREA_HEIGHT,
  Flex,
  FORM_NAME,
  Label,
  RightContent,
  Row,
  Ruler,
  TEXTAREA_MIN_HEIGHT,
  TextAreaContainerFixed,
} from "./Broadcast";

interface OwnProps {
  isActive: boolean;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const BroadcastAcars: React.FC<Props> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const otherInputsAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const [textAreaHeight, setTextAreaHeight] = useState(DEFAULT_TEXTAREA_HEIGHT);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    if (!calculated && isReady()) {
      setTextAreaHeight(calcTextAreaHeight());
      setCalculated(true);
    }
  }, [calculated]);

  const isReady = (): boolean => !!(contentRef.current && otherInputsAreaRef.current);

  const calcTextAreaHeight = (): number => {
    if (!contentRef.current || !otherInputsAreaRef.current) {
      return DEFAULT_TEXTAREA_HEIGHT;
    }
    const height = contentRef.current.clientHeight - otherInputsAreaRef.current.offsetHeight - 42;
    return height < TEXTAREA_MIN_HEIGHT ? DEFAULT_TEXTAREA_HEIGHT : height;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toUpperCase = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dispatch(change(FORM_NAME, e.target.name as string, toUpperCaseCommon(e.target.value as string)));
    }
  };

  const { isActive, shipOption } = props;

  const { isPc } = storage;
  return (
    <RightContent disabled={false} isPc={isPc} isActive={isActive} ref={contentRef}>
      <Row ref={otherInputsAreaRef}>
        <Row>
          <Label>SHIP</Label>
          <Flex>
            <Field
              name="Acars.shipNoList"
              options={shipOption}
              component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
              validate={[validates.required, validates.unique]}
              maxValLength={SHIP_ITEM_MAX}
            />
          </Flex>
        </Row>
        <Row>
          <Label>Originator</Label>
          <Flex>
            <Field
              name="Acars.orgnTtyAddr"
              autoCapitalize="off"
              component={TextInput as "input" & typeof TextInput}
              width={140}
              maxLength={7}
              componentOnBlur={toUpperCase}
              validate={[validates.required, validates.isOkBroadcastTtyAddress]}
            />
          </Flex>
        </Row>
        <Row>
          <Ruler isPc={isPc}>....+....1....+....2....+....3....+....4</Ruler>
        </Row>
      </Row>
      <Flex>
        <Flex width={410}>
          <TextAreaContainerFixed isPc={isPc} height={textAreaHeight}>
            <Field
              name="Acars.uplinkText"
              component={TextArea as "input" & typeof TextArea}
              width={410}
              maxLength={2100}
              maxLengthCRLFCheck
              maxRowLength={40}
              maxRows={50}
              maxWidth={410}
              minWidth={410}
              componentOnBlur={toUpperCase}
              validate={[validates.required, validates.isOkBroadcastAcars]}
            />
          </TextAreaContainerFixed>
        </Flex>
        <CheckBoxContainer width={280}>
          <CheckBoxLabel htmlFor="acarsReqAckFlg">
            <Field name="Acars.reqAckFlg" id="acarsReqAckFlg" component="input" tabIndex={22} type="checkbox" />
            REQ ACK
          </CheckBoxLabel>
        </CheckBoxContainer>
      </Flex>
      <EventListener
        eventHandlers={[
          {
            target: window,
            type: "resize",
            listener: () => setTextAreaHeight(calcTextAreaHeight()),
            options: false,
          },
        ]}
      />
    </RightContent>
  );
};

const SHIP_ITEM_MAX = 8;

const mapStateToProps = (state: RootState) => {
  const {
    account: {
      master: { ships },
    },
  } = state;
  const shipOption = ships.map((ship) => createOption(ship.shipNo));
  return {
    shipOption,
  };
};

export default connect(mapStateToProps)(BroadcastAcars);
