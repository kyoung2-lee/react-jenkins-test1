import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Field } from "redux-form";
import { storage } from "../../../lib/storage";
import { storageOfUser } from "../../../lib/StorageOfUser";
import * as validates from "../../../lib/validators";
import { RootState } from "../../../store/storeType";
import EventListener from "../../atoms/EventListener";
import MultipleCreatableInput from "../../atoms/MultipleCreatableInput";
import MultipleSelectBox from "../../atoms/MultipleSelectBox";
import PrimaryButton from "../../atoms/PrimaryButton";
import TextArea from "../../atoms/TextArea";
import TextInput from "../../atoms/TextInput";
import UploadFilesComponent, { UploadedFile } from "../../molecules/UploadFilesComponent";
// eslint-disable-next-line import/no-cycle
import {
  CheckBoxContainer,
  CheckBoxLabel,
  Col,
  createOption,
  DEFAULT_TEXTAREA_HEIGHT,
  Flex,
  Label,
  RightContent,
  Row,
  ROW_WIDTH,
  TEXTAREA_MIN_HEIGHT,
  TextAreaContainer,
} from "./Broadcast";

interface OwnProps {
  isActive: boolean;
  onClickAddressDetail: () => void;
  emailAttachments: UploadedFile[];
  onUploadFiles: (uploadFiles: UploadedFile[]) => void;
  onRemoveFile: (index: number) => void;
  mailAddrGrpIdList: number[];
  mailAddrList: string[];
  isForceErrorMailAddrGrpIdList: boolean;
  isForceErrorMailAddrList: boolean;
  onChangeMailAddrGrpIdList: () => void;
  onChangeMailAddrList: () => void;
  onChangeCcSenderAddress: () => void;
  change: (field: string, value: boolean) => void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const BroadcastEmail: React.FC<Props> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const otherInputsAreaRef = useRef<HTMLDivElement>(null);
  const attachmentAreaRef = useRef<HTMLDivElement>(null);

  const [textAreaHeight, setTextAreaHeight] = useState(DEFAULT_TEXTAREA_HEIGHT);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    if (!calculated && isReady()) {
      setTextAreaHeight(calcTextAreaHeight());
      setCalculated(true);
    }
  }, [calculated]);

  useEffect(() => {
    if (props.isActive) {
      props.change("Mail.ccSenderAddressChecked", storageOfUser.getBroadcastEmailCCSenderAddressChecked());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isActive]);

  const isReady = (): boolean => !!(contentRef.current && otherInputsAreaRef.current && attachmentAreaRef.current);

  const calcTextAreaHeight = (): number => {
    if (!contentRef.current || !otherInputsAreaRef.current || !attachmentAreaRef.current) {
      return DEFAULT_TEXTAREA_HEIGHT;
    }
    const height = contentRef.current.clientHeight - otherInputsAreaRef.current.offsetHeight - attachmentAreaRef.current.offsetHeight - 52;
    return height < TEXTAREA_MIN_HEIGHT ? DEFAULT_TEXTAREA_HEIGHT : height;
  };
  const {
    isActive,
    mailAddressGroupOption,
    onClickAddressDetail,
    emailAttachments,
    onUploadFiles,
    onRemoveFile,
    mailAddrGrpIdList,
    mailAddrList,
    isForceErrorMailAddrGrpIdList,
    isForceErrorMailAddrList,
    onChangeMailAddrGrpIdList,
    onChangeMailAddrList,
    onChangeCcSenderAddress,
  } = props;
  const { isPc } = storage;

  return (
    <RightContent disabled={false} isPc={isPc} isActive={isActive} ref={contentRef}>
      <Row ref={otherInputsAreaRef}>
        <Row>
          <Label>e-mail Address Group</Label>
          <Flex>
            <Field
              name="Mail.mailAddrGrpIdList"
              options={mailAddressGroupOption}
              component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
              validate={mailAddrList.length > 0 ? [validates.unique] : [validates.required, validates.unique]}
              maxValLength={MAIL_ADDRESS_GROUP_ITEM_MAX}
              isForceError={isForceErrorMailAddrGrpIdList}
              onChange={onChangeMailAddrGrpIdList}
            />
          </Flex>
        </Row>
        <Row>
          <Label>e-mail Additional Address</Label>
          <Flex>
            <Field
              name="Mail.mailAddrList"
              component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
              validate={
                mailAddrGrpIdList.length > 0
                  ? [validates.isOkEmails, validates.unique]
                  : [validates.required, validates.isOkEmails, validates.unique]
              }
              filterValue={filterEmailAddress}
              maxValLength={MAIL_ADDITIONAL_ADDRESS_ITEM_MAX}
              isForceError={isForceErrorMailAddrList}
              onChange={onChangeMailAddrList}
            />
          </Flex>
        </Row>
        <Row>
          <Flex alignItems="flex-end">
            <Col width={370}>
              <Label>From</Label>
              <Field
                name="Mail.orgnMailAddr"
                component={TextInput as "input" & typeof TextInput}
                validate={[validates.required]}
                width={370}
                disabled
                maxLength={100}
              />
            </Col>
            <Col width={122}>
              <Label>CC: Sender Address</Label>
              <CheckBoxContainer width={120} height={44}>
                <CheckBoxLabel htmlFor="mailCCSenderAddressChecked">
                  <Field
                    id="mailCCSenderAddressChecked"
                    name="Mail.ccSenderAddressChecked"
                    component="input"
                    type="checkbox"
                    onChange={onChangeCcSenderAddress}
                  />
                </CheckBoxLabel>
              </CheckBoxContainer>
            </Col>
            <Col width={190}>
              <PrimaryButton text="Address Detail" type="button" onClick={onClickAddressDetail} disabled={false} />
            </Col>
          </Flex>
        </Row>
        <Row>
          <Label>Title</Label>
          <Field
            name="Mail.mailTitle"
            autoCapitalize="off"
            component={TextInput as "input" & typeof TextInput}
            width={ROW_WIDTH}
            maxLength={100}
          />
        </Row>
      </Row>
      <Row>
        <TextAreaContainer isPc={isPc} height={textAreaHeight}>
          <Field
            name="Mail.mailText"
            component={TextArea as "input" & typeof TextArea}
            validate={[validates.required]}
            maxLength={4000}
            width={ROW_WIDTH}
            maxWidth={ROW_WIDTH}
            minWidth={ROW_WIDTH}
          />
        </TextAreaContainer>
      </Row>
      <Row ref={attachmentAreaRef}>
        <UploadFilesComponent channel="email" uploadedFiles={emailAttachments} onUploadFiles={onUploadFiles} onRemoveFile={onRemoveFile} />
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

const ADDRESS_GROUP_TYPE_MAIL = "M";
const MAIL_ADDRESS_GROUP_ITEM_MAX = 4;
const MAIL_ADDITIONAL_ADDRESS_ITEM_MAX = 8;

const filterEmailAddress = (value: string) => value.slice(0, 100);

const mapStateToProps = (state: RootState) => {
  const {
    account: {
      master: { adGrps },
    },
  } = state;
  const mailAddressGroupOption = adGrps
    .filter((adGrp) => adGrp.addrGrpType === ADDRESS_GROUP_TYPE_MAIL)
    .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
    .map((adGrp) => createOption(adGrp.addrGrpId, adGrp.addrGrpCd));

  return {
    mailAddressGroupOption,
  };
};

export default connect(mapStateToProps)(BroadcastEmail);
