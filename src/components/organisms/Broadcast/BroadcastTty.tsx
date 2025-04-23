import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { change, Field } from "redux-form";
import styled from "styled-components";
import { useAppDispatch } from "../../../store/hooks";
import { storage } from "../../../lib/storage";
import { storageOfUser } from "../../../lib/StorageOfUser";
import { getPriorities, toUpperCase as toUpperCaseCommon } from "../../../lib/commonUtil";
import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/broadcastValidator";
import { RootState } from "../../../store/storeType";
import EventListener from "../../atoms/EventListener";
import MultipleCreatableInput from "../../atoms/MultipleCreatableInput";
import MultipleSelectBox from "../../atoms/MultipleSelectBox";
import PrimaryButton from "../../atoms/PrimaryButton";
import SuggestSelectBox from "../../atoms/SuggestSelectBox";
import TextArea from "../../atoms/TextArea";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import {
  CheckBoxContainer,
  CheckBoxLabel,
  Col,
  createOption,
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

interface OwnProps {
  isActive: boolean;
  onClickAddressDetailButton: () => void;
  ttyAddrGrpIdList: number[];
  ttyAddrList: string[];
  isForceErrorTtyAddrGrpIdList: boolean;
  isForceErrorTtyAddrList: boolean;
  onChangeTtyAddrGrpIdList: () => void;
  onChangeTtyAddrList: () => void;
  onChangeCcSenderAddress: () => void;
  onChangeDivisionSending: () => void;
  change: (field: string, value: boolean) => void;
}
type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const BroadcastTty: React.FC<Props> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const otherInputsAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const [textAreaHeight, setTextAreaHeight] = useState(DEFAULT_TEXTAREA_HEIGHT);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    if (props.isActive) {
      props.change("Tty.ccSenderAddressChecked", storageOfUser.getBroadcastTtyCCSenderAddressChecked());
      props.change("Tty.divisionSendingChecked", storageOfUser.getBroadcastTtyDivisionSendingChecked());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isActive]);

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

  const handleKeyPress = (values: string[]) => values.map((value) => toUpperCaseCommon(value));

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

  const {
    isActive,
    ttyAddressGroupOption,
    ttyPriorityCdOption,
    onClickAddressDetailButton,
    ttyAddrGrpIdList,
    ttyAddrList,
    isForceErrorTtyAddrGrpIdList,
    isForceErrorTtyAddrList,
    onChangeTtyAddrGrpIdList,
    onChangeTtyAddrList,
    onChangeCcSenderAddress,
    onChangeDivisionSending,
  } = props;
  const { isPc } = storage;

  return (
    <RightContent disabled={false} isPc={isPc} isActive={isActive} ref={contentRef}>
      <Row ref={otherInputsAreaRef}>
        <Row>
          <Label>TTY Address Group</Label>
          <Flex>
            <Field
              name="Tty.ttyAddrGrpIdList"
              options={ttyAddressGroupOption}
              component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
              validate={ttyAddrList.length > 0 ? [validates.unique] : [validates.unique, validates.required]}
              maxValLength={TTY_ADDRESS_GROUP_ITEM_MAX}
              isForceError={isForceErrorTtyAddrGrpIdList}
              onChange={onChangeTtyAddrGrpIdList}
              fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
            />
          </Flex>
        </Row>
        <Row>
          <Label>TTY Additional Address</Label>
          <Flex>
            <Field
              name="Tty.ttyAddrList"
              component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
              validate={
                ttyAddrGrpIdList.length > 0
                  ? [validates.isOkBroadcastTtyAddresses]
                  : [validates.isOkBroadcastTtyAddresses, validates.required]
              }
              filterValue={filterTtyAddress}
              formatValues={handleKeyPress}
              maxValLength={TTY_ADDITIONAL_ADDRESS_ITEM_MAX}
              isForceError={isForceErrorTtyAddrList}
              fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
              onChange={onChangeTtyAddrList}
            />
          </Flex>
        </Row>
        <Row>
          <Flex alignItems="flex-end">
            <Col width={70}>
              <Label>Priority</Label>
              <Field
                name="Tty.ttyPriorityCd"
                component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                validate={[validates.required, myValidates.isPriority]}
                options={ttyPriorityCdOption}
                width={70}
                maxLength={2}
                hasBlank
              />
            </Col>
            <Col width={140}>
              <Label>Originator</Label>
              <Field
                name="Tty.orgnTtyAddr"
                component={TextInput as "input" & typeof TextInput}
                width={140}
                maxLength={7}
                componentOnBlur={handleBlur}
                validate={[validates.isOkBroadcastTtyAddress, validates.required]}
              />
            </Col>
            <Col width={270}>
              <div style={{ width: "130px" }}>
                <Label>CC: Sender Address</Label>
                <CheckBoxContainer width={120} height={44}>
                  <CheckBoxLabel htmlFor="ttyCCSenderAddressChecked">
                    <Field
                      id="ttyCCSenderAddressChecked"
                      name="Tty.ccSenderAddressChecked"
                      component="input"
                      type="checkbox"
                      onChange={onChangeCcSenderAddress}
                    />
                  </CheckBoxLabel>
                </CheckBoxContainer>
              </div>
              <div style={{ width: "130px", marginLeft: "5px" }}>
                <Label>Division Sending</Label>
                <CheckBoxContainer width={120} height={44}>
                  <CheckBoxLabel htmlFor="ttyDivisionSendingChecked">
                    <Field
                      id="ttyDivisionSendingChecked"
                      name="Tty.divisionSendingChecked"
                      component="input"
                      type="checkbox"
                      onChange={onChangeDivisionSending}
                    />
                  </CheckBoxLabel>
                </CheckBoxContainer>
              </div>
            </Col>
            <Col width={190}>
              <TtyAddressDetailButton>
                <PrimaryButton text="Address Detail" type="button" onClick={onClickAddressDetailButton} disabled={false} />
              </TtyAddressDetailButton>
            </Col>
          </Flex>
        </Row>
        <Row>
          <Ruler isPc={isPc}>....+....1....+....2....+....3....+....4....+....5....+....6....+....7</Ruler>
        </Row>
      </Row>
      <Row>
        <TextAreaContainerFixed isPc={isPc} height={textAreaHeight}>
          <Field
            name="Tty.ttyText"
            component={TextArea as "input" & typeof TextArea}
            width={ROW_WIDTH}
            maxLength={4000}
            maxLengthCRLFCheck
            maxWidth={ROW_WIDTH}
            minWidth={ROW_WIDTH}
            maxRowLength={69}
            componentOnBlur={handleBlur}
            validate={[validates.required, validates.isOkBroadcastTty]}
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

const TtyAddressDetailButton = styled.div`
  position: relative;
  width: 100%;
`;

const ADDRESS_GROUP_TYPE_TTY = "T";
const TTY_ADDRESS_GROUP_ITEM_MAX = 4;
const TTY_ADDITIONAL_ADDRESS_ITEM_MAX = 100;

const filterTtyAddress = (value: string) => value.slice(0, 7);

const mapStateToProps = (state: RootState) => {
  const {
    account: {
      master: { cdCtrlDtls, adGrps },
    },
  } = state;

  const ttyAddressGroupOption = adGrps
    .filter((adGrp) => adGrp.addrGrpType === ADDRESS_GROUP_TYPE_TTY)
    .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
    .map((adGrp) => createOption(adGrp.addrGrpId, adGrp.addrGrpCd));
  const ttyPriorityCdOption = getPriorities(cdCtrlDtls);

  return {
    ttyAddressGroupOption,
    ttyPriorityCdOption,
  };
};

export default connect(mapStateToProps)(BroadcastTty);
