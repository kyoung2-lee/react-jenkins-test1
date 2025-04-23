import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { Field, formValueSelector, InjectedFormProps, reduxForm, FormErrors, getFormValues, getFormSyncErrors } from "redux-form";
import styled from "styled-components";
import dayjs from "dayjs";
import uniq from "lodash.uniq";

import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/storeType";
import * as issueSecurityExports from "../../reducers/issueSecurity";
import {
  getAirportIssue,
  setCheckHasDifference,
  getMailAddress,
  getTtyAddress,
  submitFailedField,
  showMessage,
  saveTemplate as saveTemplateAction,
  updateSendAirportIssue as updateSendAirportIssueAction,
  hideEmailModal,
  hideTtyModal,
} from "../../reducers/issueSecurity";
import { Master, reloadMaster } from "../../reducers/account";
import { HeaderInfo } from "../../reducers/common";
import issueDicIcomSvg from "../../assets/images/icon/icon-issue_dic.svg";
import issueRwyIconSvg from "../../assets/images/icon/icon-issue_rwy.svg";
import issueSecIconSvg from "../../assets/images/icon/icon-issue_sec.svg";
import issueSspIconSvg from "../../assets/images/icon/icon-issue_ssp.svg";
import issueSwwIconSvg from "../../assets/images/icon/icon-issue_sww.svg";
import issueTswIconSvg from "../../assets/images/icon/icon-issue_tsw.svg";
import * as validates from "../../lib/validators";
import * as myValidates from "../../lib/validators/issueSecurityValidator";
import { getPriorities, toUpperCase, convertLineFeedCodeToCRLF, removeTtyComment } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import { SoalaMessage } from "../../lib/soalaMessages";
import { NotificationCreator } from "../../lib/notifications";
import PrimaryButton from "../atoms/PrimaryButton";
import RadioButton from "../atoms/RadioButton";
import SelectBox from "../atoms/SelectBox";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import ToggleInput from "../atoms/ToggleInput";
import CloseButton from "../atoms/CloseButton";
import UploadFilesComponent, { UploadedFile } from "../molecules/UploadFilesComponent";
import MultipleCreatableInput from "../atoms/MultipleCreatableInput";
import MultipleSelectBox from "../atoms/MultipleSelectBox";

const MAIL_ADDRESS_GROUP_ITEM_MAX = 4;
const MAIL_ADDITIONAL_ADDRESS_ITEM_MAX = 8;
const TTY_ADDRESS_GROUP_ITEM_MAX = 4;
const TTY_ADDITIONAL_ADDRESS_ITEM_MAX = 100;
const FORM_NAME = "issueSecurity";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _issueSecurityDefault, slice: _issueSecuritySlice, ...issueSecurityActions } = issueSecurityExports;

type Props = {
  master: Master;
  issuCdValue: string;
  emailFileValue: UploadedFile[];
  tabValue: "e-mail" | "TTY";
  mailFlgValue: boolean;
  ttyFlgValue: boolean;
  issuDtlCdValue: string;
  jobAuthUser: JobAuthApi.User;
  issueSecurity: issueSecurityExports.IssueSecurityState;
  formValues: IssueSecurityFormParams;
  formSyncErrors: FormErrors<IssueSecurityFormParams>;
  headerInfo: HeaderInfo;
};

const IssueSecurity: React.FC<Props & InjectedFormProps<IssueSecurityFormParams, Props>> = (props) => {
  const dispatch = useAppDispatch();
  const [isForceErrorMailAddrGrpList, setIsForceErrorMailAddrGrpList] = useState(false);
  const [isForceErrorTtyAddrGrpList, setIsForceErrorTtyAddrGrpList] = useState(false);

  useEffect(() => {
    const componentDidMount = async () => {
      await dispatch(
        reloadMaster({
          user: props.jobAuthUser,
          // eslint-disable-next-line no-bitwise
          masterGetType: Const.MasterGetType.COMM_GRP | Const.MasterGetType.ADGRP,
        })
      );
      void dispatch(getAirportIssue({ apoCd: props.jobAuthUser.myApoCd }));
      dispatch(setCheckHasDifference({ data: setCheckHasDifferenceData }));
      change("mailCCSenderAddressChecked", storage.airPortIssueEmailCCSenderAddressChecked);
      change("ttyCCSenderAddressChecked", storage.airPortIssueTtyCCSenderAddressChecked);
    };
    void componentDidMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { apoTimeLcl } = props.headerInfo;
    props.change("issuTime", apoTimeLcl ? dayjs(apoTimeLcl).format("HHmm") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.headerInfo.apoTimeLcl]);

  const setCheckHasDifferenceData = () => {
    const { issuCdValue, issuDtlCdValue } = props;
    const currentParams = createAirportIssueRequestParams(false);
    const initialParams = getTemplate(issuCdValue, issuDtlCdValue);
    return checkHasDifference(currentParams, initialParams);
  };

  const openEmailModal = () => {
    const { formValues } = props;
    const targetFields = ["mailAddrList", "mailAddrGrpList"];
    const hasError = showValidationError(targetFields, true);
    if (!hasError) {
      const mailAddrGrpIdList = formValues.mailAddrGrpList || [];
      const mailAddrList = getMailAddrList(true);
      NotificationCreator.removeAll({ dispatch });
      void dispatch(getMailAddress({ params: { mailAddrGrpIdList, mailAddrList } }));
    }
  };

  /**
   * 対象のFieldsのエラーをメッセージIDの重複を省いてreapopを表示する
   * また、エラーがあるかどうかをbooleanで返す
   */
  const showValidationError = (targetFields: string[], isTamplate: boolean) => {
    const { formSyncErrors, formValues } = props;
    const targetErrorFields: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageObject: { messageFunction: any; items: string[] }[] = [];
    const mailFlg = formValues.mailFlg || false;
    const ttyFlg = formValues.ttyFlg || false;
    for (let i = 0; i < targetFields.length; i++) {
      const fildName = targetFields[i];
      const messageFunction = formSyncErrors[fildName];
      if (messageFunction) {
        let item = "";
        if (fildName.match(/^mail.*|^orgnMail.*|^email.*/)) {
          if (!mailFlg) continue;
          item = "email";
        } else if (fildName.match(/^tty.*|^orgnTty.*/)) {
          if (!ttyFlg) continue;
          item = "TTY";
        }
        if (
          isTamplate &&
          fildName.match(/^mailAddr.*|^ttyAddr.*/) &&
          !(Array.isArray(formValues[fildName]) && (formValues[fildName] as unknown[]).length > 0)
        ) {
          continue;
        }
        targetErrorFields.push(fildName);
        // ワーニングの重複確認
        const hasDate = messageObject.some((target, j) => {
          if (target.messageFunction === messageFunction) {
            // itemの重複確認
            const hasSameType = messageObject[j].items.some((targetType) => targetType === item);
            if (!hasSameType) {
              if (item === "email") {
                messageObject[j].items.unshift(item);
              } else if (item === "TTY") {
                messageObject[j].items.push(item);
              }
            }
            return true;
          }
          return false;
        });
        if (!hasDate) {
          messageObject.push({ messageFunction, items: [item] });
        }
      }
    }
    // submitエラーとして対象のFieldをsubmitFailed状態にする(赤くする)
    void dispatch(submitFailedField({ fields: targetErrorFields }));
    for (let i = 0; i < messageObject.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { messageFunction, items } = messageObject[i];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      void dispatch(showMessage({ message: messageFunction({ items }) }));
    }
    const hasError = !!messageObject.length;
    return hasError;
  };

  const openTtyModal = () => {
    const { formValues } = props;
    const targetFields = ["ttyAddrList", "ttyAddrGrpList"];
    const hasError = showValidationError(targetFields, true);
    if (!hasError) {
      const ttyAddrGrpIdList = formValues.ttyAddrGrpList || [];
      const ttyAddrList = getTtyAddrList(true);

      NotificationCreator.removeAll({ dispatch });
      void dispatch(getTtyAddress({ params: { ttyAddrGrpIdList, ttyAddrList } }));
    }
  };

  const handleTab = (tab: "e-mail" | "TTY") => {
    props.change("tab", tab);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (values: any[]) => values.map((value) => toUpperCase(value as string));

  /** IssuCd変更時、修正中の場合内容破棄確認をして入力内容を初期化 */
  const onChangeIssuCd = (prevIssuCdValue: string) => {
    if (prevIssuCdValue) {
      const currentParams = createAirportIssueRequestParams(false);
      const initialParams = getTemplate(prevIssuCdValue, props.issuDtlCdValue);
      const hasDifference = checkHasDifference(currentParams, initialParams);
      if (hasDifference) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40003C({
              onYesButton: () => {
                resetAllIssuDtlCd();
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useTemplate();
              },
              onNoButton: () => props.change("issuCd", prevIssuCdValue),
            }),
          })
        );
      } else {
        // 差分がない場合(未修正)
        resetAllIssuDtlCd();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTemplate();
      }
    } else {
      // prevIssuCdValueがない場合(初回)
      resetAllIssuDtlCd();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useTemplate();
    }
  };

  const resetAllIssuDtlCd = () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change } = props;
    change("SWW", "");
    change("TSW", "");
    change("DIC", "");
    change("RCL", "");
    change("SSP", "");
    change("SEC", "");
  };

  /** IssuDtlCd変更時、修正中の場合内容破棄確認をして選択したIssuDtlCdのテンプレートを利用 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeIssuDtlCd = (e: React.ChangeEvent<any> | undefined, prevIssuDtlCd: string) => {
    if (e) {
      const { issuCdValue } = props;
      if (prevIssuDtlCd) {
        const currentParams = createAirportIssueRequestParams(false);
        const initialParams = getTemplate(issuCdValue, prevIssuDtlCd);
        const hasDifference = checkHasDifference(currentParams, initialParams);
        if (hasDifference) {
          void dispatch(
            showMessage({
              message: SoalaMessage.M40003C({
                // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unsafe-member-access
                onYesButton: () => useTemplate(e.target.name as string, e.target.value as string),
                onNoButton: () => props.change(issuCdValue, prevIssuDtlCd),
              }),
            })
          );
        } else {
          // 差分がない場合(未修正)
          // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unsafe-member-access
          useTemplate(e.target.name as string, e.target.value as string);
        }
      } else {
        // prevIssuDtlCdがない場合(初回)
        // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unsafe-member-access
        useTemplate(e.target.name as string, e.target.value as string);
      }
    }
  };

  const onChangeMailAddrGrpList = () => {
    setIsForceErrorMailAddrGrpList(false);
  };

  const onChangeTtyAddrGrpList = () => {
    setIsForceErrorTtyAddrGrpList(false);
  };

  const useTemplate = (issuCd?: string, issuDtlCd?: string) => {
    useTemplateEmail(issuCd, issuDtlCd);
    useTemplateTty(issuCd, issuDtlCd);
  };

  const useTemplateEmail = (issuCd?: string, issuDtlCd?: string, isExclusionSendType?: boolean) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change } = props;
    const template = getTemplate(issuCd, issuDtlCd);
    setIsForceErrorMailAddrGrpList(false);
    change("mailTitl", template.mailTitl || "");
    change("mailText", template.mailText || "");
    change("emailFile", []);

    // Swich切り替えの場合は、mailFlgとttyFlgをテンプレートで初期化しない
    if (!isExclusionSendType) {
      change("mailFlg", !!template.mailFlg || false);
    }

    const selectMailAddrGrpList = props.issueSecurity.airportIssue.mailAddrGrpList;
    const mailAddrGrpList = uniq(
      (template.mailAddrGrpList || [])
        .map((mailAddrGrp) =>
          mailAddrGrp !== undefined && selectMailAddrGrpList.some((o) => o.value === String(mailAddrGrp)) ? `${mailAddrGrp}` : null
        )
        .filter((mailAddrGrp) => !!mailAddrGrp)
    );
    const mailAddrList = uniq((template.mailAddrList || []).filter((mailAddr) => !!mailAddr));
    change("mailAddrGrpList", mailAddrGrpList);
    change("mailAddrList", mailAddrList);
  };

  const useTemplateTty = (issuCd?: string, issuDtlCd?: string, isExclusionSendType?: boolean) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {
      change,
      jobAuthUser: { ttyAddr },
    } = props;
    const template = getTemplate(issuCd, issuDtlCd);

    // Swich切り替えの場合は、mailFlgとttyFlgをテンプレートで初期化しない
    if (!isExclusionSendType) {
      change("ttyFlg", !!template.ttyFlg || false);
    }

    setIsForceErrorTtyAddrGrpList(false);
    change("ttyText", template.ttyText || "");
    const selectPriorities = getPriorities(props.master.cdCtrlDtls);
    change("ttyPriorityCd", selectPriorities.some((o) => o.value === template.ttyPriorityCd) ? template.ttyPriorityCd : "");
    change("orgnTtyAddr", ttyAddr);

    const selectTtyAddrGrpList = props.issueSecurity.airportIssue.ttyAddrGrpList;
    const ttyAddrGrpList = uniq(
      (template.ttyAddrGrpList || [])
        .map((ttyAddrGrp) =>
          ttyAddrGrp !== undefined && selectTtyAddrGrpList.some((o) => o.value === String(ttyAddrGrp)) ? `${ttyAddrGrp}` : null
        )
        .filter((ttyAddrGrp) => !!ttyAddrGrp)
    );
    const ttyAddrList = uniq((template.ttyAddrList || []).filter((addr) => !!addr));
    change("ttyAddrGrpList", ttyAddrGrpList);
    change("ttyAddrList", ttyAddrList);
  };

  const saveTemplate = () => {
    const { formValues } = props;
    const allFields = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const formKey of Object.keys(formValues)) {
      allFields.push(formKey);
    }
    const targetFields = allFields.filter((field) => field !== "issuTime");
    const hasError = showValidationError(targetFields, true);
    if (!hasError) {
      const mailFlg = formValues.mailFlg || false;
      const ttyFlg = formValues.ttyFlg || false;
      const issueType = mailFlg && !ttyFlg ? '"e-mail"' : !mailFlg && ttyFlg ? '"TTY"' : "";
      const palams: AirportIssue.IssuTemplate = {
        apoCd: props.jobAuthUser.myApoCd,
        issuCd: formValues.issuCd || "",
        issuDtlCd: props.issuDtlCdValue,
        mailFlg,
        ttyFlg,
        mailAddrGrpList: mailFlg ? formValues.mailAddrGrpList || [] : undefined,
        mailAddrList: mailFlg ? formValues.mailAddrList || [] : undefined,
        mailTitl: mailFlg ? formValues.mailTitl : undefined,
        mailText: mailFlg ? formValues.mailText : undefined,
        ttyAddrGrpList: ttyFlg ? formValues.ttyAddrGrpList || [] : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ttyAddrList: ttyFlg ? formValues.ttyAddrList || [] : undefined,
        ttyPriorityCd: ttyFlg ? formValues.ttyPriorityCd : undefined,
        ttyText: ttyFlg ? formValues.ttyText : undefined,
      };
      NotificationCreator.removeAll({ dispatch });
      void dispatch(
        showMessage({
          message: SoalaMessage.M30004C({
            issueType,
            onYesButton: () => {
              void dispatch(saveTemplateAction(palams));
            },
          }),
        })
      );
    }
  };

  const getIssuMailFileList = (emailFiles?: UploadedFile[]) => {
    const issuMailFileList: AirportIssue.IssuMailFileList[] = [];
    if (emailFiles) {
      for (let i = 0; i < emailFiles.length; i++) {
        issuMailFileList.push({
          issuMailFileName: emailFiles[i].fileName,
          issuMailFile: emailFiles[i].object,
        });
      }
      return issuMailFileList.length ? issuMailFileList : undefined;
    }
    return undefined;
  };

  const updateSendAirportIssue = () => {
    const { formValues, formSyncErrors } = props;
    const allFields = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const formKey of Object.keys(formValues)) {
      allFields.push(formKey);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const formKey of Object.keys(formSyncErrors)) {
      allFields.push(formKey);
    }
    const hasError = showValidationError(allFields, false);
    if (!hasError) {
      const { jobAuthUser, issueSecurity } = props;
      if (formValues.issuCd && formValues.issuTime) {
        const palams: AirportIssue.RequestPost = createAirportIssueRequestParams(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        palams.issuMailFileList = getIssuMailFileList(formValues.emailFile);
        const lastLiqest = issueSecurity.lastUpdateSendAirportIssueRequest;
        const hasChange = checkHasDifference(palams, lastLiqest);
        NotificationCreator.removeAll({ dispatch });
        const onYesButton = async () => {
          const { mailFlg, ttyFlg } = palams;
          if (mailFlg) {
            const mailAddrGrpIdList = palams.mailAddrGrpList || [];
            const mailAddrList = palams.mailAddrList || [];
            setIsForceErrorMailAddrGrpList(false);
            const res = await dispatch(getMailAddress({ params: { mailAddrGrpIdList, mailAddrList }, showModal: false })).unwrap();
            if (res && res.mailAddrList) {
              if (res.mailAddrList.length === 0) {
                setIsForceErrorMailAddrGrpList(true);
                props.touch(FORM_NAME, "mailAddrGrpList");
                void dispatch(showMessage({ message: SoalaMessage.M50034C({}) }));
                return;
              }
            } else {
              return;
            }
          }
          if (ttyFlg) {
            const ttyAddrGrpIdList = palams.ttyAddrGrpList || [];
            const ttyAddrList = palams.ttyAddrList || [];
            setIsForceErrorTtyAddrGrpList(false);
            const res = await dispatch(getTtyAddress({ params: { ttyAddrGrpIdList, ttyAddrList }, showModal: false })).unwrap();
            if (res && res.ttyAddrList) {
              if (res.ttyAddrList.length === 0) {
                setIsForceErrorTtyAddrGrpList(true);
                props.touch(FORM_NAME, "ttyAddrGrpList");
                void dispatch(showMessage({ message: SoalaMessage.M50034C({}) }));
                return;
              }
            } else {
              return;
            }
          }
          void dispatch(updateSendAirportIssueAction({ params: palams, apoCd: jobAuthUser.myApoCd }));
        };
        if (hasChange) {
          void dispatch(
            showMessage({
              message: SoalaMessage.M30005C({
                onYesButton: () => {
                  void onYesButton();
                },
              }),
            })
          );
        } else {
          void dispatch(
            showMessage({
              message: SoalaMessage.M30006C({
                onYesButton: () => {
                  void onYesButton();
                },
              }),
            })
          );
        }
      }
    }
  };

  /** リクエストパラメーターの形式のオブジェクトの差分の有無を確認 */
  const checkHasDifference = (
    currentParams?: AirportIssue.RequestPost,
    initialParams?: AirportIssue.RequestPost,
    exclusions: string[] = []
  ) => {
    if (!currentParams && !initialParams) {
      // 比較対象のどちらもない場合、差分なし
      return false;
    }
    if (props.emailFileValue.length) {
      // 添付ファイルがある場合、差分あり
      return true;
    }
    if (currentParams && initialParams) {
      let hasChange = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const palamKey of Object.keys(currentParams)) {
        const isExclusions = exclusions.some((exclusion) => exclusion === palamKey);
        if (isExclusions) {
          // 対象外(isExclusion)のものは差分が確認をしない
        } else if (palamKey === "issuCd" || palamKey === "issuDtlCd" || palamKey === "issuTime") {
          // issuCd issuDtlCd issuTimeの差分は確認しない
        } else if (toString.call(currentParams[palamKey]) === "[object Array]") {
          // 配列の場合、for分で中の差分の確認
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          for (let i = 0; i < currentParams[palamKey].length; i++) {
            if (
              !initialParams[palamKey] ||
              (currentParams[palamKey] &&
                initialParams[palamKey] &&
                // eslint-disable-next-line eqeqeq
                (currentParams[palamKey] as unknown[])[i] != (initialParams[palamKey] as unknown[])[i])
            ) {
              hasChange = true;
              break;
            }
          }
        } else if (
          currentParams[palamKey] === undefined &&
          initialParams[palamKey] &&
          (initialParams[palamKey] as unknown[]).length === 0
        ) {
          // 空の配列とundefinedは同じと扱い、差分はないものとする
          // eslint-disable-next-line eqeqeq
        } else if (currentParams[palamKey] != initialParams[palamKey]) {
          // undefined と nullを同じとして扱う
          // 差分を確認
          hasChange = true;
        }
      }
      return hasChange;
    }
    // currentParamsとinitialParamsのどちらかのみ存在する場合、差分あり
    return true;
  };

  /** テンプレートをAirportIssueのリクエストパラメーター形式で取得 */
  const getTemplate = (issuCd?: string, issuDtlCd?: string): AirportIssue.RequestPost => {
    const {
      formValues,
      jobAuthUser: { myApoCd, mailAddr, ttyAddr },
      issueSecurity: { airportIssue },
    } = props;
    let issuTemplate: AirportIssue.IssuTemplate | undefined;
    if (airportIssue && airportIssue.issuTemplateList) {
      issuTemplate =
        airportIssue.issuTemplateList.find((template) => template.issuCd === issuCd && template.issuDtlCd === issuDtlCd) || undefined;
    }
    return {
      apoCd: myApoCd,
      issuCd,
      issuDtlCd,
      issuTime: formValues && formValues.issuTime ? formValues.issuTime : "",
      mailFlg: issuTemplate && issuTemplate.mailFlg ? issuTemplate.mailFlg : false,
      ttyFlg: issuTemplate && issuTemplate.ttyFlg ? issuTemplate.ttyFlg : false,
      mailAddrGrpList: issuTemplate && issuTemplate.mailAddrGrpList ? issuTemplate.mailAddrGrpList : undefined,
      mailAddrList: issuTemplate && issuTemplate.mailAddrList ? issuTemplate.mailAddrList : undefined,
      orgnMailAddr: mailAddr,
      mailTitl: issuTemplate && issuTemplate.mailTitl ? issuTemplate.mailTitl : undefined,
      mailText: issuTemplate && issuTemplate.mailText ? issuTemplate.mailText : undefined,
      issuMailFileList: undefined,
      ttyAddrGrpList: issuTemplate && issuTemplate.ttyAddrGrpList ? issuTemplate.ttyAddrGrpList : undefined,
      ttyAddrList: issuTemplate && issuTemplate.ttyAddrList ? issuTemplate.ttyAddrList : undefined,
      ttyPriorityCd: issuTemplate && (issuTemplate.ttyPriorityCd || issuTemplate.ttyPriorityCd === "") ? issuTemplate.ttyPriorityCd : "QU",
      orgnTtyAddr: ttyAddr,
      ttyText: issuTemplate && issuTemplate.ttyText ? issuTemplate.ttyText : undefined,
    };
  };

  const createAirportIssueRequestParams = (ccIncluded: boolean): AirportIssue.RequestPost => {
    const { formValues } = props;
    return {
      apoCd: props.jobAuthUser.myApoCd,
      issuCd: formValues.issuCd || "",
      issuDtlCd: props.issuDtlCdValue,
      issuTime: formValues.issuTime || "",
      mailFlg: formValues.mailFlg || false,
      ttyFlg: formValues.ttyFlg || false,
      mailAddrGrpList: formValues.mailAddrGrpList || [],
      mailAddrList: getMailAddrList(ccIncluded),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      orgnMailAddr: formValues.orgnMailAddr,
      mailTitl: formValues.mailTitl,
      mailText: formValues.mailText,
      issuMailFileList: undefined,
      ttyAddrGrpList: formValues.ttyAddrGrpList || [],
      ttyAddrList: getTtyAddrList(ccIncluded),
      ttyPriorityCd: formValues.ttyPriorityCd,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      orgnTtyAddr: formValues.orgnTtyAddr,
      ttyText: removeTtyComment(convertLineFeedCodeToCRLF(formValues.ttyText)),
    };
  };

  const confirmationSwich = (fieldName: string) => {
    const isEmail = fieldName === "mailFlg";
    const swichFlg = isEmail ? props.mailFlgValue : props.ttyFlgValue;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change } = props;
    const changeSwitch = () => {
      change(fieldName, !swichFlg);
      const { issuCdValue, issuDtlCdValue } = props;
      if (isEmail) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTemplateEmail(issuCdValue, issuDtlCdValue, true);
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTemplateTty(issuCdValue, issuDtlCdValue, true);
      }
    };

    if (swichFlg) {
      const { issuCdValue, issuDtlCdValue } = props;
      const currentParams = createAirportIssueRequestParams(false);
      const initialParams = getTemplate(issuCdValue, issuDtlCdValue);
      const exclusions = ["mailFlg", "ttyFlg"];
      Array.prototype.push.apply(
        exclusions,
        isEmail
          ? ["ttyAddrGrpList", "ttyAddrList", "ttyPriorityCd", "orgnTtyAddr", "ttyText"] // メールの場合は、TTYに関する項目の修正中確認を除外
          : ["mailAddrGrpList", "mailAddrList", "mailTitl", "mailText", "issuMailFileList"] // TTYの場合は、メールに関する項目の修正中確認を除外
      );
      const hasDifference = checkHasDifference(currentParams, initialParams, exclusions);
      if (hasDifference) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40004C({
              onYesButton: changeSwitch,
            }),
          })
        );
      } else {
        changeSwitch();
      }
    } else {
      changeSwitch();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shipToUpperCase = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change(e.target.name, toUpperCase(e.target.value));
    }
  };

  const handleHideEmailModal = () => dispatch(hideEmailModal());

  const handleHideTtyModal = () => dispatch(hideTtyModal());

  const getMailAddrList = (ccIncluded: boolean) => {
    const {
      jobAuthUser: { mailAddr },
      formValues: { mailAddrList, mailCCSenderAddressChecked },
    } = props;
    const to = mailAddrList ?? [];
    const cc = mailCCSenderAddressChecked ? [mailAddr] : [];
    return ccIncluded ? [...new Set([...cc, ...to])] : to;
  };

  const getTtyAddrList = (ccIncluded: boolean) => {
    const {
      jobAuthUser: { ttyAddr },
      formValues: { ttyAddrList, ttyCCSenderAddressChecked },
    } = props;
    const to = ttyAddrList ?? [];
    const cc = ttyCCSenderAddressChecked ? [ttyAddr] : [];
    return ccIncluded ? [...new Set([...cc, ...to])] : to;
  };

  const onChangeMailCcSenderAddress = () => {
    const { mailCCSenderAddressChecked } = props.formValues;
    storage.airPortIssueEmailCCSenderAddressChecked = !mailCCSenderAddressChecked;
  };

  const onChangeTtyCcSenderAddress = () => {
    const { ttyCCSenderAddressChecked } = props.formValues;
    storage.airPortIssueTtyCCSenderAddressChecked = !ttyCCSenderAddressChecked;
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    master,
    issuCdValue,
    emailFileValue,
    change,
    tabValue,
    mailFlgValue,
    ttyFlgValue,
    issueSecurity,
    issuDtlCdValue,
  } = props;
  const { isEmailModalActive, isTtyModalActive, mailAddrList, ttyAddrList, airportIssue } = issueSecurity;
  const { mailAddrGrpList, ttyAddrGrpList } = airportIssue;

  return (
    <Wrapper>
      <Form isPc={storage.isPc}>
        <Left>
          <ListHeader>Issue</ListHeader>
          <ListContainer className="issuCdListContainer">
            <List>
              <Field
                name="issuCd"
                id="issuCdSWW"
                component={RadioButton}
                type="radio"
                value="SWW"
                onChange={() => onChangeIssuCd(props.issuCdValue)}
              />
              <label htmlFor="issuCdSWW">Strong Wind</label>
              <IssueSwwIcon />
            </List>
            <List>
              <Field
                name="issuCd"
                id="issuCdTSW"
                component={RadioButton}
                type="radio"
                value="TSW"
                onChange={() => onChangeIssuCd(props.issuCdValue)}
              />
              <label htmlFor="issuCdTSW">Thunder Storm</label>
              <IssueTswIcon />
            </List>
            <List>
              <Field
                name="issuCd"
                id="issuCdDIC"
                component={RadioButton}
                type="radio"
                value="DIC"
                onChange={() => onChangeIssuCd(props.issuCdValue)}
              />
              <label htmlFor="issuCdDIC">De-Icing Only</label>
              <IssueDicIcom />
            </List>
            <List>
              <Field
                name="issuCd"
                id="issuCdRCL"
                component={RadioButton}
                type="radio"
                value="RCL"
                onChange={() => onChangeIssuCd(props.issuCdValue)}
              />
              <label htmlFor="issuCdRCL">Runway Close</label>
              <IssueRwyIcon />
            </List>
            <List>
              <Field
                name="issuCd"
                id="issuCdSSP"
                component={RadioButton}
                type="radio"
                value="SSP"
                onChange={() => onChangeIssuCd(props.issuCdValue)}
              />
              <label htmlFor="issuCdSSP">LVP/LVPD</label>
              <IssueSspIcon />
            </List>
            <List>
              <Field
                name="issuCd"
                id="issuCdSEC"
                component={RadioButton}
                type="radio"
                value="SEC"
                onChange={() => onChangeIssuCd(props.issuCdValue)}
              />
              <label htmlFor="issuCdSEC">Security Level</label>
              <IssueSecIcon />
            </List>
          </ListContainer>
          <ListContainer style={{ flex: 1, overflow: "auto" }}>
            {issuCdValue === "SWW" && (
              <SubList>
                <List>
                  <Field
                    name="SWW"
                    id="WAR"
                    component={RadioButton}
                    type="radio"
                    value="WAR"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="WAR">Warning</label>
                </List>
                <List>
                  <Field
                    name="SWW"
                    id="CD1"
                    component={RadioButton}
                    type="radio"
                    value="CD1"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CD1">Condition 1</label>
                </List>
                <List>
                  <Field
                    name="SWW"
                    id="CD2"
                    component={RadioButton}
                    type="radio"
                    value="CD2"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CD2">Condition 2</label>
                </List>
                <List>
                  <Field
                    name="SWW"
                    id="CD3"
                    component={RadioButton}
                    type="radio"
                    value="CD3"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CD3">Condition 3</label>
                </List>
                <List>
                  <Field
                    name="SWW"
                    id="CNL"
                    component={RadioButton}
                    type="radio"
                    value="CNL"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CNL">CNL</label>
                </List>
              </SubList>
            )}
            {issuCdValue === "TSW" && (
              <SubList>
                <List>
                  <Field
                    name="TSW"
                    id="WAR"
                    component={RadioButton}
                    type="radio"
                    value="WAR"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="WAR">Warning</label>
                </List>
                <List>
                  <Field
                    name="TSW"
                    id="CD1"
                    component={RadioButton}
                    type="radio"
                    value="CD1"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CD1">Condition 1</label>
                </List>
                <List>
                  <Field
                    name="TSW"
                    id="CD2"
                    component={RadioButton}
                    type="radio"
                    value="CD2"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CD2">Condition 2</label>
                </List>
                <List>
                  <Field
                    name="TSW"
                    id="CNL"
                    component={RadioButton}
                    type="radio"
                    value="CNL"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="CNL">CNL</label>
                </List>
              </SubList>
            )}
            {issuCdValue === "DIC" && (
              <SubList>
                <List>
                  <Field
                    name="DIC"
                    id="ON"
                    component={RadioButton}
                    type="radio"
                    value="ON"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="ON">ON</label>
                </List>
                <List>
                  <Field
                    name="DIC"
                    id="OFF"
                    component={RadioButton}
                    type="radio"
                    value="OFF"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="OFF">OFF</label>
                </List>
              </SubList>
            )}
            {issuCdValue === "RCL" && (
              <SubList>
                <List>
                  <Field
                    name="RCL"
                    id="ON"
                    component={RadioButton}
                    type="radio"
                    value="ON"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="ON">ON</label>
                </List>
                <List>
                  <Field
                    name="RCL"
                    id="OFF"
                    component={RadioButton}
                    type="radio"
                    value="OFF"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="OFF">OFF</label>
                </List>
              </SubList>
            )}
            {issuCdValue === "SSP" && (
              <SubList>
                <List>
                  <Field
                    name="SSP"
                    id="ON"
                    component={RadioButton}
                    type="radio"
                    value="ON"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="ON">ON</label>
                </List>
                <List>
                  <Field
                    name="SSP"
                    id="OFF"
                    component={RadioButton}
                    type="radio"
                    value="OFF"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="OFF">OFF</label>
                </List>
              </SubList>
            )}
            {issuCdValue === "SEC" && (
              <SubList>
                <List>
                  <Field
                    name="SEC"
                    id="LV1"
                    component={RadioButton}
                    type="radio"
                    value="LV1"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="LV1">Level 1</label>
                </List>
                <List>
                  <Field
                    name="SEC"
                    id="LV2"
                    component={RadioButton}
                    type="radio"
                    value="LV2"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="LV2">Level 2</label>
                </List>
                <List>
                  <Field
                    name="SEC"
                    id="LV3"
                    component={RadioButton}
                    type="radio"
                    value="LV3"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: React.ChangeEvent<any> | undefined) => onChangeIssuDtlCd(e, props.issuDtlCdValue)}
                  />
                  <label htmlFor="LV3">Level 3</label>
                </List>
              </SubList>
            )}
          </ListContainer>
          <ListHeader>Send Type</ListHeader>
          <ListContainer>
            <SendType disabled={!issuDtlCdValue}>
              <div>
                <label htmlFor="mailFlg">e-mail</label>
                <Field
                  name="mailFlg"
                  id="mailFlg"
                  component={ToggleInput}
                  confirmation={() => confirmationSwich("mailFlg")}
                  disabled={!issuDtlCdValue}
                />
              </div>
              <div>
                <label htmlFor="ttyFlg">TTY</label>
                <Field
                  name="ttyFlg"
                  id="ttyFlg"
                  component={ToggleInput}
                  confirmation={() => confirmationSwich("ttyFlg")}
                  disabled={!issuDtlCdValue}
                />
              </div>
            </SendType>
          </ListContainer>
        </Left>

        <Right>
          <RightContainer ttyIsActive={tabValue === "TTY"}>
            <TabContainer>
              <Tab isActive={tabValue === "e-mail"} onClick={() => handleTab("e-mail")} disabled={!mailFlgValue}>
                e-mail
              </Tab>
              <Tab isActive={tabValue === "TTY"} onClick={() => handleTab("TTY")} disabled={!ttyFlgValue}>
                TTY
              </Tab>
            </TabContainer>
            <RightContent disabled={!mailFlgValue} ttyIsActive={false} isPc={storage.isPc} isActive={tabValue === "e-mail"}>
              <Row>
                <FormTitle>e-mail Address Group</FormTitle>
                <Field
                  name="mailAddrGrpList"
                  options={mailAddrGrpList}
                  component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
                  disabled={!mailFlgValue}
                  validate={[myValidates.requireEmailAddress, myValidates.unique]}
                  maxValLength={MAIL_ADDRESS_GROUP_ITEM_MAX}
                  isForceError={mailFlgValue && isForceErrorMailAddrGrpList}
                  onChange={onChangeMailAddrGrpList}
                />
              </Row>
              <Row>
                <FormTitle>e-mail Additional Address</FormTitle>
                <Field
                  name="mailAddrList"
                  component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
                  disabled={!mailFlgValue}
                  validate={[myValidates.requireEmailAddress, myValidates.isOkEmails, myValidates.unique]}
                  filterValue={filterEmailAddress}
                  maxValLength={MAIL_ADDITIONAL_ADDRESS_ITEM_MAX}
                />
              </Row>
              <RowFlex>
                <From>
                  <FormTitle>From</FormTitle>
                  <Field
                    name="orgnMailAddr"
                    component={TextInput as "input" & typeof TextInput}
                    width={370}
                    disabled
                    maxLength={100}
                    validate={[validates.required]}
                  />
                </From>
                <CCSenderAddressCheckBoxContainer>
                  <FormTitle>CC: Sender Address</FormTitle>
                  <CheckBoxContainer>
                    <Field
                      name="mailCCSenderAddressChecked"
                      component="input"
                      type="checkbox"
                      disabled={!mailFlgValue}
                      onChange={onChangeMailCcSenderAddress}
                    />
                  </CheckBoxContainer>
                </CCSenderAddressCheckBoxContainer>
                <AddressDetailButtonContainer>
                  <PrimaryButton text="Address Detail" type="button" onClick={openEmailModal} disabled={!mailFlgValue} />
                </AddressDetailButtonContainer>
              </RowFlex>
              <Row>
                <FormTitle>Title</FormTitle>
                <div>
                  <Field
                    name="mailTitl"
                    component={TextInput as "input" & typeof TextInput}
                    width={724}
                    disabled={!mailFlgValue}
                    maxLength={100}
                  />
                </div>
              </Row>
              <Row>
                <TextAreaContainer isPc={storage.isPc} isTty={false}>
                  <Field
                    name="mailText"
                    component={TextArea as "input" & typeof TextArea}
                    width={724}
                    disabled={!mailFlgValue}
                    maxLength={4000}
                    maxWidth={724}
                    minWidth={724}
                    validate={[validates.required, validates.isOkIssuMailBody]}
                  />
                </TextAreaContainer>
              </Row>
              <UploadFilesComponent
                disabled={!mailFlgValue}
                channel="email"
                uploadedFiles={emailFileValue}
                onUploadFiles={(uploadFiles) => change("emailFile", [...emailFileValue, ...uploadFiles])}
                onRemoveFile={(index) =>
                  change(
                    "emailFile",
                    Array.from(emailFileValue).filter((_, i) => i !== index)
                  )
                }
              />
            </RightContent>
            <RightContent disabled={!ttyFlgValue} ttyIsActive isPc={storage.isPc} isActive={tabValue === "TTY"}>
              <Row>
                <FormTitle>TTY Address Group</FormTitle>
                <Field
                  name="ttyAddrGrpList"
                  options={ttyAddrGrpList}
                  component={MultipleSelectBox as "select" & typeof MultipleSelectBox}
                  disabled={!ttyFlgValue}
                  validate={[myValidates.requireTtyAddress, myValidates.unique]}
                  maxValLength={TTY_ADDRESS_GROUP_ITEM_MAX}
                  isForceError={ttyFlgValue && isForceErrorTtyAddrGrpList}
                  onChange={onChangeTtyAddrGrpList}
                  fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
                />
              </Row>
              <Row>
                <FormTitle>TTY Additional Address</FormTitle>
                <Field
                  name="ttyAddrList"
                  component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
                  disabled={!ttyFlgValue}
                  validate={[myValidates.requireTtyAddress, myValidates.isOkTtyAddresses, myValidates.unique]}
                  filterValue={filterTtyAddress}
                  formatValues={handleKeyPress}
                  maxValLength={TTY_ADDITIONAL_ADDRESS_ITEM_MAX}
                  fontFamily={'Consolas, "Courier New", Courier, Monaco, monospace'}
                />
              </Row>
              <RowFlex>
                <div>
                  <FormLabel htmlFor="ttyPriorityCd">Priority</FormLabel>
                  <Field
                    name="ttyPriorityCd"
                    component={SelectBox as "select" & typeof SelectBox}
                    options={getPriorities(props.master.cdCtrlDtls)}
                    width={70}
                    disabled={!ttyFlgValue}
                    hasBlank
                    validate={[validates.required]}
                  />
                </div>
                <Originator>
                  <FormLabel htmlFor="orgnTtyAddr">Originator</FormLabel>
                  <Field
                    name="orgnTtyAddr"
                    component={TextInput as "input" & typeof TextInput}
                    width={140}
                    disabled={!ttyFlgValue}
                    maxLength={7}
                    componentOnBlur={shipToUpperCase}
                    validate={[validates.required, validates.isOkTtyAddress]}
                  />
                </Originator>
                <CCSenderAddressCheckBoxContainer>
                  <FormLabel htmlFor="ttyCCSenderAddressChecked">CC: Sender Address</FormLabel>
                  <CheckBoxContainer>
                    <Field
                      name="ttyCCSenderAddressChecked"
                      component="input"
                      type="checkbox"
                      disabled={!ttyFlgValue}
                      onChange={onChangeTtyCcSenderAddress}
                    />
                  </CheckBoxContainer>
                </CCSenderAddressCheckBoxContainer>
                <AddressDetailButtonContainer>
                  <PrimaryButton text="Address Detail" type="button" onClick={openTtyModal} disabled={!ttyFlgValue} />
                </AddressDetailButtonContainer>
              </RowFlex>
              <Row>
                <Ruler isPc={storage.isPc}>....+....1....+....2....+....3....+....4....+....5....+....6....+....7</Ruler>
              </Row>
              <Row>
                <TextAreaContainer isPc={storage.isPc} isTty>
                  <Field
                    name="ttyText"
                    component={TextArea as "input" & typeof TextArea}
                    width={724}
                    disabled={!ttyFlgValue}
                    maxLength={4000}
                    maxWidth={724}
                    minWidth={724}
                    maxRowLength={69}
                    componentOnBlur={shipToUpperCase}
                    validate={[validates.required, validates.isOkTty]}
                  />
                </TextAreaContainer>
              </Row>
            </RightContent>
          </RightContainer>

          <RightFooter>
            <ButtonContainer>
              <PrimaryButton text="Template Save" type="button" onClick={saveTemplate} disabled={!issuDtlCdValue} />
            </ButtonContainer>
            <IssueTime>
              <label htmlFor="issuTime">Issue Time(L)</label>
              <Field
                name="issuTime"
                id="issuTime"
                component={TextInput as "input" & typeof TextInput}
                width={80}
                type="number"
                maxLength={4}
                disabled={!issuDtlCdValue}
                validate={[validates.requiredIssueTime, validates.time]}
              />
            </IssueTime>
            <ButtonContainer>
              <PrimaryButton text="Update & Send" type="button" onClick={updateSendAirportIssue} disabled={!issuDtlCdValue} />
            </ButtonContainer>
          </RightFooter>
        </Right>

        <Modal isOpen={isEmailModalActive} style={emailModalStyles} onRequestClose={handleHideEmailModal}>
          <ModalHeader>
            <div>e-mail Address Detail</div>
            <CloseButton onClick={handleHideEmailModal} />
          </ModalHeader>
          <AddressDetailContainer isPc={storage.isPc}>
            {mailAddrList && mailAddrList.map((mailAddr) => <EmailDetail key={mailAddr}>{mailAddr}</EmailDetail>)}
          </AddressDetailContainer>
        </Modal>

        <Modal isOpen={isTtyModalActive} style={ttyModalStyles} onRequestClose={handleHideTtyModal}>
          <ModalHeader>
            <div>TTY Address Detail</div>
            <CloseButton onClick={handleHideTtyModal} />
          </ModalHeader>
          <AddressDetailContainer isPc={storage.isPc}>
            {ttyAddrList && ttyAddrList.map((ttyAddr) => <TtyDetail key={ttyAddr}>{ttyAddr}</TtyDetail>)}
          </AddressDetailContainer>
        </Modal>
      </Form>
    </Wrapper>
  );
};

const emailModalStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    width: "766px",
    left: "calc(50% - 315px)",
    padding: 0,
    height: "calc(100vh - 80px)",
  },
};

const ttyModalStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    width: "646px",
    left: "calc(50% - 315px)",
    padding: 0,
    height: "calc(100vh - 80px)",
  },
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: #f6f6f6;
`;

const Form = styled.form<{ isPc: boolean }>`
  width: 1024px;
  height: calc(100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)});
  display: flex;
  justify-content: center;
  background: #fff;
`;

const Left = styled.div`
  width: 218px;
  margin: 10px;
  border-top: 1px solid #595857;
  display: flex;
  flex-flow: column nowrap;
`;

const ListHeader = styled.div`
  height: 24px;
  background: #e4f2f7;
  border: 1px solid #595857;
  border-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const ListContainer = styled.div`
  border: 1px solid #595857;
  border-top: 0;
  padding: 5px 0;
`;

const List = styled.div`
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;

  label {
    margin-right: auto;
    font-size: 17px;
  }
`;

const SubList = styled.div`
  padding-left: 24px;
`;

const SendType = styled.div<{ disabled: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 16px 16px;

  > div {
    display: flex;
    align-items: center;
    label {
      margin-right: 6px;
      font-size: 12px;
    }
  }
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")};
`;

const Right = styled.div`
  width: 760px;
  margin-right: 10px;
  display: flex;
  flex-flow: column nowrap;
`;

const RightContainer = styled.div<{ ttyIsActive: boolean }>`
  position: relative;
  padding-top: 10px;
  flex: 1;
  -webkit-overflow-scrolling: touch;
`;

const TabContainer = styled.div`
  position: absolute;
  width: 100%;
  z-index: 3;
  display: flex;

  > div:first-child {
    border-right: none;
  }
`;

const Tab = styled.div<{ isActive: boolean; disabled: boolean }>`
  width: 120px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #595857;
  border-bottom: 1px solid
    ${(props) => (props.isActive && !props.disabled ? "#fff" : props.isActive && props.disabled ? "#C9D3D0" : "#595857")};
  background: ${(props) => (props.disabled ? "#C9D3D0" : "transparent")};
  box-shadow: ${(props) => (props.isActive ? "1px -1px 1px rgba(0,0,0,0.1)" : "none")};
  z-index: ${(props) => (props.isActive ? "1" : "0")};
`;

const RightContent = styled.div<{ disabled: boolean; ttyIsActive: boolean; isPc: boolean; isActive: boolean }>`
  position: absolute;
  top: 54px;
  z-index: ${({ isActive }) => (isActive ? "2" : "1")};
  width: 100%;
  height: calc(
    100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 10px - 44px - 16px - 44px
  );
  overflow: auto;
  padding: 10px 16px;
  margin-top: -1px;
  border: 1px solid #595857;
  background: ${(props) => (props.disabled ? "#C9D3D0" : "#FFF")};
`;

const Ruler = styled.span<{ isPc: boolean }>`
  font-family: Consolas, "Courier New", Courier, Monaco, monospace;
  font-size: 16px;
  line-height: 1.2;
  margin-left: ${({ isPc }) => (isPc ? "7px" : "10px")};
`;

const Row = styled.div`
  margin-bottom: 9px;
`;

const RowFlex = styled(Row)`
  display: flex;
  justify-content: space-between;
`;

const FormTitle = styled.div`
  margin-bottom: 3px;
  font-size: 12px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 3px;
  font-size: 12px;
`;

const From = styled.div`
  margin-right: 0px;
`;

const CCSenderAddressCheckBoxContainer = styled.div`
  margin-left: 12px;
  margin-right: auto;
`;

const ButtonContainer = styled.div`
  width: 200px;
  align-self: flex-end;
`;

const AddressDetailButtonContainer = styled.div`
  width: 190px;
  align-self: flex-end;
`;

const TextAreaContainer = styled.div<{ isPc: boolean; isTty: boolean }>`
  textarea {
    height: 204px;
    padding: 10px 6px;
    ${({ isTty }) => (isTty ? "font-family: Consolas, 'Courier New', Courier, Monaco, monospace;" : "")}
  }
`;

const Originator = styled.div`
  margin-left: 12px;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  line-height: 44px;
  height: 44px;
  font-size: 17px;
  cursor: pointer;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  input[type="checkbox"] {
    margin-right: 6px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
    }
    &:disabled {
      opacity: 0.6;
      &:not(:checked) {
        background: #ebebe4;
      }
    }
  }
`;

const RightFooter = styled.div`
  height: 44px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const IssueTime = styled.div`
  margin-left: auto;
  margin-right: 12px;
  display: flex;
  align-items: center;

  label {
    margin-right: 7px;
    font-size: 12px;
  }
`;

const ModalHeader = styled.div`
  padding: 16px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    font-size: 12px;
  }
`;

const AddressDetailContainer = styled.div<{ isPc: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-left: ${({ isPc }) => (isPc ? 11 : 22)}px;
  overflow-y: scroll;
  height: calc(100vh - 80px - 41px - 16px);
`;

const EmailDetail = styled.div`
  width: 350px;
  height: 44px;
  padding: 0 8px;
  margin: 5px;
  display: flex;
  align-items: center;
  font-size: 17px;
  background: #f6f6f6;
  border-radius: 1px;
  border: 1px solid #c9d3d0;
`;

const TtyDetail = styled(EmailDetail)`
  margin: 5px;
  width: 140px;
`;

const Icon = styled.img`
  width: 36px;
  height: 36px;
`;

const IssueDicIcom = styled(Icon).attrs({ src: issueDicIcomSvg })``;
const IssueRwyIcon = styled(Icon).attrs({ src: issueRwyIconSvg })``;
const IssueSecIcon = styled(Icon).attrs({ src: issueSecIconSvg })``;
const IssueSspIcon = styled(Icon).attrs({ src: issueSspIconSvg })``;
const IssueSwwIcon = styled(Icon).attrs({ src: issueSwwIconSvg })``;
const IssueTswIcon = styled(Icon).attrs({ src: issueTswIconSvg })``;

export interface IssueSecurityFormParams {
  emailFiles?: UploadedFile[];
  tab: "e-mail" | "TTY";
  issuCd?: string;
  mailFlg: boolean;
  ttyFlg: boolean;
  mailAddrGrpList?: number[];
  mailAddrList?: string[];
  mailCCSenderAddressChecked: boolean;
  mailTitl?: string;
  mailText?: string;
  ttyAddrGrpList?: number[];
  ttyAddrList?: string[];
  ttyCCSenderAddressChecked: boolean;
  ttyPriorityCd?: string;
  ttyText?: string;
  issuTime?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const issueSecurityWithForm = reduxForm<IssueSecurityFormParams, Props>({
  form: FORM_NAME,
})(IssueSecurity);

const filterEmailAddress = (value: string) => value.replace(/(?!.*([A-Za-z0-9-_@.])).*/, "").slice(0, 100);

const filterTtyAddress = (value: string) => {
  const replaced = value.replace(/(?!.*([a-zA-Z]|[0-9]|\.|\/|-|\(|\))).*/, "");
  return replaced.slice(0, 7);
};

const selector = formValueSelector("issueSecurity");

const mapStateToProps = (state: RootState) => {
  const issuCdValue = selector(state, "issuCd") as Props["issuCdValue"];
  const issuDtlCdValue = issuCdValue ? (selector(state, issuCdValue) as Props["issuDtlCdValue"]) : "";
  const mailFlgValue = selector(state, "mailFlg") as Props["mailFlgValue"];
  const ttyFlgValue = selector(state, "ttyFlg") as Props["ttyFlgValue"];
  const emailFileValue = selector(state, "emailFile") as Props["emailFileValue"];
  const tabValue = selector(state, "tab") as Props["tabValue"];
  const { apoTimeLcl } = state.common.headerInfo;
  return {
    master: state.account.master,
    jobAuthUser: state.account.jobAuth.user,
    issueSecurity: state.issueSecurity,
    formValues: getFormValues("issueSecurity")(state) as IssueSecurityFormParams,
    formSyncErrors: getFormSyncErrors("issueSecurity")(state),
    headerInfo: state.common.headerInfo,
    issuCdValue,
    emailFileValue,
    tabValue,
    mailFlgValue,
    ttyFlgValue,
    issuDtlCdValue,
    initialValues: {
      issuCd: "",
      ttyPriorityCd: "QU",
      emailFile: [],
      tab: "e-mail",
      mailFlg: false,
      ttyFlg: false,
      mailAddrList: [],
      ttyAddrList: [],
      orgnMailAddr: state.account.jobAuth.user.mailAddr,
      orgnTtyAddr: state.account.jobAuth.user.ttyAddr,
      issuTime: apoTimeLcl ? dayjs(apoTimeLcl).format("HHmm") : "",
    } as Partial<IssueSecurityFormParams>,
  };
};

export default connect(mapStateToProps)(issueSecurityWithForm);
