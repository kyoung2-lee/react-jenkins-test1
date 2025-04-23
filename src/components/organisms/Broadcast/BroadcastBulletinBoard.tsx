import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Field, WrappedFieldProps } from "redux-form";
import styled from "styled-components";
import { Const } from "../../../lib/commonConst";
import * as validates from "../../../lib/validators";
import { RootState } from "../../../store/storeType";
import { storage } from "../../../lib/storage";
import EventListener from "../../atoms/EventListener";
import MultipleSelectBox from "../../atoms/MultipleSelectBox";
import PrimaryButton from "../../atoms/PrimaryButton";
import TextArea from "../../atoms/TextArea";
import TextInput from "../../atoms/TextInput";
import UploadFilesComponent, { UploadedFile } from "../../molecules/UploadFilesComponent";
import FlightLeg = Broadcast.Bb.FlightLeg;
// eslint-disable-next-line import/no-cycle
import {
  Col,
  createOption,
  DEFAULT_TEXTAREA_HEIGHT,
  Flex,
  Label,
  RightContent,
  Row,
  TEXTAREA_MIN_HEIGHT,
  TextAreaContainer,
  selector,
} from "./Broadcast";

interface OwnProps {
  isActive: boolean;
  bbFlightLeg: FlightLeg;
  onClickFlightLegField: () => void;
  onClickAddressDetailButton: () => void;
  bbAttachments: UploadedFile[];
  onUploadFiles: (uploadFiles: UploadedFile[]) => void;
  onRemoveFile: (index: number) => void;
  onClickExpiryDateField: () => void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const BroadcastBulletinBoard: React.FC<Props> = (props) => {
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
    categoryOption,
    commGrpOption,
    grpOption,
    jobOption,
    isFlightLegEnabled,
    bbFlightLeg,
    onClickFlightLegField,
    onClickAddressDetailButton,
    bbAttachments,
    onUploadFiles,
    onRemoveFile,
    onClickExpiryDateField,
    displayExpiryDate,
  } = props;

  const { isPc } = storage;

  return (
    <RightContent disabled={false} isPc={isPc} isActive={isActive} ref={contentRef}>
      <Row ref={otherInputsAreaRef}>
        <Row>
          <Flex>
            <Col width={450}>
              <Label>Category</Label>
              <Field
                name="BB.catCdList"
                options={categoryOption}
                component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
                validate={[validates.required, validates.unique]}
                maxValLength={CATEGORY_ITEM_MAX}
                spaceDelimiter={false}
              />
            </Col>
            <Col width={246}>
              <Label>Flight/LEG</Label>
              <Field
                name="BB.flightLeg"
                // eslint-disable-next-line react/no-unstable-nested-components
                component={(componentProps: WrappedFieldProps) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const { error, touched, submitFailed } = componentProps.meta;
                  const hasError = !!error && touched && submitFailed;
                  return (
                    <FlightLegField disabled={!isFlightLegEnabled} onClick={onClickFlightLegField} hasError={hasError}>
                      {getDisplayFlightLeg(bbFlightLeg)}
                    </FlightLegField>
                  );
                }}
                validate={isFlightLegEnabled ? [validates.required] : []}
              />
            </Col>
          </Flex>
        </Row>
        <Row>
          <Label>Communication Group</Label>
          <Flex>
            <Flex width={450}>
              <Field
                name="BB.commGrpIdList"
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
              name="BB.jobGrpIdList"
              options={grpOption}
              component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
              validate={[validates.unique]}
              maxValLength={JOB_GROUP_ITEM_MAX}
            />
          </Flex>
        </Row>
        <Row>
          <Label>Job Code</Label>
          <Flex>
            <Field
              name="BB.jobIdList"
              options={jobOption}
              component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
              validate={[validates.required, validates.unique]}
              maxValLength={JOB_CODE_ITEM_MAX}
            />
          </Flex>
        </Row>
        <Row>
          <Flex>
            <Col width={514}>
              <Label>Title</Label>
              <Field
                name="BB.bbTitle"
                autoCapitalize="off"
                component={TextInput as "input" & typeof TextInput}
                validate={[validates.required]}
                width={514}
                maxLength={300}
              />
            </Col>
            <Col width={182}>
              <Label>Expiry Date</Label>
              <Field
                name="BB.expiryDate"
                autoCapitalize="off"
                component={TextInput as "input" & typeof TextInput}
                width={182}
                maxLength={10}
                validate={[validates.required, validates.isExpiryDate]}
                showKeyboard={onClickExpiryDateField}
                displayValue={displayExpiryDate}
                isShadowOnFocus
              />
            </Col>
          </Flex>
        </Row>
      </Row>
      <Row>
        <TextAreaContainer isPc={isPc} height={textAreaHeight}>
          <Field
            name="BB.bbText"
            component={TextArea as "input" & typeof TextArea}
            maxLength={102400}
            width="100%"
            maxWidth="100%"
            minWidth="100%"
            validate={[validates.isOkUnlimitedTextByte]}
          />
        </TextAreaContainer>
      </Row>
      <Row marginBottom={0} ref={attachmentAreaRef}>
        <UploadFilesComponent channel="bb" uploadedFiles={bbAttachments} onUploadFiles={onUploadFiles} onRemoveFile={onRemoveFile} />
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

const FlightLegField = styled.div<{ disabled: boolean; hasError: boolean }>`
  background-color: ${(props) => (props.disabled ? "#EBEBE4" : "#FFF")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding: 0 8px 0 6px;
  border: 1px solid ${(props) => (props.hasError ? props.theme.color.border.ERROR : "#346181")};
  border-radius: 1px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const CATEGORY_ITEM_MAX = 3;
const COMMUNICATION_GROUP_ITEM_MAX = 4;
const JOB_GROUP_ITEM_MAX = 4;
const JOB_CODE_ITEM_MAX = 4;

const getDisplayFlightLeg = (flightLeg: FlightLeg): string => {
  if (flightLeg.orgDateLcl) {
    const orgDateLclDayjs = dayjs(flightLeg.orgDateLcl);
    const depApoCd = flightLeg.lstDepApoCd || "";
    const arrApoCd = flightLeg.lstArrApoCd || "";
    if (orgDateLclDayjs.isValid() && flightLeg.alCd) {
      return `${flightLeg.alCd}${flightLeg.fltNo}/${orgDateLclDayjs.format("DDMMM").toUpperCase()} ${depApoCd}-${arrApoCd}`;
    }
    if (orgDateLclDayjs.isValid() && flightLeg.casFltNo) {
      return `${flightLeg.casFltNo}/${orgDateLclDayjs.format("DDMMM").toUpperCase()} ${depApoCd}-${arrApoCd}`;
    }
    return "";
  }
  return "";
};

const mapStateToProps = (state: RootState) => {
  const {
    account: {
      jobAuth: { user },
      master: { cdCtrlDtls, commGrps, grps, jobs },
    },
    broadcast,
  } = state;
  const { isFlightLegEnabled } = broadcast.BulletinBoard;

  const categoryOption = cdCtrlDtls
    .filter((cdCtrlDtl) => cdCtrlDtl.cdCls === Const.CodeClass.BULLETIN_BOARD_CATEGORY)
    .sort((code1, code2) => code1.num1 - code2.num1)
    .map((cdCtrlDtl) => createOption(cdCtrlDtl.cdCat1, cdCtrlDtl.txt1, false, cdCtrlDtl.cd1));

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
  const expiryDate = selector(state, "BB.expiryDate") as string;
  const displayExpiryDate = expiryDate.replace(/-/g, "/");

  return {
    categoryOption,
    commGrpOption,
    isFlightLegEnabled,
    grpOption,
    jobOption,
    displayExpiryDate,
  };
};

export default connect(mapStateToProps)(BroadcastBulletinBoard);
