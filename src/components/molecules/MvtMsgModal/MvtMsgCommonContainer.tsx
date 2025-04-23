import React, { useMemo } from "react";
// import styled from "styled-components";
import { Field, Normalizer } from "redux-form";
import { useAppSelector } from "../../../store/hooks";
import { getPriorities, toUpperCase } from "../../../lib/commonUtil";
import { required, isOkTtyAddresses } from "../../../lib/validators";
import { isDtg, isOkTty, isOkTtyAddress } from "../../../lib/validators/mvtMsgValidator";
import { FormValue } from "../../../reducers/mvtMsgModal";
import SelectBox from "../../atoms/SelectBox";
import TextInput from "../../atoms/TextInput";
import { SuggestSelectInputBox } from "../SuggestSelectInputBox";
import MultipleCreatableInput from "../../atoms/MultipleCreatableInput";
// eslint-disable-next-line import/no-cycle
import { Col, Content, Flex, Label, Row } from "../../organisms/MvtMsgModal";

type Props = {
  formName: string;
  formValues: FormValue;
  change: (field: string, value: string) => void;
};

const MvtMsgCommonContainer: React.FC<Props> = (props) => {
  const { formName, formValues, change } = props;
  const cdCtrlDtls = useAppSelector((state) => state.account.master.cdCtrlDtls);
  const mvtMsgRmks = useAppSelector((state) => state.account.master.mvtMsgRmks);

  /** 入力項目の活性状態を制御する */
  const isMsgDisabled = useMemo(() => {
    const {
      mvtMsgRadioButton,
      depInfo: { cnlCheckBox: depCnlCheckbox },
      arrInfo: { cnlCheckBox: arrCnlCheckbox },
      gtbInfo: { cnlCheckBox: gtbCnlCheckbox },
    } = formValues;
    return mvtMsgRadioButton === "" || depCnlCheckbox || arrCnlCheckbox || gtbCnlCheckbox;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues?.mvtMsgRadioButton, formValues?.depInfo.cnlCheckBox, formValues?.arrInfo.cnlCheckBox, formValues?.gtbInfo.cnlCheckBox]);

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e) {
      change(e.target.name, toUpperCase(e.target.value));
    }
  };

  const handleOnBlurRemarks = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e) {
      change("msgInfo.remarks", toUpperCase(e.target.value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      change(target.name, toUpperCase(target.value));
    }
  };

  const handleKeyPressRemarks = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      change("msgInfo.remarks", toUpperCase(target.value));
    }
  };

  const handleKeyPress = (values: unknown[]) => values.map((value) => toUpperCase(value as string));

  const filterTtyAddress = (value: string) => {
    const replaced = value.replace(/[^a-zA-Z0-9./()-]/g, "");
    return replaced.slice(0, 7);
  };

  const normalizeTime: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    return onlyNums;
  };

  const normalizeRemarks: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^a-zA-Z0-9\s./()-]/g, "");
    return onlyNums;
  };

  /**
   * remarks一覧を取得する
   */
  const getRemarks = (mvtMsgRmk: MasterApi.MvtMsgRmk[]): { label: string; value: string }[] => {
    const sortedRmks = mvtMsgRmk.slice().sort((a, b) => a.dispSeq - b.dispSeq);
    const rmks = [];
    for (let i = 0; i < sortedRmks.length; i++) {
      rmks.push({ label: sortedRmks[i].mvtMsgRmks, value: sortedRmks[i].mvtMsgRmks });
    }
    return rmks;
  };

  return (
    <Content isMsg>
      <Row marginBottom={4}>
        <Flex>
          <Col width={60}>
            <Label disabled={isMsgDisabled}>Priority</Label>
            <Field
              name="msgInfo.priority"
              component={SelectBox as "select" & typeof SelectBox}
              validate={[required]}
              options={getPriorities(cdCtrlDtls)}
              width={60}
              height={40}
              hasBlank
              fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
              fontWeight="normal"
              fontSize={18}
              disabled={isMsgDisabled}
            />
          </Col>
          <Col width={85}>
            <Label disabled={isMsgDisabled}>D.T.G.(Z)</Label>
            <Field
              name="msgInfo.dtg"
              component={TextInput as "input" & typeof TextInput}
              placeholder="ddhhmm"
              width={85}
              height={40}
              maxLength={6}
              type="number"
              normalize={normalizeTime}
              validate={isMsgDisabled ? undefined : [required, isDtg]}
              fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
              fontWeight="normal"
              fontSize={18}
              disabled={isMsgDisabled}
              onChange={undefined}
            />
          </Col>
          <Col width={96}>
            <Label disabled={isMsgDisabled}>Originator</Label>
            <Field
              name="msgInfo.originator"
              component={TextInput as "input" & typeof TextInput}
              width={96}
              height={40}
              maxLength={7}
              componentOnBlur={handleOnBlur}
              onKeyDown={handleKeyDown}
              validate={isMsgDisabled ? undefined : [isOkTtyAddress, required]}
              fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
              fontWeight="normal"
              fontSize={18}
              disabled={isMsgDisabled}
            />
          </Col>
          <Col width={676}>
            <Label disabled={isMsgDisabled}>Remarks</Label>
            <SuggestSelectInputBox
              fieldName="msgInfo.remarks"
              fontFamily='Consolas, "Courier New", Courier, Monaco, monospace'
              fontSize={18}
              fontWeight="normal"
              formName={formName}
              height={40}
              maxLength={58}
              options={getRemarks(mvtMsgRmks)}
              validate={isMsgDisabled ? undefined : [isOkTty]}
              value={formValues.msgInfo.remarks}
              width={676}
              disabled={isMsgDisabled}
              normalize={normalizeRemarks}
              componentOnBlur={handleOnBlurRemarks}
              onKeyPress={handleKeyPressRemarks}
            />
          </Col>
        </Flex>
      </Row>
      <Row>
        <Flex>
          <Col>
            <Label disabled={isMsgDisabled}>TTY Address</Label>
            <Field
              name="msgInfo.ttyAddressList"
              component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
              validate={isMsgDisabled ? undefined : [isOkTtyAddresses]}
              filterValue={filterTtyAddress}
              formatValues={handleKeyPress}
              maxHeight={100}
              maxValLength={80}
              fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
              fontWeight="normal"
              fontSize={17}
              disabled={isMsgDisabled}
            />
          </Col>
        </Flex>
      </Row>
    </Content>
  );
};

export default MvtMsgCommonContainer;
