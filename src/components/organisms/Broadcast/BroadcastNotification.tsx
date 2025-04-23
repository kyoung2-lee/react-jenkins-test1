import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Field } from "redux-form";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
import { RootState } from "../../../store/storeType";
import EventListener from "../../atoms/EventListener";
import MultipleSelectBox from "../../atoms/MultipleSelectBox";
import PrimaryButton from "../../atoms/PrimaryButton";
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
  Label,
  RightContent,
  Row,
  ROW_WIDTH,
  TEXTAREA_MIN_HEIGHT,
  TextAreaContainer,
} from "./Broadcast";

interface OwnProps {
  isActive: boolean;
  onClickAddressDetailButton: () => void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const BroadcastNotification: React.FC<Props> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const otherInputsAreaRef = useRef<HTMLDivElement>(null);

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

  const { isActive, commGrpOption, grpOption, jobOption, onClickAddressDetailButton } = props;
  const { isPc } = storage;
  return (
    <RightContent disabled={false} isPc={isPc} isActive={isActive} ref={contentRef}>
      <Row ref={otherInputsAreaRef}>
        <Row>
          <Label>Communication Group</Label>
          <Flex>
            <Flex width={475}>
              <Field
                name="Notification.commGrpIdList"
                options={commGrpOption}
                component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
                validate={[validates.unique]}
                maxValLength={COMMUNICATION_GROUP_ITEM_MAX}
              />
            </Flex>
            <Col width={190}>
              <PrimaryButton text="Address Detail" type="button" onClick={onClickAddressDetailButton} />
            </Col>
          </Flex>
        </Row>
        <Row>
          <Label>Job Group</Label>
          <Flex>
            <Field
              name="Notification.jobGrpIdList"
              options={grpOption}
              component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
              validate={[validates.unique]}
              maxValLength={JOB_GROUP_ITEM_MAX}
            />
          </Flex>
        </Row>
        <Row>
          <Label>Job Code</Label>
          <Field
            name="Notification.jobIdList"
            component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
            options={jobOption}
            validate={[validates.required, validates.unique]}
            maxValLength={JOB_CODE_ITEM_MAX}
          />
        </Row>
        <Row>
          <Label>Title</Label>
          <Flex>
            <Flex width={496}>
              <Field
                name="Notification.ntfTitle"
                autoCapitalize="off"
                component={TextInput as "input" & typeof TextInput}
                width={496}
                maxLength={300}
                validate={[validates.required]}
              />
            </Flex>
            <CheckBoxContainer width={200}>
              <CheckBoxLabel htmlFor="soundFlg">
                <Field id="soundFlg" name="Notification.soundFlg" component="input" tabIndex={22} type="checkbox" />
                Notification Sound
              </CheckBoxLabel>
            </CheckBoxContainer>
          </Flex>
        </Row>
      </Row>
      <Row>
        <TextAreaContainer isPc={isPc} height={textAreaHeight}>
          <Field
            name="Notification.ntfText"
            component={TextArea as "input" & typeof TextArea}
            width={ROW_WIDTH}
            maxLength={3200} /* 3200文字で入力を制限するが、最終的に3200byteでバリデーションを行っている */
            maxWidth={ROW_WIDTH}
            minWidth={ROW_WIDTH}
            validate={[validates.isOkBroadcastNtf]}
          />
        </TextAreaContainer>
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

const COMMUNICATION_GROUP_ITEM_MAX = 4;
const JOB_GROUP_ITEM_MAX = 4;
const JOB_CODE_ITEM_MAX = 4;

const mapStateToProps = (state: RootState) => {
  const {
    account: {
      jobAuth: { user },
      master: { jobs, grps, commGrps },
    },
  } = state;

  const commGrpOption = commGrps
    .slice()
    .sort((a, b) => a.commGrpDispSeq - b.commGrpDispSeq)
    .map((commGrp) => createOption(commGrp.commGrpId, commGrp.commGrpCd));

  const userGrp = grps.filter((grp) => grp.grpId === user.grpId);
  const otherGrps = grps.filter((grp) => grp.grpId !== user.grpId).sort((a, b) => a.grpDispSeq - b.grpDispSeq);
  const grpOption = userGrp.concat(otherGrps).map((grp) => createOption(grp.grpId, grp.grpCd));

  const userJobGrps = jobs.filter((grp) => grp.grpId === user.grpId).sort((a, b) => (a.jobCd < b.jobCd ? -1 : 1));
  const otherJobGrps = jobs.filter((grp) => grp.grpId !== user.grpId).sort((a, b) => (a.jobCd < b.jobCd ? -1 : 1));
  const jobOption = userJobGrps.concat(otherJobGrps).map((job) => createOption(job.jobId, job.jobCd, job.jobCd === user.jobCd));

  return {
    commGrpOption,
    grpOption,
    jobOption,
  };
};

export default connect(mapStateToProps)(BroadcastNotification);
