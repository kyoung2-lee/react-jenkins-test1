import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { change, Field } from "redux-form";
import { useAppDispatch } from "../../../store/hooks";
import { getPriorities, toUpperCase as toUpperCaseCommon, removeTtyComment } from "../../../lib/commonUtil";
import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/broadcastValidator";
import { RootState } from "../../../store/storeType";
import { storage } from "../../../lib/storage";
import EventListener from "../../atoms/EventListener";
import SuggestSelectBox from "../../atoms/SuggestSelectBox";
import TextArea from "../../atoms/TextArea";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import {
  Col,
  DEFAULT_TEXTAREA_HEIGHT,
  Flex,
  FORM_NAME,
  Label,
  RightContent,
  Row,
  ROW_WIDTH,
  Ruler,
  TEXTAREA_MIN_HEIGHT,
  TextAreaContainerFixed,
} from "./Broadcast";
import { SoalaMessage } from "../../../lib/soalaMessages";

interface OwnProps {
  isActive: boolean;
}
type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const BroadcastAftn: React.FC<Props> = (props) => {
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
  const handleBlur = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      toUpperCase(e.target.name as string, e.target.value as string);
    }
  };

  const toUpperCase = (fieldName: string, value: string) => {
    dispatch(change(FORM_NAME, fieldName, toUpperCaseCommon(value)));
  };

  const { isActive, priorityOption } = props;
  const { isPc } = storage;

  return (
    <RightContent disabled={false} isPc={isPc} isActive={isActive} ref={contentRef}>
      <Row ref={otherInputsAreaRef}>
        <Row>
          <Flex>
            <Flex width={222}>
              <Col width={70}>
                <Label>Priority</Label>
                <Field
                  name="Aftn.priority"
                  component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                  validate={[validates.required, myValidates.isPriority]}
                  options={priorityOption}
                  width={70}
                  maxLength={2}
                  hasBlank
                />
              </Col>
              <Col width={140}>
                <Label>Originator</Label>
                <Field
                  name="Aftn.originator"
                  component={TextInput as "input" & typeof TextInput}
                  width={140}
                  maxLength={7}
                  componentOnBlur={handleBlur}
                  validate={[validates.isOkBroadcastTtyAddress, validates.required]}
                />
              </Col>
            </Flex>
          </Flex>
        </Row>
        <Row>
          <Ruler isPc={isPc}>....+....1....+....2....+....3....+....4....+....5....+....6....+....7</Ruler>
        </Row>
      </Row>
      <Row>
        <TextAreaContainerFixed isPc={isPc} height={textAreaHeight}>
          <Field
            name="Aftn.aftnText"
            component={TextArea as "input" & typeof TextArea}
            width={ROW_WIDTH}
            maxLength={4000}
            maxLengthCRLFCheck
            maxWidth={ROW_WIDTH}
            minWidth={ROW_WIDTH}
            maxRowLength={69}
            componentOnBlur={handleBlur}
            validate={[validates.required, isOkBroadcastAftn]}
          />
        </TextAreaContainerFixed>
      </Row>
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

const mapStateToProps = (state: RootState) => {
  const {
    account: {
      master: { cdCtrlDtls },
    },
  } = state;

  const priorityOption = getPriorities(cdCtrlDtls);

  return {
    priorityOption,
  };
};

const isOkBroadcastAftn = (value = "") => {
  const removedComment = removeTtyComment(value);
  return !isAftnTextPattern(removedComment) || !isAftnTextBytes(removedComment) ? SoalaMessage.M50014C : undefined;
};

type typeValue = string | number | undefined | null;

const matchAddress = "(SS|DD|FF|GG|KK)( [A-Z0-9]{8}){1,7}";
const matchNewLine = "(\r\n|\n)";
const matchSender = "([0][1-9]|[12][0-9]|3[0-1])([01][0-9]|2[0-3])([0-5][0-9]) ([A-Z0-9]{8})";
const matchText = "[A-Z0-9 .()+*\\-/,_?:@'=\\\\%:#\r\n]*$";
const aftnTextPattern = `^(${matchAddress}${matchNewLine}){1,8}${matchSender}${matchNewLine}${matchText}`;
const isAftnTextPattern = (value: typeValue) => !!(value != null && value.toString().match(new RegExp(aftnTextPattern)));

// aftnTextの本文のみ抽出
const matchNonTextPattern = `^(${matchAddress}${matchNewLine}){1,8}${matchSender}${matchNewLine}`;
const aftnText = (value: typeValue) => (value != null ? value.toString().replace(new RegExp(matchNonTextPattern), "") : "");
const isAftnTextBytes = (value: typeValue) =>
  !!(
    aftnText(value) != null &&
    aftnText(value)
      .replace(/\r\n|\n/g, "")
      .match(/^.{1,1800}$/)
  );

export default connect(mapStateToProps)(BroadcastAftn);
