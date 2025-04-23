import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import dayjs from "dayjs";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormErrors, formValueSelector, getFormSyncErrors, getFormValues, InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";
import { useAppDispatch, useAppSelector, usePrevious, useDidUpdateEffect } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import { storage } from "../../../lib/storage";
import { storageOfUser } from "../../../lib/StorageOfUser";
import { Const } from "../../../lib/commonConst";
import {
  arrayFirst,
  arrayUnique,
  convertLineFeedCodeToCRLF,
  execWithLocationInfo,
  isObjectEmpty,
  isObjectNotEmpty,
  getDayjsCalDate,
  removeTtyComment,
} from "../../../lib/commonUtil";
import { SoalaMessage } from "../../../lib/soalaMessages";
import * as validates from "../../../lib/validators";
import { reloadMaster } from "../../../reducers/account";
import * as addressActions from "../../../reducers/address";
// eslint-disable-next-line import/no-cycle
import * as broadcastActions from "../../../reducers/broadcast";
import * as acarsActions from "../../../reducers/broadcastAcars";
import * as bulletinBoardActions from "../../../reducers/broadcastBulletinBoard";
import * as emailActions from "../../../reducers/broadcastEmail";
import * as notificationActions from "../../../reducers/broadcastNotification";
import * as ttyActions from "../../../reducers/broadcastTty";
import * as aftnActions from "../../../reducers/broadcastAftn";
import { getHeaderInfo } from "../../../reducers/common";
import { openDateTimeInputPopup } from "../../../reducers/dateTimeInputPopup";
import EventListener from "../../atoms/EventListener";
import { OptionType } from "../../atoms/MultipleSelectBox";
import PrimaryButton from "../../atoms/PrimaryButton";
import SecondaryButton from "../../atoms/SecondaryButton";
import { UploadedFile, makeFile, removeBase64Type } from "../../molecules/UploadFilesComponent";
// eslint-disable-next-line import/no-cycle
import BroadcastAcars from "./BroadcastAcars";
// eslint-disable-next-line import/no-cycle
import BroadcastBulletinBoard from "./BroadcastBulletinBoard";
// eslint-disable-next-line import/no-cycle
import BroadcastEmail from "./BroadcastEmail";
// eslint-disable-next-line import/no-cycle
import BroadcastNotification from "./BroadcastNotification";
// eslint-disable-next-line import/no-cycle
import BroadcastTty from "./BroadcastTty";
// eslint-disable-next-line import/no-cycle
import BroadcastAftn from "./BroadcastAftn";
import DetailModal from "./DetailModal";
// eslint-disable-next-line import/no-cycle
import FlightLegSearchModal from "./FlightLegSearchModal";
import Tabs from "./Tabs";
import TemplateJobcodeSearch from "./TemplateJobCodeSearch";
import TemplateFilter from "./TemplateFilter";
// eslint-disable-next-line import/no-cycle
import TemplateFilterModal from "./TemplateFilterModal";
import TemplateList from "./TemplateList";
// eslint-disable-next-line import/no-cycle
import TemplateNameEditModal from "./TemplateNameEditModal";
import Template = Broadcast.Template;
import BroadcastType = Broadcast.BroadcastType;
import FlightLeg = Broadcast.Bb.FlightLeg;
import TemplateSortKey = Broadcast.TemplateSortKey;
import TemplateOrder = Broadcast.TemplateOrder;
import { SearchParamConverter, FormParam } from "../../../lib/AdvanceSearch/SearchParamConverter";
// eslint-disable-next-line import/no-cycle
import { SearchParamMapper } from "../../../lib/AdvanceSearch/SearchParamMapper";

export const FORM_NAME = "broadcast";

export const DEFAULT_TEXTAREA_HEIGHT = 310;
export const TEXTAREA_MIN_HEIGHT = 100;
export const ROW_WIDTH = 706;

const BB_FIELDS = [
  "catCdList",
  "flightLeg",
  "commGrpIdList",
  "jobGrpIdList",
  "jobIdList",
  "bbTitle",
  "expiryDate",
  "bbText",
  "attachments",
];

const MAIL_FIELDS = ["mailAddrGrpIdList", "mailAddrList", "orgnMailAddr", "mailTitle", "mailText", "attachments"];

const TTY_FIELDS = ["ttyAddrGrpIdList", "ttyAddrList", "ttyPriorityCd", "orgnTtyAddr", "ttyText"];

const AFTN_FIELDS = ["priority", "originator", "aftnText"];

const ACARS_FIELDS = ["shipNoList", "orgnTtyAddr", "uplinkText", "reqAckFlg"];

const NOTIFICATION_FIELDS = ["commGrpIdList", "jobGrpIdList", "jobIdList", "ntfTitle", "ntfText", "soundFlg"];

const CATEGORY_CODE_FLIGHT = "FLIGHT";
export const TEMPLATE_FILTER_SEND_BY = [
  { label: "B.B.", value: "BB" },
  { label: "e-mail", value: "MAIL" },
  { label: "TTY", value: "TTY" },
  { label: "AFTN", value: "AFTN" },
  { label: "Notification", value: "NTF" },
  { label: "ACARS", value: "ACARS" },
];

const styles = {
  jobCodeModal: {
    overlay: {
      background: "rgba(0, 0, 0, 0.5)",
      overflow: "auto",
      zIndex: 10,
    },
    content: {
      width: "646px",
      left: "calc(50% - 315px)",
      padding: 20,
      height: "calc(100vh - 80px)",
      overflow: "hidden",
    },
  },
  emailModal: {
    overlay: {
      background: "rgba(0, 0, 0, 0.5)",
      overflow: "auto",
      zIndex: 10,
    },
    content: {
      width: "798px",
      left: "calc(50% - 382px)",
      padding: 20,
      height: "calc(100vh - 80px)",
      overflow: "hidden",
    },
  },
  ttyAddressModal: {
    overlay: {
      background: "rgba(0, 0, 0, 0.5)",
      overflow: "hidden",
      zIndex: 10,
    },
    content: {
      width: "665px",
      left: "calc(50% - 330px)",
      padding: 20,
      height: "calc(100vh - 80px)",
      overflow: "hidden",
    },
  },
};

enum FilterTabName {
  name = "Name",
  recently = "Recently",
}

enum TabName {
  bb = "B.B.",
  email = "e-mail",
  tty = "TTY",
  aftn = "AFTN",
  acars = "ACARS",
  notification = "Notification",
}

type TabsType = TabName.bb | TabName.email | TabName.tty | TabName.aftn | TabName.acars | TabName.notification | null;

export type Props = {
  // jobAuthUser: JobAuthApi.User;
  apoTimeLcl: string;
  bbId: number | undefined;
  archiveFlg: boolean | undefined;
  from: "new" | "bbShare" | "edit" | "emailShare" | undefined;
  // formSyncErrors: BroadcastFormErrors | FormErrors;
  jobAuth: JobAuthApi.JobAuth[];
  // eslint-disable-next-line react/no-unused-prop-types
  cdCtrlDtls: MasterApi.CdCtrlDtl[];
  canManageBb: boolean;
  canManageEmail: boolean;
  canManageTty: boolean;
  canManageAftn: boolean;
  canManageNotification: boolean;
  canManageAcars: boolean;
  // broadcastFormValues: BroadcastFormParams;
  jobOptionForTemplate: { value: string; label: string }[];
  jobMap: Map<string, number>;
  templateJobCd: string;
  bbAttachments: UploadedFile[];
  emailAttachments: UploadedFile[];
  filterTabName: FilterTabName.name | FilterTabName.recently;
  tabName: TabsType;
  keyword: string;
  sendBy: string;
  isOpenSaveAsModal: boolean;
  isOpenFlightLegSearchModal: boolean;
  isOpenSearchFilterModal: boolean;
  isOpenTemplateNameEditModal: boolean;
  // isOpenFlightNumberInputPopup: boolean;
  isOpenBbAddressDetailModal: boolean;
  isOpenMailAddressDetailModal: boolean;
  isOpenTtyAddressDetailModal: boolean;
  isOpenNotificationAddressDetailModal: boolean;
  templates: Template[];
  bulletinBoardTemplate: Broadcast.Bb.Template;
  emailTemplate: Broadcast.Email.Template;
  ttyTemplate: Broadcast.Tty.Template;
  aftnTemplate: Broadcast.Aftn.Template;
  notificationTemplate: Broadcast.Ntf.Template;
  acarsTemplate: Broadcast.Acars.Template;
  flightLegs: FlightLeg[];
  detail: Broadcast.Bb.BulletinBoard;
  alCd: string;
  // displayDate: string;
  bbFlightLeg: FlightLeg;
  isFlightLegEnabled: boolean;
  bbCategories: string[];
  isTemplateFiltered: boolean;
  fetchingBulletinBoard: boolean;
  fetchingEmail: boolean;
  fetchingTty: boolean;
  fetchingAftn: boolean;
  fetchingNotification: boolean;
  fetchingAcars: boolean;
  fetchingBb: boolean;
  fetchingAllFlightLeg: boolean;
  templateName: string;
  loading: boolean;
  loadingTemplate: boolean;
  bb: Broadcast.Bb.FetchTemplateResponse & { templateId?: number; expiryDate: string; attachments: UploadedFile[] };
  mail: Broadcast.Email.Template & {
    templateId?: number;
    orgnMailAddr: string;
    ccSenderAddressChecked: boolean;
    attachments: UploadedFile[];
  };
  tty: Broadcast.Tty.Template & { orgnTtyAddr: string; ccSenderAddressChecked: boolean; divisionSendingChecked: boolean };
  aftn: Broadcast.Aftn.Template & { originator: string };
  notification: Broadcast.Ntf.Template & { templateId?: number };
  acars: Broadcast.Acars.Template & { templateId?: number; orgnTtyAddr: string };
  templateId: number;
  mailAddrGrpIdList: number[];
  mailAddrList: string[];
  orgnMailAddr: string;
  ntfCommGrpIdList: number[];
  ntfJobGrpIdList: number[];
  ntfJobIdList: number[];
  ttyAddrGrpIdList: number[];
  ttyAddrList: string[];
  bbTemplateId: number | null;
  mailTemplateId: number | null;
  ttyTemplateId: number | null;
  aftnTemplateId: number | null;
  notificationTemplateId: number | null;
  acarsTemplateId: number | null;
  // jobOption: OptionsType;
  addressJobCdList: string[];
  ttyAddrDetails: string[];
  mailAddrDetails: string[];
  bbCommGrpIdList: number[];
  bbJobGrpIdList: number[];
  bbJobIdList: number[];
  // getHeaderInfo: typeof getHeaderInfo;
  // reloadMaster: typeof reloadMaster;
  newBbId: number | null;
  bbExpiryDate: string;
  expiryDateInitialValue: string;
  broadcastType: BroadcastType | "";
  initialValues: initialValues;
};

interface Job {
  jobId: number;
  jobCd: string;
}

const getOrderCondition = (tabName: FilterTabName): { sortKey: TemplateSortKey; order: TemplateOrder } => {
  switch (tabName) {
    case FilterTabName.name:
      return { sortKey: "name", order: "asc" };
    case FilterTabName.recently:
      return { sortKey: "recentlyTime", order: "desc" };
    default:
      return { sortKey: "name", order: "asc" };
  }
};

const getFormKey = (tabName: TabsType): "BB" | "Mail" | "Tty" | "Aftn" | "Notification" | "Acars" | null => {
  switch (tabName) {
    case TabName.bb:
      return "BB";
    case TabName.email:
      return "Mail";
    case TabName.tty:
      return "Tty";
    case TabName.aftn:
      return "Aftn";
    case TabName.notification:
      return "Notification";
    case TabName.acars:
      return "Acars";
    default:
      return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOption = (value: any, label?: string, isFixed?: boolean, color?: string): OptionType => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  value,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  label: label || value,
  isFixed: isFixed || false,
  color,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBlank = (value: any): boolean => {
  if (typeof value === "undefined") return true;
  if (typeof value === "boolean" || typeof value === "number") return false;
  if (typeof value === "string") return !value;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (typeof value === "object") return Array.isArray(value) ? value.length === 0 : isObjectEmpty(value);
  // symbol, functionはformValueで考慮しない
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEmptyValueToNull = (object: { [key: string]: any }) => {
  const obj = { ...object };
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "") {
      obj[key] = null;
    }
  });
  return obj;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const omit = (object: Record<string, any>, keys: string[]) =>
  keys.reduce((o, k) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [k]: _omitted, ...rest } = o;
    return rest;
  }, object);

const Broadcast: React.FC<Props & InjectedFormProps<BroadcastFormParams, Props>> = (props) => {
  const searchParamConverter = useRef<SearchParamConverter>(new SearchParamConverter({ mapper: SearchParamMapper.getBroadcastMapper() }));

  // const master = useAppSelector((state) => state.account.master);
  const jobAuthUser = useAppSelector((state) => state.account.jobAuth.user);
  // const broadcast = useAppSelector((state) => state.broadcast);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const formValues = useAppSelector<any>((state) => getFormValues(FORM_NAME)(state));
  const formSyncErrors = useAppSelector((state) => getFormSyncErrors(FORM_NAME)(state));
  // const headerInfo = useAppSelector((state) => state.common.headerInfo);
  // const flightNumberInputPopup = useAppSelector((state) => state.flightNumberInputPopup);

  const prevProps = usePrevious(props);

  const dispatch = useAppDispatch();
  const history = useHistory();

  const [filter, setFilter] = useState("");
  const [template, setTemplate] = useState<{ id: number; type: BroadcastType | string; jobCd: string }>({
    id: 0,
    type: "",
    jobCd: jobAuthUser.jobCd,
  });
  // const [isEdit, setIsEdit] = useState(false);
  const [initial, setInitial] = useState<null | object>(null);
  const [needMergeFormValuesIntoTemplate, setNeedMergeFormValuesIntoTemplate] = useState(false);
  const [registeredTemplateName, setRegisteredTemplateName] = useState("");
  const [isForceErrorMailAddrGrpIdList, setIsForceErrorMailAddrGrpIdList] = useState(false);
  const [isForceErrorTtyAddrGrpIdList, setIsForceErrorTtyAddrGrpIdList] = useState(false);
  const [isForceErrorMailAddrList, setIsForceErrorMailAddrList] = useState(false);
  const [isForceErrorTtyAddrList, setIsForceErrorTtyAddrList] = useState(false);

  useEffect(() => {
    const { jobAuth, bbId, archiveFlg } = props;
    dispatch(broadcastActions.funcAuthCheck({ jobAuth }));

    void (async () => {
      const { COMM_GRP, ADGRP, SHIP } = Const.MasterGetType;
      // eslint-disable-next-line no-bitwise
      await dispatch(reloadMaster({ user: jobAuthUser, masterGetType: props.tabName !== TabName.acars ? COMM_GRP | ADGRP : SHIP }));
      if (bbId && archiveFlg !== undefined) {
        void dispatch(bulletinBoardActions.fetchBulletinBoard({ bbId, archiveFlg, callbacks: { onNotAllowed: () => transition() } }));
      }

      const jobId = getJobId(jobAuthUser.jobCd);
      if (jobId && !isBbEdit()) {
        void dispatch(
          broadcastActions.fetchAllTemplate({
            params: { jobId },
            sort: getOrderCondition(FilterTabName.name),
          })
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidUpdateEffect(() => {
    const { canManageBb, canManageEmail } = props;
    if ((!canManageBb && isEditMode()) || (!canManageEmail && isEmailShare())) {
      transition();
    }
  }, [props.canManageBb, props.canManageEmail]);

  useEffect(() => {
    if (prevProps !== null && !prevProps.newBbId && props.newBbId) {
      transition(props.newBbId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.newBbId]);

  useEffect(() => {
    if (prevProps !== null) {
      handleTemplateNameEdit(prevProps.isOpenTemplateNameEditModal, props.isOpenTemplateNameEditModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpenTemplateNameEditModal]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { bbCategories, isFlightLegEnabled, change } = props;
    if (prevProps !== null) {
      const hasFlightInBbCategory = bbCategories.includes(CATEGORY_CODE_FLIGHT);
      if (hasFlightInBbCategory && !isFlightLegEnabled) {
        dispatch(bulletinBoardActions.enableFlight());
      } else if (!hasFlightInBbCategory && isFlightLegEnabled) {
        change("BB.flightLeg", {});
        dispatch(bulletinBoardActions.disableFlight());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.bbCategories, props.isFlightLegEnabled]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { fetchingAllFlightLeg, flightLegs, change } = props;
    if (prevProps !== null) {
      if (prevProps.fetchingAllFlightLeg && !fetchingAllFlightLeg && flightLegs && flightLegs.length === 1) {
        change("BB.flightLeg", arrayFirst(flightLegs));
        dispatch(bulletinBoardActions.closeFlightLegSearchModal());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingAllFlightLeg, props.flightLegs]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingBulletinBoard } = props;
      applyBulletinBoardTemplate(prevProps.fetchingBulletinBoard, fetchingBulletinBoard);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingBulletinBoard]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingEmail } = props;
      applyEmailTemplate(prevProps.fetchingEmail, fetchingEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingEmail]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingTty } = props;
      applyTtyTemplate(prevProps.fetchingTty, fetchingTty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingTty]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingAftn } = props;
      applyAftnTemplate(prevProps.fetchingAftn, fetchingAftn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingAftn]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingNotification } = props;
      applyNotificationTemplate(prevProps.fetchingNotification, fetchingNotification);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingNotification]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingAcars } = props;
      applyAcarsTemplate(prevProps.fetchingAcars, fetchingAcars);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingAcars]);

  useEffect(() => {
    if (prevProps !== null) {
      const { fetchingBb } = props;
      applyBb(prevProps.fetchingBb, fetchingBb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fetchingBb]);

  useEffect(() => {
    const { loadingTemplate } = props;
    if (prevProps !== null && !prevProps.loadingTemplate && loadingTemplate) {
      void dispatch(getHeaderInfo({ apoCd: jobAuthUser.myApoCd }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loadingTemplate, jobAuthUser.myApoCd]);

  const transition = (bbId?: number) => {
    let path = Const.PATH_NAME.bulletinBoard;
    if (bbId) {
      path = `${Const.PATH_NAME.bulletinBoard}?bbId=${bbId}`;
    } else if (props.bbId) {
      path = `${Const.PATH_NAME.bulletinBoard}?bbId=${props.bbId}`;
    }
    history.push(path);
  };

  const handleTemplateNameEdit = (prev: boolean, next: boolean) => {
    if (!prev && next) {
      setRegisteredTemplateName(props.templateName);
    }
    if (prev && !next) {
      setRegisteredTemplateName("");
    }
  };

  const applyBulletinBoardTemplate = (prev: boolean, next: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, bulletinBoardTemplate, bbAttachments, bbFlightLeg, bbExpiryDate, initialValues, expiryDateInitialValue } = props;
    if (prev && !next && isObjectNotEmpty(bulletinBoardTemplate)) {
      change("tabName", TabName.bb);
      change("BB.templateId", bulletinBoardTemplate.templateId);
      change("BB.catCdList", bulletinBoardTemplate.catCdList);
      change("BB.commGrpIdList", bulletinBoardTemplate.commGrpIdList);
      change("BB.jobGrpIdList", bulletinBoardTemplate.jobGrpIdList);
      change("BB.jobIdList", bulletinBoardTemplate.jobIdList);
      change("BB.bbTitle", bulletinBoardTemplate.bbTitle);
      change("BB.bbText", bulletinBoardTemplate.bbText);

      change(
        "BB.attachments",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        needMergeFormValuesIntoTemplate ? bbAttachments : initialValues.BB ? initialValues.BB.attachments : []
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let nextFlightLegValue = initialValues.BB ? (initialValues.BB.flightLeg as unknown as string) : {};
      if (bulletinBoardTemplate.catCdList.some((category) => category === CATEGORY_CODE_FLIGHT) && needMergeFormValuesIntoTemplate) {
        nextFlightLegValue = bbFlightLeg;
      }
      change("BB.flightLeg", nextFlightLegValue);
      change(
        "BB.expiryDate",
        needMergeFormValuesIntoTemplate
          ? bbExpiryDate
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          initialValues.BB
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            initialValues.BB.expiryDate
          : expiryDateInitialValue
      );

      setNeedMergeFormValuesIntoTemplate(false);
      setInitial({
        ...getInitialValue(TabName.bb),
        templateId: bulletinBoardTemplate.templateId,
        catCdList: bulletinBoardTemplate.catCdList,
        commGrpIdList: bulletinBoardTemplate.commGrpIdList,
        jobGrpIdList: bulletinBoardTemplate.jobGrpIdList,
        jobIdList: bulletinBoardTemplate.jobIdList,
        bbTitle: bulletinBoardTemplate.bbTitle,
        bbText: bulletinBoardTemplate.bbText,
      });
    }
  };

  const handleClickExpiryDate = () => {
    const onEnter = (value: string) => {
      props.change("BB.expiryDate", value);
    };
    const apoTimeLclDayjs = dayjs(props.apoTimeLcl);
    const currentTimeLcl = apoTimeLclDayjs && apoTimeLclDayjs.isValid() ? apoTimeLclDayjs.startOf("day") : dayjs().startOf("day");
    const customValidate = (value: string) => {
      if (value) {
        const dayjsCalDate = getDayjsCalDate(value, "YYYY-MM-DD");
        if (dayjsCalDate) {
          if (dayjsCalDate.isSameOrAfter(currentTimeLcl) && dayjsCalDate.isSameOrBefore(Const.EXPIRY_DATE_MAXIMUM)) {
            return true;
          }
        }
      }
      return false;
    };
    dispatch(
      openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD",
        currentValue: props.bbExpiryDate,
        onEnter,
        customValidate,
        unableDelete: true,
        minDate: currentTimeLcl.toDate(),
        maxDate: Const.EXPIRY_DATE_MAXIMUM.toDate(),
      })
    );
  };

  const applyEmailTemplate = (prev: boolean, next: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, emailTemplate, emailAttachments, initialValues } = props;
    if (prev && !next && isObjectNotEmpty(emailTemplate)) {
      change("tabName", TabName.email);
      change("Mail.templateId", emailTemplate.templateId);
      change("Mail.mailAddrGrpIdList", emailTemplate.mailAddrGrpIdList);
      change("Mail.mailAddrList", emailTemplate.mailAddrList.length ? emailTemplate.mailAddrList : []);
      change("Mail.mailTitle", emailTemplate.mailTitle);
      change("Mail.mailText", emailTemplate.mailText);

      change(
        "Mail.attachments",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        needMergeFormValuesIntoTemplate ? emailAttachments : initialValues.Mail ? (initialValues.Mail.attachments as unknown as string) : []
      );

      setNeedMergeFormValuesIntoTemplate(false);
      setIsForceErrorMailAddrGrpIdList(false);
      setIsForceErrorMailAddrList(false);
      setInitial({
        ...getInitialValue(TabName.email),
        templateId: emailTemplate.templateId,
        mailAddrGrpIdList: emailTemplate.mailAddrGrpIdList,
        mailAddrList: emailTemplate.mailAddrList.length ? emailTemplate.mailAddrList : [],
        mailTitle: emailTemplate.mailTitle,
        mailText: emailTemplate.mailText,
      });
    }
  };

  const applyTtyTemplate = (prev: boolean, next: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { ttyTemplate, change } = props;
    if (prev && !next && isObjectNotEmpty(ttyTemplate)) {
      change("tabName", TabName.tty);
      change("Tty.templateId", ttyTemplate.templateId);
      change("Tty.ttyAddrGrpIdList", ttyTemplate.ttyAddrGrpIdList);
      change("Tty.ttyAddrList", ttyTemplate.ttyAddrList.length ? ttyTemplate.ttyAddrList : []);
      change("Tty.ttyPriorityCd", ttyTemplate.ttyPriorityCd);
      change("Tty.ttyText", ttyTemplate.ttyText);

      setNeedMergeFormValuesIntoTemplate(false);
      setIsForceErrorTtyAddrGrpIdList(false);
      setIsForceErrorTtyAddrList(false);
      setInitial({
        ...getInitialValue(TabName.tty),
        templateId: ttyTemplate.templateId,
        ttyAddrGrpIdList: ttyTemplate.ttyAddrGrpIdList,
        ttyAddrList: ttyTemplate.ttyAddrList.length ? ttyTemplate.ttyAddrList : [],
        ttyPriorityCd: ttyTemplate.ttyPriorityCd,
        ttyText: ttyTemplate.ttyText,
      });
    }
  };

  const applyAftnTemplate = (prev: boolean, next: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { aftnTemplate, change } = props;
    if (prev && !next && isObjectNotEmpty(aftnTemplate)) {
      change("tabName", TabName.aftn);
      change("Aftn.templateId", aftnTemplate.templateId);
      change("Aftn.priority", aftnTemplate.priority);
      change("Aftn.aftnText", aftnTemplate.aftnText);
      setNeedMergeFormValuesIntoTemplate(false);
      setInitial({
        ...getInitialValue(TabName.aftn),
        templateId: aftnTemplate.templateId,
        priority: aftnTemplate.priority,
        aftnText: aftnTemplate.aftnText,
      });
    }
  };

  const applyNotificationTemplate = (prev: boolean, next: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, notificationTemplate } = props;
    if (prev && !next && isObjectNotEmpty(notificationTemplate)) {
      change("tabName", TabName.notification);
      change("Notification.templateId", notificationTemplate.templateId);
      change("Notification.commGrpIdList", notificationTemplate.commGrpIdList);
      change("Notification.jobGrpIdList", notificationTemplate.jobGrpIdList);
      change("Notification.jobIdList", notificationTemplate.jobIdList);
      change("Notification.ntfTitle", notificationTemplate.ntfTitle);
      change("Notification.ntfText", notificationTemplate.ntfText);
      change("Notification.soundFlg", notificationTemplate.soundFlg);
      setNeedMergeFormValuesIntoTemplate(false);
      setInitial({
        ...getInitialValue(TabName.notification),
        templateId: notificationTemplate.templateId,
        commGrpIdList: notificationTemplate.commGrpIdList,
        jobGrpIdList: notificationTemplate.jobGrpIdList,
        jobIdList: notificationTemplate.jobIdList,
        ntfTitle: notificationTemplate.ntfTitle,
        ntfText: notificationTemplate.ntfText,
        soundFlg: notificationTemplate.soundFlg,
      });
    }
  };

  const applyAcarsTemplate = (prev: boolean, next: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, acarsTemplate } = props;
    if (prev && !next && isObjectNotEmpty(acarsTemplate)) {
      change("tabName", TabName.acars);
      change("Acars.templateId", acarsTemplate.templateId);
      change("Acars.shipNoList", acarsTemplate.shipNoList);
      change("Acars.uplinkText", acarsTemplate.uplinkText);
      change("Acars.reqAckFlg", acarsTemplate.reqAckFlg);
      setNeedMergeFormValuesIntoTemplate(false);
      setInitial({
        ...getInitialValue(TabName.acars),
        templateId: acarsTemplate.templateId,
        shipNoList: acarsTemplate.shipNoList,
        uplinkText: acarsTemplate.uplinkText,
        reqAckFlg: acarsTemplate.reqAckFlg,
      });
    }
  };

  const applyBb = (prev: boolean, next: boolean) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, detail, expiryDateInitialValue, initialValues } = props;
    if (prev && !next && isObjectNotEmpty(detail)) {
      if (isBbEdit() || isBbShare()) {
        change("tabName", TabName.bb);
        change("BB.catCdList", detail.catCdList);
        change("BB.bbTitle", detail.bbTitle);
        change("BB.bbText", detail.bbText);
        change("BB.expiryDate", expiryDateInitialValue);
        const flightLeg: FlightLeg | Record<string, unknown> = detail.catCdList.includes(CATEGORY_CODE_FLIGHT)
          ? {
              legInfoCd: detail.legInfoCd,
              orgDateLcl: detail.orgDateLcl,
              alCd: detail.alCd,
              fltNo: detail.fltNo,
              casFltNo: detail.casFltNo,
              skdDepApoCd: detail.skdDepApoCd,
              skdArrApoCd: detail.skdArrApoCd,
              skdLegSno: detail.skdLegSno,
              lstDepApoCd: detail.lstDepApoCd,
              lstArrApoCd: detail.lstArrApoCd,
            }
          : {};
        change("BB.flightLeg", flightLeg);
        const attachments = detail.bbFileList.map((file) => ({
          fileName: file.fileName,
          type: file.fileType,
          object: file.fileObject,
          thumbnail: file.fileTmb,
          id: file.fileId,
          file: makeFile(file.fileObject, file.fileName, file.fileType, dayjs().unix()),
        }));
        change("BB.attachments", attachments);
        if (isBbEdit()) {
          change("BB.commGrpIdList", detail.commGrpIdList);
          change("BB.jobGrpIdList", detail.jobGrpIdList);
          change("BB.jobIdList", detail.jobIdList);
          change("BB.expiryDate", detail.expiryDate);
          setInitial({
            ...getInitialValue(TabName.bb),
            commGrpIdList: detail.commGrpIdList,
            jobGrpIdList: detail.jobGrpIdList,
            jobIdList: detail.jobIdList,
            catCdList: detail.catCdList,
            bbTitle: detail.bbTitle,
            bbText: detail.bbText,
            expiryDate: detail.expiryDate,
            flightLeg,
            attachments,
          });
        } else {
          // B.B. Share
          change("BB.commGrpIdList", []);
          change("BB.jobGrpIdList", []);
          change("BB.jobIdList", initialValues.BB ? initialValues.BB.jobIdList : []);
          setInitial({
            ...getInitialValue(TabName.bb),
            catCdList: detail.catCdList,
            bbTitle: detail.bbTitle,
            bbText: detail.bbText,
            flightLeg,
            attachments,
          });
        }
      } else if (isEmailShare()) {
        change("tabName", TabName.email);
        change("Mail.mailAddrGrpIdList", []);
        change("Mail.mailAddrList", []);
        change("Mail.mailTitle", detail.bbTitle);
        change("Mail.mailText", detail.bbText);
        const attachments = detail.bbFileList.map((file) => ({
          fileName: file.fileName,
          type: file.fileType,
          object: removeBase64Type(file.fileObject),
          thumbnail: "",
          id: file.fileId,
          file: makeFile(file.fileObject, file.fileName, file.fileType, dayjs().unix()),
        }));
        change("Mail.attachments", attachments);
        setIsForceErrorMailAddrGrpIdList(false);
        setIsForceErrorMailAddrList(false);
        setInitial({
          ...getInitialValue(TabName.email),
          mailTitle: detail.bbTitle,
          mailText: detail.bbText,
          attachments,
        });
        setIsForceErrorMailAddrGrpIdList(false);
        setIsForceErrorMailAddrList(false);
        setInitial({});
      }
    }
  };

  const isName = (): boolean => props.filterTabName === FilterTabName.name;

  const isRecently = (): boolean => props.filterTabName === FilterTabName.recently;

  const isBb = (): boolean => props.tabName === TabName.bb;

  const isEmail = (): boolean => props.tabName === TabName.email;

  const isTty = (): boolean => props.tabName === TabName.tty;

  const isAftn = (): boolean => props.tabName === TabName.aftn;

  const isAcars = (): boolean => props.tabName === TabName.acars;

  const isNotification = (): boolean => props.tabName === TabName.notification;

  const isEdited = (): boolean => {
    const { tabName } = props;
    const key = getFormKey(tabName);
    const omitKeys = isEmail() ? ["ccSenderAddressChecked"] : isTty() ? ["ccSenderAddressChecked", "divisionSendingChecked"] : [];
    if (!template.id && !isBbEdit()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      return !!key && !isEqual(omit(formValues[key], omitKeys), omit(getInitialValue(), omitKeys));
    }
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      !!key && !!initial && !isEqual(mapEmptyValueToNull(omit(formValues[key], omitKeys)), mapEmptyValueToNull(omit(initial, omitKeys)))
    );
  };

  const isBbEdit = (): boolean => !!props.bbId && props.from === "edit";

  const isBbShare = (): boolean => !!props.bbId && props.from === "bbShare";

  const isEmailShare = (): boolean => !!props.bbId && props.from === "emailShare";

  const isEditMode = (): boolean => isBbEdit();

  const getInitialValue = (name?: TabsType) => {
    const { initialValues } = props;
    const tabName = name || props.tabName;
    switch (tabName) {
      case TabName.bb:
        return initialValues.BB;
      case TabName.email:
        return initialValues.Mail;
      case TabName.tty:
        return initialValues.Tty;
      case TabName.aftn:
        return initialValues.Aftn;
      case TabName.notification:
        return initialValues.Notification;
      case TabName.acars:
        return initialValues.Acars;
      default:
        return {};
    }
  };

  const handleChangeTab = async (
    changeTabName: TabName.bb | TabName.email | TabName.tty | TabName.aftn | TabName.acars | TabName.notification,
    disabled: boolean
  ): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { tabName, change } = props;
    if (disabled || tabName === changeTabName) {
      return;
    }
    const changeTab = async () => {
      clearForm();
      if (changeTabName !== TabName.acars) {
        // eslint-disable-next-line no-bitwise
        await dispatch(reloadMaster({ user: jobAuthUser, masterGetType: Const.MasterGetType.COMM_GRP | Const.MasterGetType.ADGRP }));
      } else {
        await dispatch(reloadMaster({ user: jobAuthUser, masterGetType: Const.MasterGetType.SHIP }));
      }
      change("tabName", changeTabName);
      void dispatch(broadcastActions.clearSubmitFailedFields());
    };
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              void changeTab();
            },
          })
        )
      );
    } else {
      await changeTab();
    }
  };

  const handleClickReload = async () => {
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40011C({
            onYesButton: () => {
              void reload();
            },
          })
        )
      );
    } else {
      await reload();
    }
  };

  const reload = async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { filterTabName, tabName, change } = props;
    if (isBbEdit()) {
      const { bbId, archiveFlg } = props;
      if (bbId && archiveFlg !== undefined) {
        void dispatch(bulletinBoardActions.fetchBulletinBoard({ bbId, archiveFlg }));
        void dispatch(getHeaderInfo({ apoCd: jobAuthUser.myApoCd }));
      }
    } else {
      void clearForm(true);
      clearValidation();
      change("tabName", tabName);
      change("filterTabName", filterTabName);

      const jobId = getJobId(props.templateJobCd);
      if (jobId) {
        await dispatch(
          broadcastActions.fetchAllTemplate({
            params: {
              jobId,
              ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
            },
            sort: getOrderCondition(filterTabName),
          })
        );
      }

      if (template.type !== "") {
        void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
      }
    }
  };

  const handleChangeJobCode = (newJobCd: string) => {
    if (newJobCd === props.templateJobCd) {
      return;
    }
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              handleApplySearch(newJobCd);
              clearForm();
              clearValidation();
              setTemplate({
                id: 0,
                type: "",
                jobCd: newJobCd,
              });
            },
            onNoButton: () => revertJobCd(props.templateJobCd),
          })
        )
      );
    } else {
      handleApplySearch(newJobCd);
      clearForm();
      clearValidation();
      setTemplate({
        id: 0,
        type: "",
        jobCd: newJobCd,
      });
    }
  };

  const handleApplySearch = (newJobCd: string) => {
    const { filterTabName } = props;
    const jobId = getJobId(newJobCd);
    if (jobId) {
      void dispatch(
        broadcastActions.fetchAllTemplate({
          params: {
            jobId,
            ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
          },
          sort: getOrderCondition(filterTabName),
        })
      );
    }
  };

  const getJobId = (jobCd: string) => props.jobMap.get(jobCd) ?? null;

  const revertJobCd = (prevJobCd: string) => {
    props.change("templateJobCd", prevJobCd);
  };

  const handleClickFilterTab = (tabName: FilterTabName.name | FilterTabName.recently): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { filterTabName, change, templates } = props;
    if (filterTabName === tabName) {
      return;
    }
    change("filterTabName", tabName);
    const { sortKey, order } = getOrderCondition(tabName);
    dispatch(broadcastActions.sortTemplates({ templates, sortKey, order }));
  };

  const handleClickFlightLegField = (): void => {
    const { isFlightLegEnabled } = props;
    if (!isFlightLegEnabled) {
      return;
    }
    dispatch(bulletinBoardActions.openFlightLegSearchModal());
  };

  const handleCloseSaveAsModal = () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, templateName } = props;
    const close = () => {
      dispatch(broadcastActions.closeSaveAsModal());
      change("templateName", "");
    };
    if (templateName) {
      void dispatch(broadcastActions.showMessage(SoalaMessage.M40001C({ onYesButton: close })));
    } else {
      close();
    }
  };

  const handleCloseSearchFilterModal = () => {
    dispatch(broadcastActions.closeSearchFilterModal());
  };

  const handleClickFlightLegButton = (flightLeg: FlightLeg): void => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change } = props;
    change("BB.flightLeg", flightLeg);
  };

  const handleClickTemplate = (id: number, type: BroadcastType) => {
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              void applyTemplate(id, type, props.templateJobCd);
            },
          })
        )
      );
    } else {
      void applyTemplate(id, type, props.templateJobCd);
    }
  };

  const applyTemplate = async (templateId: number, type: BroadcastType, templateJobCd: string): Promise<void> => {
    const { filterTabName, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification } = props;
    let tmp:
      | Broadcast.Bb.FetchTemplateResponse
      | Broadcast.Email.Template
      | Broadcast.Tty.Template
      | Broadcast.Aftn.Template
      | Broadcast.Ntf.Template
      | Broadcast.Acars.Template
      | null;
    switch (type) {
      case "BB":
        if (!canManageBb) {
          return;
        }
        tmp = await dispatch(
          bulletinBoardActions.fetchBulletinBoardTemplate({
            templateId,
            templateJobId: getJobId(templateJobCd),
            userJobId: getJobId(jobAuthUser.jobCd),
          })
        ).unwrap();
        break;
      case "MAIL":
        if (!canManageEmail) {
          return;
        }
        tmp = await dispatch(emailActions.fetchEmailTemplate({ templateId })).unwrap();
        break;
      case "TTY":
        if (!canManageTty) {
          return;
        }
        tmp = await dispatch(ttyActions.fetchTtyTemplate({ templateId })).unwrap();
        break;
      case "AFTN":
        if (!canManageAftn) {
          return;
        }
        tmp = await dispatch(aftnActions.fetchAftnTemplate({ templateId })).unwrap();
        break;
      case "NTF":
        if (!canManageNotification) {
          return;
        }
        tmp = await dispatch(
          notificationActions.fetchNotificationTemplate({
            templateId,
            templateJobId: getJobId(templateJobCd),
            userJobId: getJobId(jobAuthUser.jobCd),
          })
        ).unwrap();
        break;
      case "ACARS":
        if (!canManageAcars) {
          return;
        }
        tmp = await dispatch(acarsActions.fetchAcarsTemplate({ templateId })).unwrap();
        break;
      default:
        tmp = null;
        break;
    }
    if (tmp) {
      setTemplate({
        id: tmp.templateId,
        type,
        jobCd: templateJobCd,
      });
    } else {
      const jobId = getJobId(props.templateJobCd);
      if (jobId) {
        await dispatch(
          broadcastActions.fetchAllTemplate({
            params: {
              jobId,
              ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
            },
            sort: getOrderCondition(filterTabName),
          })
        );
      }
      void clearForm();
    }
  };

  const isApplyingOtherJobCdTemplate = () => props.templateJobCd !== jobAuthUser.jobCd;

  const handleFilterKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return handleApplyFilter();
    }
    return undefined;
  };

  const handleApplyFilter = () => {
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              void applyFilter();
            },
          })
        )
      );
    } else {
      void applyFilter();
    }
  };

  const applyFilter = async () => {
    const res = (await filterTemplateFromString(filter)) as Broadcast.FetchAllTemplateResponse | undefined;
    if (!res) {
      return;
    }

    if (template.type !== "") {
      void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
    } else {
      void clearForm();
    }
  };

  const handleClickTemplateFilter = () => dispatch(broadcastActions.openSearchFilterModal());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeFilter = (e: (React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) | any) => {
    const { isTemplateFiltered } = props;

    if (isTemplateFiltered && isEdited()) {
      // 非同期でイベントプロパティを参照できるように、事前に変数にセット
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { value } = e.target;
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              void editFilter(value as string);
              // フォームクリア
              if (template.type !== "") {
                void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
              } else {
                void clearForm();
              }
              // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
              clearValidation();
            },
          })
        )
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      void editFilter(e.target.value as string);
    }
  };

  const editFilter = async (value: string) => {
    const { isTemplateFiltered, filterTabName } = props;
    setFilter(value);
    if (!isTemplateFiltered) {
      return;
    }
    // フィルタをクリア
    searchParamConverter.current.applyStringParam("");
    const formParam = searchParamConverter.current.getFormParam(true);
    Object.keys(formParam).forEach((k) => {
      props.change(String(k), formParam[k]);
    });

    const jobId = getJobId(props.templateJobCd);
    if (jobId) {
      await dispatch(
        broadcastActions.fetchAllTemplate({
          params: {
            jobId,
            ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
          },
          sort: getOrderCondition(filterTabName),
        })
      );
    }
    dispatch(broadcastActions.clearTemplateFilter());

    if (template.type !== "") {
      void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
    } else {
      void clearForm();
    }
  };

  const handleClearFilter = () => {
    if (props.isTemplateFiltered && isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              void clearFilter();
            },
          })
        )
      );
    } else {
      void clearFilter();
    }
  };

  const clearFilter = async () => {
    const { isTemplateFiltered, filterTabName } = props;

    // フィルタをクリア
    searchParamConverter.current.applyStringParam("");
    const formParam = searchParamConverter.current.getFormParam(true);
    Object.keys(formParam).forEach((k) => {
      props.change(String(k), formParam[k]);
    });
    setFilter("");
    if (!isTemplateFiltered) {
      return;
    }

    const jobId = getJobId(props.templateJobCd);
    if (jobId) {
      await dispatch(
        broadcastActions.fetchAllTemplate({
          params: {
            jobId,
            ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
          },
          sort: getOrderCondition(filterTabName),
        })
      );
    }
    dispatch(broadcastActions.clearTemplateFilter());

    if (template.type !== "") {
      void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
    } else {
      void clearForm();
    }
  };

  const handleSubmitTemplate = () => {
    const {
      tabName,
      bbTemplateId,
      mailTemplateId,
      ttyTemplateId,
      aftnTemplateId,
      notificationTemplateId,
      acarsTemplateId,
      canManageBb,
      canManageEmail,
      canManageTty,
      canManageAftn,
      canManageAcars,
      canManageNotification,
    } = props;
    if (showValidationErrors(true)) {
      return;
    }

    switch (tabName) {
      case TabName.bb:
        if (!canManageBb) {
          return;
        }
        if (bbTemplateId) {
          void dispatch(
            broadcastActions.showMessage(
              SoalaMessage.M30004C({
                issueType: "B.B.",
                onYesButton: () => {
                  void updateBbTemplate().then((res) => {
                    if (res) {
                      setNeedMergeFormValuesIntoTemplate(true);
                      void applyFilter();
                    }
                  });
                },
              })
            )
          );
        } else {
          dispatch(broadcastActions.openSaveAsModal());
        }
        break;
      case TabName.email:
        if (!canManageEmail) {
          return;
        }
        if (mailTemplateId) {
          void dispatch(
            broadcastActions.showMessage(
              SoalaMessage.M30004C({
                issueType: "e-mail",
                onYesButton: () => {
                  void updateEmailTemplate().then((res) => {
                    if (res) {
                      setNeedMergeFormValuesIntoTemplate(true);
                      void applyFilter();
                    }
                  });
                },
              })
            )
          );
        } else {
          dispatch(broadcastActions.openSaveAsModal());
        }
        break;
      case TabName.tty:
        if (!canManageTty) {
          return;
        }
        if (ttyTemplateId) {
          void dispatch(
            broadcastActions.showMessage(
              SoalaMessage.M30004C({
                issueType: "TTY",
                onYesButton: () => {
                  void updateTtyTemplate().then((res) => {
                    if (res) {
                      setNeedMergeFormValuesIntoTemplate(true);
                      void applyFilter();
                    }
                  });
                },
              })
            )
          );
        } else {
          dispatch(broadcastActions.openSaveAsModal());
        }
        break;
      case TabName.aftn:
        if (!canManageAftn) {
          return;
        }
        if (aftnTemplateId) {
          void dispatch(
            broadcastActions.showMessage(
              SoalaMessage.M30004C({
                issueType: "AFTN",
                onYesButton: () => {
                  void updateAftnTemplate().then((res) => {
                    if (res) {
                      setNeedMergeFormValuesIntoTemplate(true);
                      void applyFilter();
                    }
                  });
                },
              })
            )
          );
        } else {
          dispatch(broadcastActions.openSaveAsModal());
        }
        break;
      case TabName.notification:
        if (!canManageNotification) {
          return;
        }
        if (notificationTemplateId) {
          void dispatch(
            broadcastActions.showMessage(
              SoalaMessage.M30004C({
                issueType: "Notification",
                onYesButton: () => {
                  void updateNotificationTemplate().then((res) => {
                    if (res) {
                      setNeedMergeFormValuesIntoTemplate(true);
                      void applyFilter();
                    }
                  });
                },
              })
            )
          );
        } else {
          dispatch(broadcastActions.openSaveAsModal());
        }
        break;
      case TabName.acars:
        if (!canManageAcars) {
          return;
        }
        if (acarsTemplateId) {
          void dispatch(
            broadcastActions.showMessage(
              SoalaMessage.M30004C({
                issueType: "Acars",
                onYesButton: () => {
                  void updateAcarsTemplate().then((res) => {
                    if (res) {
                      setNeedMergeFormValuesIntoTemplate(true);
                      void applyFilter();
                    }
                  });
                },
              })
            )
          );
        } else {
          dispatch(broadcastActions.openSaveAsModal());
        }
        break;
      default:
        break;
    }
  };

  const handleSubmitNewTemplate = () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {
      tabName,
      change,
      canManageBb,
      canManageEmail,
      canManageTty,
      canManageAftn,
      canManageAcars,
      canManageNotification,
      filterTabName,
    } = props;
    if (showTemplateNameValidationError()) {
      return;
    }
    void dispatch(
      broadcastActions.showMessage(
        SoalaMessage.M30004C({
          issueType: tabName as string,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onYesButton: async () => {
            let storeTemplateResponse:
              | undefined
              | Broadcast.Bb.StoreTemplateResponse
              | Broadcast.Email.StoreTemplateResponse
              | Broadcast.Tty.StoreTemplateResponse
              | Broadcast.Aftn.StoreTemplateResponse
              | Broadcast.Ntf.StoreTemplateResponse
              | Broadcast.Acars.StoreTemplateResponse;
            switch (tabName) {
              case TabName.bb:
                if (!canManageBb) {
                  dispatch(broadcastActions.closeSaveAsModal());
                  return;
                }
                storeTemplateResponse = (await handleSubmitNewBbTemplate()) as unknown as Broadcast.Bb.StoreTemplateResponse | undefined;
                break;
              case TabName.email:
                if (!canManageEmail) {
                  dispatch(broadcastActions.closeSaveAsModal());
                  return;
                }
                storeTemplateResponse = (await handleSubmitNewEmailTemplate()) as unknown as
                  | Broadcast.Email.StoreTemplateResponse
                  | undefined;
                break;
              case TabName.tty:
                if (!canManageTty) {
                  dispatch(broadcastActions.closeSaveAsModal());
                  return;
                }
                storeTemplateResponse = (await handleSubmitNewTtyTemplate()) as unknown as Broadcast.Tty.StoreTemplateResponse | undefined;
                break;
              case TabName.aftn:
                if (!canManageAftn) {
                  dispatch(broadcastActions.closeSaveAsModal());
                  return;
                }
                storeTemplateResponse = (await handleSubmitNewAftnTemplate()) as unknown as
                  | Broadcast.Aftn.StoreTemplateResponse
                  | undefined;
                break;
              case TabName.notification:
                if (!canManageNotification) {
                  dispatch(broadcastActions.closeSaveAsModal());
                  return;
                }
                storeTemplateResponse = (await handleSubmitNewNotificationTemplate()) as unknown as
                  | Broadcast.Ntf.StoreTemplateResponse
                  | undefined;
                break;
              case TabName.acars:
                if (!canManageAcars) {
                  dispatch(broadcastActions.closeSaveAsModal());
                  return;
                }
                storeTemplateResponse = (await handleSubmitNewAcarsTemplate()) as unknown as
                  | Broadcast.Acars.StoreTemplateResponse
                  | undefined;
                break;
              default:
                break;
            }
            if (storeTemplateResponse && storeTemplateResponse.templateId) {
              const storedTemplateId = storeTemplateResponse.templateId;
              // フィルタをクリア
              searchParamConverter.current.applyStringParam("");
              const formParam = searchParamConverter.current.getFormParam(true);
              Object.keys(formParam).forEach((k) => {
                props.change(String(k), formParam[k]);
              });
              setFilter("");

              const jobId = getJobId(props.templateJobCd);
              let fetchAllTemplateResponse: Broadcast.FetchAllTemplateResponse | null = null;
              if (jobId) {
                fetchAllTemplateResponse = await dispatch(
                  broadcastActions.fetchAllTemplate({
                    params: {
                      jobId,
                      ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
                    },
                    sort: getOrderCondition(filterTabName),
                  })
                ).unwrap();
              }
              dispatch(broadcastActions.clearTemplateFilter());
              if (fetchAllTemplateResponse) {
                const storedTemplate = arrayFirst(
                  fetchAllTemplateResponse.templateList.filter((tmp) => tmp.templateId === storedTemplateId)
                );
                if (storedTemplate) {
                  setNeedMergeFormValuesIntoTemplate(true);
                  void applyTemplate(storedTemplate.templateId, storedTemplate.broadcastType, jobAuthUser.jobCd);
                }
              }
              dispatch(broadcastActions.closeSaveAsModal());
              change("templateName", "");
            }
          },
        })
      )
    );
  };

  const updateBbTemplate = async () => {
    const {
      bb: { templateId, catCdList, commGrpIdList, jobGrpIdList, jobIdList, bbTitle, bbText },
      bbFlightLeg: { legInfoCd },
    } = props;
    const params = {
      templateId,
      catCdList,
      legInfoCd,
      commGrpIdList,
      jobGrpIdList,
      jobIdList,
      bbTitle,
      bbText,
    };
    return dispatch(
      bulletinBoardActions.updateBulletinBoardTemplate({
        params,
        callbacks: {
          onNotFoundTemplate: () => {
            handleNotFoundUpdateTemplate();
          },
        },
      })
    );
  };

  const updateEmailTemplate = async () => {
    const {
      mail: { templateId, mailAddrGrpIdList, mailAddrList, mailTitle, mailText },
    } = props;
    return dispatch(
      emailActions.updateEmailTemplate({
        params: {
          templateId,
          mailAddrGrpIdList,
          mailAddrList,
          mailTitle,
          mailText,
        },
        callbacks: {
          onNotFoundTemplate: () => {
            handleNotFoundUpdateTemplate();
          },
        },
      })
    );
  };

  const updateTtyTemplate = async () => {
    const {
      tty: { templateId, ttyAddrGrpIdList, ttyAddrList, ttyPriorityCd, ttyText },
    } = props;
    return dispatch(
      ttyActions.updateTtyTemplate({
        params: {
          templateId,
          ttyAddrGrpIdList,
          ttyAddrList,
          ttyPriorityCd,
          ttyText: convertLineFeedCodeToCRLF(ttyText) as string,
        },
        callbacks: {
          onNotFoundTemplate: () => {
            handleNotFoundUpdateTemplate();
          },
        },
      })
    );
  };

  const updateAftnTemplate = async () => {
    const {
      aftn: { templateId, priority, aftnText },
    } = props;
    return dispatch(
      aftnActions.updateAftnTemplate({
        params: {
          templateId,
          priority,
          aftnText: convertLineFeedCodeToCRLF(aftnText) as string,
        },
        callbacks: {
          onNotFoundTemplate: () => {
            handleNotFoundUpdateTemplate();
          },
        },
      })
    );
  };

  const updateNotificationTemplate = async () => {
    const {
      notification: { templateId, commGrpIdList, jobGrpIdList, jobIdList, ntfTitle, ntfText, soundFlg },
    } = props;
    return dispatch(
      notificationActions.updateNotificationTemplate({
        params: {
          templateId,
          commGrpIdList,
          jobGrpIdList,
          jobIdList,
          ntfTitle,
          ntfText,
          soundFlg,
        },
        callbacks: {
          onNotFoundTemplate: () => {
            handleNotFoundUpdateTemplate();
          },
        },
      })
    );
  };

  const updateAcarsTemplate = async () => {
    const {
      acars: { templateId, shipNoList, uplinkText, reqAckFlg },
    } = props;
    return dispatch(
      acarsActions.updateAcarsTemplate({
        params: {
          templateId,
          shipNoList,
          uplinkText: convertLineFeedCodeToCRLF(uplinkText) as string,
          reqAckFlg,
        },
        callbacks: {
          onNotFoundTemplate: () => {
            handleNotFoundUpdateTemplate();
          },
        },
      })
    );
  };

  const handleNotFoundUpdateTemplate = () => {
    const { filterTabName } = props;
    setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
    setInitial(null);

    const jobId = getJobId(props.templateJobCd);
    if (jobId) {
      void dispatch(
        broadcastActions.fetchAllTemplate({
          params: {
            jobId,
            ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
          },
          sort: getOrderCondition(filterTabName),
        })
      );
    }
  };

  const handleSubmitNewBbTemplate = async () => {
    const {
      templateName,
      bb: { catCdList, commGrpIdList, jobGrpIdList, jobIdList, bbTitle, bbText },
    } = props;
    return dispatch(
      bulletinBoardActions.storeBulletinBoardTemplate({
        templateName,
        catCdList,
        commGrpIdList,
        jobGrpIdList,
        jobIdList,
        bbTitle,
        bbText,
      })
    ).unwrap();
  };

  const handleSubmitNewEmailTemplate = async () => {
    const {
      templateName,
      mail: { mailAddrGrpIdList, mailAddrList, mailTitle, mailText },
    } = props;
    return dispatch(
      emailActions.storeEmailTemplate({
        templateName,
        mailAddrGrpIdList,
        mailAddrList,
        mailTitle,
        mailText,
      })
    ).unwrap();
  };

  const handleSubmitNewTtyTemplate = async () => {
    const {
      templateName,
      tty: { ttyAddrGrpIdList, ttyAddrList, ttyPriorityCd, ttyText },
    } = props;
    return dispatch(
      ttyActions.storeTtyTemplate({
        templateName,
        ttyAddrGrpIdList,
        ttyAddrList,
        ttyPriorityCd,
        ttyText: convertLineFeedCodeToCRLF(ttyText) as string,
      })
    ).unwrap();
  };

  const handleSubmitNewAftnTemplate = async () => {
    const {
      templateName,

      aftn: { priority, aftnText },
    } = props;
    return dispatch(
      aftnActions.storeAftnTemplate({
        templateName,
        priority,
        aftnText: convertLineFeedCodeToCRLF(aftnText) as string,
      })
    ).unwrap();
  };

  const handleSubmitNewNotificationTemplate = async () => {
    const {
      templateName,
      notification: { commGrpIdList, jobGrpIdList, jobIdList, ntfTitle, ntfText, soundFlg },
    } = props;
    return dispatch(
      notificationActions.storeNotificationTemplate({
        templateName,
        commGrpIdList,
        jobGrpIdList,
        jobIdList,
        ntfTitle,
        ntfText,
        soundFlg,
      })
    ).unwrap();
  };

  const handleSubmitNewAcarsTemplate = async () => {
    const {
      templateName,
      acars: { shipNoList, uplinkText, reqAckFlg },
    } = props;
    return dispatch(
      acarsActions.storeAcarsTemplate({
        templateName,
        shipNoList,
        uplinkText: convertLineFeedCodeToCRLF(uplinkText) as string,
        reqAckFlg,
      })
    ).unwrap();
  };

  const applyModalFilter = async (): Promise<void> => {
    const { keyword, sendBy } = props;
    const apply = async () => {
      const res = (await filterTemplateFromForm(keyword, sendBy)) as unknown as Broadcast.FetchAllTemplateResponse | undefined;
      if (!res) {
        return;
      }
      if (template.type !== "") {
        void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
      } else {
        void clearForm();
      }
      dispatch(broadcastActions.closeSearchFilterModal());
    };
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onYesButton: async () => {
              await apply();
            },
          })
        )
      );
    } else {
      await apply();
    }
  };

  const filterTemplateFromString = async (flt: string) => {
    const { filterTabName } = props;

    searchParamConverter.current.applyStringParam(flt);
    const errorMessages = searchParamConverter.current.applyStringParam(flt);
    if (errorMessages.length) {
      void dispatch(broadcastActions.showMessage(errorMessages[0]));
      setFilter(flt);
      return undefined;
    }

    const jobId = getJobId(props.templateJobCd);
    let res: Broadcast.FetchAllTemplateResponse | null = null;
    if (jobId) {
      res = await dispatch(
        broadcastActions.fetchAllTemplate({
          params: {
            jobId,
            ...(searchParamConverter.current.getRequestParam(true) as Broadcast.TemplateFilterConditions),
          },
          sort: getOrderCondition(filterTabName),
        })
      ).unwrap();
    }
    if (res) {
      const stringParam = searchParamConverter.current.getStringParam();
      setFilter(stringParam);
      const formParam = searchParamConverter.current.getFormParam(true);
      Object.keys(formParam).forEach((k) => {
        props.change(String(k), formParam[k]);
      });
      if (stringParam) {
        dispatch(broadcastActions.applyTemplateFilter());
      } else {
        dispatch(broadcastActions.clearTemplateFilter());
      }
    }
    return res;
  };

  const filterTemplateFromForm = async (keyword: string, sendBy: string) => {
    const { filterTabName } = props;
    const formParam: FormParam = { keyword, sendBy };
    searchParamConverter.current.applyFormParam(formParam);
    const jobId = getJobId(props.templateJobCd);
    let res: Broadcast.FetchAllTemplateResponse | null = null;
    if (jobId) {
      res = await dispatch(
        broadcastActions.fetchAllTemplate({
          params: {
            jobId,
            ...(searchParamConverter.current.getRequestParam(true) as Broadcast.TemplateFilterConditions),
          },
          sort: getOrderCondition(filterTabName),
        })
      ).unwrap();
    }
    if (res) {
      const stringParam = searchParamConverter.current.getStringParam();
      setFilter(stringParam);
      const param = searchParamConverter.current.getFormParam(true);
      Object.keys(param).forEach((k) => {
        props.change(String(k), param[k]);
      });
      if (stringParam) {
        dispatch(broadcastActions.applyTemplateFilter());
      } else {
        dispatch(broadcastActions.clearTemplateFilter());
      }
    }
    return res;
  };

  const fetchAllMailAddressList = async () => {
    const {
      mail: { mailAddrGrpIdList, mailAddrList, orgnMailAddr, ccSenderAddressChecked },
    } = props;

    const res = await dispatch(
      addressActions.fetchAllMailAddressList({
        mailAddrGrpIdList,
        mailAddrList: ccSenderAddressChecked ? [...new Set([orgnMailAddr, ...mailAddrList])] : mailAddrList,
      })
    ).unwrap();
    return res;
  };

  const fetchAllTtyAddressList = async () => {
    const {
      tty: { ttyAddrGrpIdList, ttyAddrList },
    } = props;

    const res = await dispatch(
      addressActions.fetchAllTtyAddressList({
        ttyAddrGrpIdList,
        ttyAddrList,
      })
    ).unwrap();
    return res;
  };

  const handleClickSend = () => {
    const { tabName, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification } = props;
    if (showValidationErrors()) {
      return;
    }
    void dispatch(
      broadcastActions.showMessage(
        SoalaMessage.M30008C({
          onYesButton: () => {
            switch (tabName) {
              case TabName.bb:
                if (!canManageBb) {
                  return;
                }
                if (isBbEdit()) {
                  void handleUpdateBb();
                } else {
                  void handleSendBb();
                }
                break;
              case TabName.email:
                if (!canManageEmail) {
                  return;
                }
                void handleSendEmail();
                break;
              case TabName.tty:
                if (!canManageTty) {
                  return;
                }
                void handleSendTty();
                break;
              case TabName.aftn:
                if (!canManageAftn) {
                  return;
                }
                void handleSendAftn();
                break;
              case TabName.notification:
                if (!canManageNotification) {
                  return;
                }
                void handleSendNotification();
                break;
              case TabName.acars:
                if (!canManageAcars) {
                  return;
                }
                void handleSendAcars();
                break;
              default:
                break;
            }
          },
        })
      )
    );
  };

  const handleSendBb = async () => {
    const {
      bb: { catCdList, commGrpIdList, jobGrpIdList, jobIdList, expiryDate, bbTitle, bbText, attachments },
      bbFlightLeg: { legInfoCd, orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno },
      bbTemplateId,
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors) {
      const jobAddrListRes = await dispatch(
        addressActions.fetchAllJobCodeAddressList({
          commGrpIdList,
          jobGrpIdList,
          jobIdList,
        })
      ).unwrap();
      if (jobAddrListRes) {
        // ロケーションを取得し実行する
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        execWithLocationInfo(async ({ posLat, posLon }) => {
          const params = {
            catCdList,
            legInfoCd,
            orgDateLcl,
            alCd,
            fltNo,
            casFltNo,
            skdDepApoCd,
            skdArrApoCd,
            skdLegSno,
            commGrpIdList,
            jobGrpIdList,
            jobIdList,
            bbTitle,
            bbText,
            expiryDate,
            destinationList: jobAddrListRes.jobList,
            bbFileList: attachments.map(({ fileName, type, object, thumbnail }) => ({
              fileName,
              fileType: type,
              fileObject: object,
              fileTmb: thumbnail,
            })),
            templateId: bbTemplateId,
            posLat,
            posLon,
          };
          await dispatch(bulletinBoardActions.sendBulletinBoard(params));
        });
      }
    }
  };

  const handleUpdateBb = async () => {
    const {
      bbId,
      bb: { catCdList, commGrpIdList, jobGrpIdList, jobIdList, expiryDate, bbTitle, bbText, attachments },
      bbFlightLeg: { legInfoCd, orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno },
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors && bbId && isBbEdit()) {
      const jobAddrListRes = await dispatch(
        addressActions.fetchAllJobCodeAddressList({
          commGrpIdList,
          jobGrpIdList,
          jobIdList,
        })
      ).unwrap();
      if (jobAddrListRes && jobAddrListRes.jobList) {
        // ロケーションを取得し実行する
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        execWithLocationInfo(async ({ posLat, posLon }) => {
          const jobList = jobAddrListRes.jobList as Job[];
          const params = {
            bbId,
            catCdList,
            legInfoCd,
            orgDateLcl,
            alCd,
            fltNo,
            casFltNo,
            skdDepApoCd,
            skdArrApoCd,
            skdLegSno,
            commGrpIdList,
            jobGrpIdList,
            jobIdList,
            expiryDate,
            destinationList: jobList,
            bbTitle,
            bbText,
            bbFileList: attachments.map(({ fileName, type, object, thumbnail }) => ({
              fileName,
              fileType: type,
              fileObject: object,
              fileTmb: thumbnail,
            })),
            posLat,
            posLon,
          };
          const res = await dispatch(
            bulletinBoardActions.updateBulletinBoard({
              params,
              callbacks: {
                onNotFoundThread: () => history.push(Const.PATH_NAME.bulletinBoard),
              },
            })
          ).unwrap();
          if (res) {
            transition();
          }
        });
      }
    }
  };

  const handleSendEmail = async () => {
    const {
      mail: { orgnMailAddr, mailTitle, mailText, attachments },
      mailTemplateId,
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors && orgnMailAddr) {
      setIsForceErrorMailAddrGrpIdList(false);
      setIsForceErrorMailAddrList(false);
      const res = await fetchAllMailAddressList();
      if (res && res.mailAddrList) {
        if (res.mailAddrList.length === 0) {
          setIsForceErrorMailAddrGrpIdList(true);
          props.touch(FORM_NAME, "Mail.mailAddrGrpIdList");
          void dispatch(broadcastActions.showMessage(SoalaMessage.M50034C({})));
        } else {
          await dispatch(
            emailActions.sendEmail({
              mailAddrList: res.mailAddrList,
              orgnMailAddr,
              mailTitle,
              mailText,
              mailFileList: attachments.map(({ fileName, object }) => ({ fileName, fileObject: object })),
              templateId: mailTemplateId,
            })
          );
        }
      }
    }
  };

  const handleSendTty = async () => {
    const {
      tty: { ttyPriorityCd, orgnTtyAddr, ttyText, ccSenderAddressChecked, divisionSendingChecked },
      ttyTemplateId,
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors) {
      setIsForceErrorTtyAddrGrpIdList(false);
      setIsForceErrorTtyAddrList(false);
      const res = await fetchAllTtyAddressList();
      if (res && res.ttyAddrList) {
        if (res.ttyAddrList.length === 0) {
          setIsForceErrorTtyAddrGrpIdList(true);
          props.touch(FORM_NAME, "Tty.ttyAddrGrpIdList");
          void dispatch(broadcastActions.showMessage(SoalaMessage.M50034C({})));
        } else {
          await dispatch(
            ttyActions.sendTty({
              ttyAddrList: res.ttyAddrList,
              ttyPriorityCd,
              orgnTtyAddr,
              orgnTtyAddrFwFlg: ccSenderAddressChecked,
              ttyAddrDivideFlg: divisionSendingChecked,
              ttyText: convertLineFeedCodeToCRLF(removeTtyComment(ttyText)) as string,
              templateId: ttyTemplateId,
            })
          );
        }
      }
    }
  };

  const handleSendAftn = async () => {
    const {
      aftn: { priority, originator, aftnText },
      aftnTemplateId,
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors) {
      await dispatch(
        aftnActions.sendAftn({
          priority,
          originator,
          aftnText: convertLineFeedCodeToCRLF(removeTtyComment(aftnText)) as string,
          templateId: aftnTemplateId,
        })
      );
    }
  };

  const handleSendNotification = async () => {
    const {
      notification: { commGrpIdList, jobGrpIdList, jobIdList, ntfTitle, ntfText, soundFlg },
      notificationTemplateId,
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors) {
      const res = await dispatch(
        addressActions.fetchAllJobCodeAddressList({
          commGrpIdList,
          jobGrpIdList,
          jobIdList,
        })
      ).unwrap();
      if (res && res.jobList) {
        const jobList = res.jobList as Job[];
        await dispatch(
          notificationActions.sendNotification({
            jobCdList: jobList.map((job) => job.jobCd),
            ntfTitle,
            ntfText,
            soundFlg,
            templateId: notificationTemplateId,
          })
        );
      }
    }
  };

  const handleSendAcars = async () => {
    const {
      acars: { shipNoList, uplinkText, orgnTtyAddr, reqAckFlg },
      acarsTemplateId,
    } = props;
    const hasErrors = showValidationErrors();
    if (!hasErrors && orgnTtyAddr) {
      await dispatch(
        acarsActions.sendAcars({
          shipNoList,
          orgnTtyAddr,
          uplinkText: convertLineFeedCodeToCRLF(uplinkText) as string,
          reqAckFlg,
          templateId: acarsTemplateId,
        })
      );
    }
  };

  const handleClickClear = () => {
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => {
              void clearForm(true);
              // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
              clearValidation();
            },
          })
        )
      );
    } else {
      void clearForm(true);
    }
  };

  const clearForm = (needApplyTemplate = false) => {
    [TabName.bb, TabName.email, TabName.tty, TabName.aftn, TabName.notification, TabName.acars].forEach((name) => {
      const key = getFormKey(name);
      if (key) {
        props.change(key, getInitialValue(name));
      }
    });
    if (needApplyTemplate && template.id && template.type !== "") {
      void applyTemplate(template.id, template.type as BroadcastType, template.jobCd);
    } else {
      setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
      setInitial(null);
      setIsForceErrorMailAddrGrpIdList(false);
      setIsForceErrorMailAddrList(false);
      setIsForceErrorTtyAddrGrpIdList(false);
      setIsForceErrorTtyAddrList(false);
    }
  };

  const clearValidation = () => {
    const { tabName } = props;
    const key = getFormKey(tabName);

    // フィールド情報取得
    let fields: string[] = [];
    switch (tabName) {
      case TabName.bb:
        fields = BB_FIELDS;
        break;
      case TabName.email:
        fields = MAIL_FIELDS;
        break;
      case TabName.tty:
        fields = TTY_FIELDS;
        break;
      case TabName.aftn:
        fields = AFTN_FIELDS;
        break;
      case TabName.notification:
        fields = NOTIFICATION_FIELDS;
        break;
      case TabName.acars:
        fields = ACARS_FIELDS;
        break;
      default:
        break;
    }

    // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
    fields.forEach((field) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      props.untouch(`${key}.${field}`);
    });
  };

  const handleTemplateNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmitNewTemplate();
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") void applyModalFilter();
  };

  const handleTemplateNameEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleSubmitTemplateName();
  };

  const getBroadcastType = () => {
    const { broadcastType } = props;
    switch (broadcastType) {
      case "BB":
        return "B.B.";
      case "MAIL":
        return "e-mail";
      case "TTY":
        return "TTY";
      case "AFTN":
        return "AFTN";
      case "NTF":
        return "Notification";
      case "ACARS":
        return "ACARS";
      default:
        return broadcastType;
    }
  };

  const handleSubmitTemplateName = async () => {
    const { templateId, templateName, filterTabName } = props;
    if (showTemplateNameValidationError()) {
      return;
    }
    const closeAndClearModal = () => {
      dispatch(broadcastActions.closeTemplateNameEditModal());
      clearTemplateNameEditModal();
    };
    await dispatch(
      broadcastActions.showMessage(
        SoalaMessage.M30004C({
          issueType: getBroadcastType(),
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onYesButton: async () => {
            const res = await dispatch(
              broadcastActions.updateTemplateName({
                params: { templateId, templateName },
                callbacks: {
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onNotFoundTemplate: async () => {
                    // 名前変更しようとしたテンプレートが存在しなかった場合の、エラーハンドリング
                    if (templateId === template.id) {
                      const jobId = getJobId(props.templateJobCd);
                      if (jobId) {
                        await dispatch(
                          broadcastActions.fetchAllTemplate({
                            params: {
                              jobId,
                              ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
                            },
                            sort: getOrderCondition(filterTabName),
                          })
                        );
                      }
                      clearForm();
                    } else {
                      void applyFilter();
                    }
                    closeAndClearModal();
                  },
                },
              })
            ).unwrap();
            if (res) {
              void applyFilter();
              closeAndClearModal();
            }
          },
        })
      )
    );
  };

  const handleDeleteTemplate = async (templateId: number) => {
    const { filterTabName } = props;
    await dispatch(
      broadcastActions.showMessage(
        SoalaMessage.M40014C({
          item: "template",
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onYesButton: async () => {
            const res = await dispatch(
              broadcastActions.destroyTemplate({
                params: { templateId },
                callbacks: {
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onNotFoundTemplate: async () => {
                    // 削除しようとしたテンプレートが存在しなかった場合の、エラーハンドリング
                    if (template.type === "" || template.id !== templateId) {
                      await filterTemplateFromString(filter);
                    } else {
                      const jobId = getJobId(props.templateJobCd);
                      if (jobId) {
                        await dispatch(
                          broadcastActions.fetchAllTemplate({
                            params: {
                              jobId,
                              ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
                            },
                            sort: getOrderCondition(filterTabName),
                          })
                        );
                      }
                      // テンプレートなしの編集中に変更
                      setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
                      setInitial({ ...getInitialValue() });
                    }
                  },
                },
              })
            ).unwrap();
            if (res) {
              if (template.type === "" || template.id !== templateId) {
                // do nothing.
              } else {
                const jobId = getJobId(props.templateJobCd);
                if (jobId) {
                  await dispatch(
                    broadcastActions.fetchAllTemplate({
                      params: {
                        jobId,
                        ...(searchParamConverter.current.getRequestParam() as Broadcast.TemplateFilterConditions),
                      },
                      sort: getOrderCondition(filterTabName),
                    })
                  );
                }
                // テンプレートなしの編集中に変更
                setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
                setInitial({ ...getInitialValue() });
              }
            }
          },
        })
      )
    );
  };

  const handleClickTemplateNameEdit = (id: number, name: string, type: BroadcastType) => {
    props.change("templateId", id);
    props.change("templateName", name);
    props.change("broadcastType", type);
    dispatch(broadcastActions.openTemplateNameEditModal());
  };

  const handleCloseTemplateNameEditModal = () => {
    const { templateName } = props;
    const close = () => {
      dispatch(broadcastActions.closeTemplateNameEditModal());
      clearTemplateNameEditModal();
    };
    if (registeredTemplateName !== templateName) {
      void dispatch(broadcastActions.showMessage(SoalaMessage.M40001C({ onYesButton: close })));
    } else {
      close();
    }
  };

  const clearTemplateNameEditModal = () => {
    props.change("templateId", "");
    props.change("templateName", "");
    props.change("broadcastType", "");
  };

  const showValidationErrors = (isTemplateSave = false): boolean => {
    if (isTemplateSave) {
      return false;
    }
    const { tabName } = props;
    let target = "";
    let fields: string[] = [];
    switch (tabName) {
      case TabName.bb:
        target = "BB";
        fields = BB_FIELDS;
        break;
      case TabName.email:
        target = "Mail";
        fields = MAIL_FIELDS;
        break;
      case TabName.tty:
        target = "Tty";
        fields = TTY_FIELDS;
        break;
      case TabName.aftn:
        target = "Aftn";
        fields = AFTN_FIELDS;
        break;
      case TabName.notification:
        target = "Notification";
        fields = NOTIFICATION_FIELDS;
        break;
      case TabName.acars:
        target = "Acars";
        fields = ACARS_FIELDS;
        break;
      default:
        break;
    }
    const errorFields: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessages: Array<{ messageFunction: any }> = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const formErrors = formSyncErrors as BroadcastFormErrors;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (isTemplateSave && formValues && formValues[target]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const formValue = formValues[target][field];
        if (isBlank(formValue)) {
          continue;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const messageFunction = formErrors && formErrors[target] && (formErrors[target][field] as any);
      if (messageFunction) {
        errorFields.push(`${target}.${field}`);
        if (!existsErrorMessages(errorMessages, messageFunction)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          errorMessages.push({ messageFunction });
        }
      }
    }
    if (errorFields.length > 0) {
      void dispatch(broadcastActions.submitFailedField(errorFields));
    }
    for (let i = 0; i < errorMessages.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { messageFunction } = errorMessages[i];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
      void dispatch(broadcastActions.showMessage(messageFunction()));
    }
    return !!errorMessages.length;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existsErrorMessages = (errorMessages: Array<{ messageFunction: any }>, messageFunction: any): boolean =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    errorMessages.filter((errorMessage: any) => errorMessage.messageFunction.name === messageFunction.name).length > 0;

  const showTemplateNameValidationError = () => {
    const formErrors = formSyncErrors as BroadcastFormErrors;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const messageFunction = formErrors.templateName as any;
    if (messageFunction) {
      void dispatch(broadcastActions.submitFailedField(["templateName"]));
      return true;
    }
    return false;
  };

  const handleClickCancel = () => {
    if (isEdited()) {
      void dispatch(
        broadcastActions.showMessage(
          SoalaMessage.M40012C({
            onYesButton: () => transition(),
          })
        )
      );
    } else {
      transition();
    }
  };

  const handleClickSaveAs = () => {
    if (showValidationErrors(true)) {
      return;
    }
    dispatch(broadcastActions.openSaveAsModal());
  };

  const handleClickTtyAddressDetailButton = async () => {
    const {
      tty: { ttyAddrList },
    } = props;
    if (ttyAddrList.length !== arrayUnique(ttyAddrList).length) {
      setIsForceErrorTtyAddrList(true);
      props.touch(FORM_NAME, "Tty.ttyAddrList");
      void dispatch(broadcastActions.showMessage(SoalaMessage.M50020C({ items: ttyAddrList })));
      return;
    }
    if (ttyAddrList.filter((address) => !validates.isTtyAddress(address)).length) {
      setIsForceErrorTtyAddrList(true);
      props.touch(FORM_NAME, "Tty.ttyAddrList");
      void dispatch(broadcastActions.showMessage(SoalaMessage.M50014C()));
      return;
    }
    await fetchAllTtyAddressList();
    dispatch(ttyActions.openTtyAddressDetailModal());
  };

  const handleClickBbAddressDetailButton = () => {
    const { bbCommGrpIdList, bbJobGrpIdList, bbJobIdList } = props;
    dispatch(bulletinBoardActions.openBbAddressDetailModal());
    void dispatch(
      addressActions.fetchAllJobCodeAddressList({
        commGrpIdList: bbCommGrpIdList,
        jobGrpIdList: bbJobGrpIdList,
        jobIdList: bbJobIdList,
      })
    );
  };

  const handleClickMailAddressDetailButton = async () => {
    const { mailAddrList } = props;
    if (mailAddrList.length !== arrayUnique(mailAddrList).length) {
      setIsForceErrorMailAddrList(true);
      props.touch(FORM_NAME, "Mail.mailAddrList");
      void dispatch(broadcastActions.showMessage(SoalaMessage.M50020C({ items: mailAddrList })));
      return;
    }
    if (mailAddrList.filter((address) => !validates.isEmailAddress(address)).length) {
      setIsForceErrorMailAddrList(true);
      props.touch(FORM_NAME, "Mail.mailAddrList");
      void dispatch(broadcastActions.showMessage(SoalaMessage.M50014C()));
      return;
    }
    await fetchAllMailAddressList();
    dispatch(emailActions.openMailAddressDetailModal());
  };

  const handleClickNtfAddressDetailButton = () => {
    const { ntfCommGrpIdList, ntfJobGrpIdList, ntfJobIdList } = props;
    dispatch(notificationActions.openNotificationAddressDetailModal());
    void dispatch(
      addressActions.fetchAllJobCodeAddressList({
        commGrpIdList: ntfCommGrpIdList,
        jobGrpIdList: ntfJobGrpIdList,
        jobIdList: ntfJobIdList,
      })
    );
  };

  const handleChangeMailAddrGrpIdList = () => {
    setIsForceErrorMailAddrGrpIdList(false);
  };

  const handleChangeMailAddrList = () => {
    setIsForceErrorMailAddrList(false);
  };

  const handleChangeEmailCcSenderAddress = () => {
    const { ccSenderAddressChecked } = props.mail;
    storageOfUser.setBroadcastEmailCCSenderAddressChecked({ checked: !ccSenderAddressChecked });
  };

  const handleChangeTtyCcSenderAddress = () => {
    const { ccSenderAddressChecked } = props.tty;
    storageOfUser.setBroadcastTtyCCSenderAddressChecked({ checked: !ccSenderAddressChecked });
  };

  const handleChangeTtyDivisionSending = () => {
    const { divisionSendingChecked } = props.tty;
    storageOfUser.setBroadcastTtyDivisionSendingChecked({ checked: !divisionSendingChecked });
  };

  const handleChangeTtyAddrGrpIdList = () => {
    setIsForceErrorTtyAddrGrpIdList(false);
  };

  const handleChangeTtyAddrList = () => {
    setIsForceErrorTtyAddrList(false);
  };

  const handleCloseFlightLegSearchModal = () => dispatch(bulletinBoardActions.closeFlightLegSearchModal());

  const handleCloseMailAddressDetailModal = () => dispatch(emailActions.closeMailAddressDetailModal());

  const handleCloseBbAddressDetailModal = () => dispatch(bulletinBoardActions.closeBbAddressDetailModal());

  const handleCloseTtyAddressDetailModal = () => dispatch(ttyActions.closeTtyAddressDetailModal());

  const handleCloseNotificationAddressDetailModal = () => dispatch(notificationActions.closeNotificationAddressDetailModal());

  const renderModals = (): ReactNode => {
    const {
      addressJobCdList,
      ttyAddrDetails,
      mailAddrDetails,
      isOpenSaveAsModal,
      isOpenFlightLegSearchModal,
      isOpenSearchFilterModal,
      isOpenTemplateNameEditModal,
      isOpenBbAddressDetailModal,
      isOpenMailAddressDetailModal,
      isOpenTtyAddressDetailModal,
      isOpenNotificationAddressDetailModal,
    } = props;

    return (
      <>
        <TemplateFilterModal
          isOpen={isOpenSearchFilterModal}
          onRequestClose={handleCloseSearchFilterModal}
          onKeywordKeyPress={handleKeywordKeyPress}
          onClickClear={handleClearFilter}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClickFilter={applyModalFilter}
        />
        <TemplateNameEditModal
          isOpen={isOpenSaveAsModal}
          onRequestClose={handleCloseSaveAsModal}
          onTemplateNameKeyPress={handleTemplateNameKeyPress}
          onClickCancel={handleCloseSaveAsModal}
          onClickSave={handleSubmitNewTemplate}
        />

        <TemplateNameEditModal
          isOpen={isOpenTemplateNameEditModal}
          onRequestClose={handleCloseTemplateNameEditModal}
          onTemplateNameKeyPress={handleTemplateNameEditKeyPress}
          onClickCancel={handleCloseTemplateNameEditModal}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClickSave={handleSubmitTemplateName}
        />

        <FlightLegSearchModal
          isOpen={isOpenFlightLegSearchModal}
          onClickFlightLeg={handleClickFlightLegButton}
          handleClose={handleCloseFlightLegSearchModal}
        />

        <DetailModal
          header="Job Code Detail"
          style={styles.jobCodeModal}
          isOpen={isOpenBbAddressDetailModal}
          onRequestClose={handleCloseBbAddressDetailModal}
          isPc={storage.isPc}
          data={addressJobCdList}
          // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          DetailComponent={(prop) => <JobCodeDetail key={prop.row}>{prop.row}</JobCodeDetail>}
        />

        <DetailModal
          header="e-mail Address Detail"
          style={styles.emailModal}
          isOpen={isOpenMailAddressDetailModal}
          onRequestClose={handleCloseMailAddressDetailModal}
          isPc={storage.isPc}
          data={mailAddrDetails}
          // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          DetailComponent={(prop) => <EmailDetail key={prop.row}>{prop.row}</EmailDetail>}
        />

        <DetailModal
          header="TTY Address Detail"
          style={styles.ttyAddressModal}
          isOpen={isOpenTtyAddressDetailModal}
          onRequestClose={handleCloseTtyAddressDetailModal}
          isPc={storage.isPc}
          data={ttyAddrDetails}
          // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          DetailComponent={(prop) => <TtyDetail key={prop.row}>{prop.row}</TtyDetail>}
        />

        <DetailModal
          header="Job Code Detail"
          style={styles.jobCodeModal}
          isOpen={isOpenNotificationAddressDetailModal}
          onRequestClose={handleCloseNotificationAddressDetailModal}
          isPc={storage.isPc}
          data={addressJobCdList}
          // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          DetailComponent={(prop) => <JobCodeDetail key={prop.row}>{prop.row}</JobCodeDetail>}
        />
      </>
    );
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    loading,
    bbAttachments,
    canManageBb,
    canManageEmail,
    canManageTty,
    canManageAftn,
    canManageAcars,
    canManageNotification,
    emailAttachments,
    mailAddrGrpIdList,
    mailAddrList,
    ttyAddrGrpIdList,
    ttyAddrList,
    isTemplateFiltered,
    change,
  } = props;

  const { isPc } = storage;

  return (
    <Wrapper>
      <Form isPc={isPc}>
        {isEditMode() ? null : (
          <Left>
            <TemplateJobcodeSearch onChangeJobCode={handleChangeJobCode} jobOption={props.jobOptionForTemplate} />
            <TemplateFilter
              onFilterKeyPress={handleFilterKeyPress}
              onChangeFilter={handleChangeFilter}
              filter={filter}
              onClickTemplateFilter={handleClickTemplateFilter}
              applyFilter={() => (isTemplateFiltered ? handleClearFilter() : handleApplyFilter())}
              isNameActive={isName()}
              onClickNameFilterTab={() => handleClickFilterTab(FilterTabName.name)}
              isRecentlyActive={isRecently()}
              onClickRecentlyFilterTab={() => handleClickFilterTab(FilterTabName.recently)}
            />

            <TemplateList
              id={template.id}
              onClickEdit={handleClickTemplateNameEdit}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickDelete={handleDeleteTemplate}
              onClickTemplate={handleClickTemplate}
            />
          </Left>
        )}
        <Right>
          <RightContainer>
            <Tabs
              isBbActive={isBb()}
              isEmailActive={isEmail()}
              isTtyActive={isTty()}
              isAftnActive={isAftn()}
              isNotificationActive={isNotification()}
              isAcarsActive={isAcars()}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickBb={() => handleChangeTab(TabName.bb, false)}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickEmail={() => handleChangeTab(TabName.email, isEditMode())}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickTty={() => handleChangeTab(TabName.tty, isEditMode())}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickAftn={() => handleChangeTab(TabName.aftn, isEditMode())}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickNotification={() => handleChangeTab(TabName.notification, isEditMode())}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickAcars={() => handleChangeTab(TabName.acars, isEditMode())}
              emailDisabled={isEditMode()}
              ttyDisabled={isEditMode()}
              aftnDisabled={isEditMode()}
              notificationDisabled={isEditMode()}
              acarsDisabled={isEditMode()}
              reloadButtonDisabled={isEditMode()}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClickReload={handleClickReload}
              isFetching={loading}
              myApoCd={jobAuthUser.myApoCd}
            />
            {canManageBb && (
              <BroadcastBulletinBoard
                isActive={isBb()}
                bbFlightLeg={props.bbFlightLeg}
                bbAttachments={bbAttachments}
                onClickFlightLegField={handleClickFlightLegField}
                onClickAddressDetailButton={handleClickBbAddressDetailButton}
                onUploadFiles={(uploadFiles) => props.change("BB.attachments", [...bbAttachments, ...uploadFiles])}
                onRemoveFile={(index) =>
                  props.change(
                    "BB.attachments",
                    Array.from(bbAttachments).filter((_, i) => i !== index)
                  )
                }
                onClickExpiryDateField={handleClickExpiryDate}
              />
            )}
            {!isBbEdit() && canManageEmail && (
              <BroadcastEmail
                isActive={isEmail()}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClickAddressDetail={handleClickMailAddressDetailButton}
                emailAttachments={emailAttachments}
                onUploadFiles={(uploadFiles) => props.change("Mail.attachments", [...emailAttachments, ...uploadFiles])}
                onRemoveFile={(index) =>
                  props.change(
                    "Mail.attachments",
                    Array.from(emailAttachments).filter((_, i) => i !== index)
                  )
                }
                mailAddrGrpIdList={mailAddrGrpIdList}
                mailAddrList={mailAddrList}
                isForceErrorMailAddrGrpIdList={isForceErrorMailAddrGrpIdList}
                isForceErrorMailAddrList={isForceErrorMailAddrList}
                onChangeMailAddrGrpIdList={handleChangeMailAddrGrpIdList}
                onChangeMailAddrList={handleChangeMailAddrList}
                onChangeCcSenderAddress={handleChangeEmailCcSenderAddress}
                change={change}
              />
            )}
            {!isBbEdit() && canManageTty && (
              <BroadcastTty
                isActive={isTty()}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClickAddressDetailButton={handleClickTtyAddressDetailButton}
                ttyAddrGrpIdList={ttyAddrGrpIdList}
                ttyAddrList={ttyAddrList}
                isForceErrorTtyAddrGrpIdList={isForceErrorTtyAddrGrpIdList}
                isForceErrorTtyAddrList={isForceErrorTtyAddrList}
                onChangeTtyAddrGrpIdList={handleChangeTtyAddrGrpIdList}
                onChangeTtyAddrList={handleChangeTtyAddrList}
                onChangeCcSenderAddress={handleChangeTtyCcSenderAddress}
                onChangeDivisionSending={handleChangeTtyDivisionSending}
                change={change}
              />
            )}
            {!isBbEdit() && canManageAftn && <BroadcastAftn isActive={isAftn()} />}
            {!isBbEdit() && canManageAcars && <BroadcastAcars isActive={isAcars()} />}
            {!isBbEdit() && canManageNotification && (
              <BroadcastNotification isActive={isNotification()} onClickAddressDetailButton={handleClickNtfAddressDetailButton} />
            )}
          </RightContainer>
          <RightFooter>
            <FooterButtonGroup>
              {isEditMode() || isApplyingOtherJobCdTemplate() ? null : (
                <>
                  <PrimaryButton text="Save As" type="button" onClick={handleClickSaveAs} />
                  <PrimaryButton text="Save" type="button" onClick={handleSubmitTemplate} disabled={!template.id} />
                </>
              )}
            </FooterButtonGroup>
            <FooterButtonGroup>
              {isEditMode() ? (
                <SecondaryButton text="Cancel" type="button" onClick={handleClickCancel} />
              ) : (
                <SecondaryButton text="Clear" type="button" onClick={handleClickClear} />
              )}
              <PrimaryButton text="Send" type="button" onClick={handleClickSend} />
            </FooterButtonGroup>
          </RightFooter>
        </Right>
        {renderModals()}
      </Form>
      <EventListener
        eventHandlers={[
          { target: window, type: "dragover", listener: (e) => e.preventDefault(), options: false },
          {
            target: window,
            type: "drop",
            listener: (e) => {
              e.preventDefault();
              e.stopPropagation();
            },
            options: false,
          },
        ]}
      />
    </Wrapper>
  );
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
`;

const Left = styled.div`
  width: 270px;
  padding: 10px;
  display: flex;
  flex-flow: column nowrap;
`;

const Right = styled.div`
  width: 746px;
  margin-right: 10px;
  display: flex;
  flex-flow: column nowrap;
`;

const RightContainer = styled.div`
  position: relative;
  padding-top: 10px;
  flex: 1;
  -webkit-overflow-scrolling: touch;
`;

export const RightContent = styled.div<{ disabled: boolean; isPc: boolean; isActive: boolean }>`
  position: absolute;
  top: 54px;
  z-index: ${({ isActive }) => (isActive ? "2" : "1")};
  width: 100%;
  height: calc(
    100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 10px - 44px - 16px - 44px
  );
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 16px;
  margin-top: -1px;
  border: 1px solid #595857;
  background: ${(props) => (props.disabled ? "#C9D3D0" : "#FFF")};
`;

const Forms = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Row = styled.div<{ marginBottom?: number | string; width?: number }>`
  width: ${(props) => props.width || ROW_WIDTH}px;
  margin-bottom: ${(props) => (props.marginBottom === undefined ? "9px" : props.marginBottom)};
`;
export const Flex = styled.div<{ width?: number; position?: string; alignItems?: string }>`
  display: flex;
  justify-content: ${(props) => props.position || "space-between"};
  align-items: ${(props) => props.alignItems || "center"};
  width: ${(props) => (props.width ? `${props.width}px` : "auto")};
`;

export const Col = styled(Forms)<{ width: number }>`
  width: ${(props) => props.width}px;
`;

export const Label = styled.div`
  margin-bottom: 3px;
  font-size: 12px;
  width: 100%;
`;

export const TextAreaContainer = styled.div<{ isPc: boolean; height?: number }>`
  width: 100%;
  textarea {
    min-height: ${(props) => props.height || 170}px;
    padding: 10px 6px;
  }
`;

export const TextAreaContainerFixed = styled.div<{ isPc: boolean; height?: number }>`
  width: 100%;
  textarea {
    min-height: ${(props) => props.height || 170}px;
    padding: 10px 6px;
    font-family: Consolas, "Courier New", Courier, Monaco, monospace;
  }
`;

export const Ruler = styled.span<{ isPc: boolean }>`
  font-family: Consolas, "Courier New", Courier, Monaco, monospace;
  font-size: 16px;
  line-height: 1.2;
  margin-left: ${({ isPc }) => (isPc ? "7px" : "10px")};
`;

export const ModalButtonGroup = styled.div<{ margin?: string }>`
  display: flex;
  width: 75%;
  margin: ${(props) => props.margin || "25px auto"};
  justify-content: space-around;
  > button {
    align-self: flex-end;
    width: 120px;
  }
`;

export const CheckBoxContainer = styled(Col)<{ height?: number }>`
  align-self: flex-end;
  ${({ height }) => (height !== undefined ? `height: ${height}px;` : "")}
`;

export const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  line-height: 44px;
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
    background: #fff;
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
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
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

const FooterButtonGroup = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-around;
  > button {
    align-self: flex-end;
    width: 120px;
  }
`;

const JobCodeDetail = styled.div`
  width: 168px;
  min-height: 44px;
  padding: 8px;
  margin: 5px 10px;
  display: flex;
  align-items: center;
  font-size: 17px;
  background: #f6f6f6;
  border-radius: 1px;
  border: 1px solid #c9d3d0;
  text-align: left;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-all;
`;

const EmailDetail = styled(JobCodeDetail)`
  width: 338px;
`;

const TtyDetail = styled(JobCodeDetail)`
  margin: 5px;
  width: 136px;
`;

export const selector = formValueSelector(FORM_NAME);
const mapStateToProps = (state: RootState) => {
  const {
    common: {
      headerInfo: { apoTimeLcl },
    },
    account: {
      jobAuth: { user, jobAuth },
      master: { jobs, cdCtrlDtls },
    },
    broadcast,
  } = state;
  const {
    Broadcast: {
      canManageBb,
      canManageEmail,
      canManageTty,
      canManageAftn,
      canManageNotification,
      canManageAcars,
      isOpenSaveAsModal,
      isOpenSearchFilterModal,
      isTemplateFiltered,
      templates,
      isOpenTemplateNameEditModal,
      fetchingAll,
    },
    BulletinBoard: {
      flightLegs,
      isFlightLegEnabled,
      isOpenFlightLegSearchModal,
      fetchingAllFlightLeg,
      isOpenBbAddressDetailModal,
      detail,
      newBbId,
    },
    Email: { isOpenMailAddressDetailModal },
    Tty: { isOpenTtyAddressDetailModal },
    Notification: { isOpenNotificationAddressDetailModal },
  } = broadcast;
  const userJobResult = jobs.find(({ jobCd }) => jobCd === user.jobCd);
  const jobIdList = userJobResult ? [userJobResult.jobId] : [];
  const expiryDateInitialValue = apoTimeLcl ? dayjs(apoTimeLcl).add(2, "day").format("YYYY-MM-DD") : "";
  const initialValues = {
    templateJobCd: user.jobCd,
    filterTabName: FilterTabName.name,
    tabName: canManageBb
      ? TabName.bb
      : canManageEmail
      ? TabName.email
      : canManageTty
      ? TabName.tty
      : canManageAftn
      ? TabName.aftn
      : canManageNotification
      ? TabName.notification
      : canManageAcars
      ? TabName.acars
      : null,
    keyword: "",
    isFlightLegEnabled: false,
    BB: {
      catCdList: [],
      commGrpIdList: [],
      jobGrpIdList: [],
      jobIdList,
      bbTitle: "",
      bbText: "",
      flightLeg: {},
      attachments: [],
      expiryDate: expiryDateInitialValue,
    },
    Mail: {
      mailAddrGrpIdList: [],
      mailAddrList: [],
      orgnMailAddr: user.mailAddr,
      mailTitle: "",
      mailText: "",
      attachments: [],
    },
    Tty: {
      ttyAddrGrpIdList: [],
      ttyAddrList: [],
      ttyPriorityCd: "QU",
      orgnTtyAddr: user.ttyAddr,
      ttyText: "",
    },
    Aftn: {
      priority: "QU",
      originator: user.ttyAddr,
      aftnText: "",
    },
    Notification: {
      commGrpIdList: [],
      jobGrpIdList: [],
      jobIdList,
      ntfTitle: "",
      ntfText: "",
      soundFlg: true,
    },
    Acars: {
      shipNoList: [],
      orgnTtyAddr: user.ttyAddr,
      uplinkText: "",
      reqAckFlg: false,
    },
  };
  const jobOption = jobs.map((job) => createOption(job.jobId, job.jobCd, job.jobCd === user.jobCd));
  const addressJobList = state.address.jobList;
  const jobOptionForTemplate = jobs.map((job) => ({ value: job.jobCd, label: job.jobCd }));
  const jobMap = jobs.reduce((result, job) => result.set(job.jobCd, job.jobId), new Map<string, number>());

  return {
    jobAuthUser: user,
    apoTimeLcl,
    jobAuth,
    cdCtrlDtls,
    canManageBb,
    canManageEmail,
    canManageTty,
    canManageAftn,
    canManageNotification,
    canManageAcars,
    jobOption,
    jobOptionForTemplate,
    jobMap,
    initialValues,
    loading:
      fetchingAll ||
      broadcast.BulletinBoard.fetchingBb ||
      broadcast.BulletinBoard.fetching ||
      broadcast.BulletinBoard.fetchingAllFlightLeg ||
      broadcast.Email.fetching ||
      broadcast.Tty.fetching ||
      broadcast.Aftn.fetching ||
      broadcast.Acars.fetching ||
      broadcast.Notification.fetching,
    loadingTemplate:
      fetchingAll ||
      broadcast.BulletinBoard.fetching ||
      broadcast.Email.fetching ||
      broadcast.Tty.fetching ||
      broadcast.Aftn.fetching ||
      broadcast.Acars.fetching ||
      broadcast.Notification.fetching,
    bulletinBoardTemplate: broadcast.BulletinBoard.template as Broadcast.Bb.Template,
    emailTemplate: broadcast.Email.template as Broadcast.Email.Template,
    ttyTemplate: broadcast.Tty.template as Broadcast.Tty.Template,
    aftnTemplate: broadcast.Aftn.template as Broadcast.Aftn.Template,
    notificationTemplate: broadcast.Notification.template as Broadcast.Ntf.Template,
    acarsTemplate: broadcast.Acars.template as unknown as Broadcast.Acars.Template,
    isOpenSaveAsModal,
    isOpenFlightLegSearchModal,
    isOpenSearchFilterModal,
    isOpenTemplateNameEditModal,
    isOpenFlightNumberInputPopup: state.flightNumberInputPopup.isOpen,
    isOpenBbAddressDetailModal,
    isOpenMailAddressDetailModal,
    isOpenTtyAddressDetailModal,
    isOpenNotificationAddressDetailModal,
    addressJobCdList: orderBy(addressJobList.map((job) => job.jobCd)),
    flightLegs,
    isFlightLegEnabled,
    isTemplateFiltered,
    fetchingAllFlightLeg,
    fetchingBulletinBoard: broadcast.BulletinBoard.fetching,
    fetchingEmail: broadcast.Email.fetching,
    fetchingTty: broadcast.Tty.fetching,
    fetchingAftn: broadcast.Aftn.fetching,
    fetchingNotification: broadcast.Notification.fetching,
    fetchingAcars: broadcast.Acars.fetching,
    fetchingBb: broadcast.BulletinBoard.fetchingBb,
    templateJobCd: selector(state, "templateJobCd") as string,
    filterTabName: selector(state, "filterTabName") as FilterTabName,
    tabName: selector(state, "tabName") as TabName | null,
    bbAttachments: selector(state, "BB.attachments") as UploadedFile[],
    emailAttachments: selector(state, "Mail.attachments") as UploadedFile[],
    bbCommGrpIdList: selector(state, "BB.commGrpIdList") as number[],
    bbJobGrpIdList: selector(state, "BB.jobGrpIdList") as number[],
    bbJobIdList: selector(state, "BB.jobIdList") as number[],
    templates,
    keyword: selector(state, "keyword") as string,
    sendBy: selector(state, "sendBy") as string,
    alCd: (selector(state, "alCd") as string) || "",
    bbFlightLeg: (selector(state, "BB.flightLeg") as FlightLeg) || ({} as FlightLeg),
    bbCategories: (selector(state, "BB.catCdList") as string[]) || [],
    mailAddrGrpIdList: (selector(state, "Mail.mailAddrGrpIdList") as never[]) || [],
    mailAddrList: (selector(state, "Mail.mailAddrList") as never[]) || [],
    orgnMailAddr: selector(state, "Mail.orgnMailAddr") as string,
    ttyAddrGrpIdList: (selector(state, "Tty.ttyAddrGrpIdList") as never[]) || [],
    ttyAddrList: (selector(state, "Tty.ttyAddrList") as never[]) || [],
    ntfCommGrpIdList: (selector(state, "Notification.commGrpIdList") as number[]) || [],
    ntfJobGrpIdList: (selector(state, "Notification.jobGrpIdList") as number[]) || [],
    ntfJobIdList: (selector(state, "Notification.jobIdList") as number[]) || [],
    templateName: (selector(state, "templateName") as string) || "",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    bb: selector(state, "BB") || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mail: selector(state, "Mail") || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tty: selector(state, "Tty") || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    aftn: selector(state, "Aftn") || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    notification: selector(state, "Notification") || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    acars: selector(state, "Acars") || {},
    templateId: selector(state, "templateId") as number,
    bbTemplateId: (selector(state, "BB.templateId") as number) || null,
    mailTemplateId: (selector(state, "Mail.templateId") as number) || null,
    ttyTemplateId: (selector(state, "Tty.templateId") as number) || null,
    aftnTemplateId: (selector(state, "Aftn.templateId") as number) || null,
    notificationTemplateId: (selector(state, "Notification.templateId") as number) || null,
    acarsTemplateId: (selector(state, "Acars.templateId") as number) || null,
    displayDate: (selector(state, "displayDate") as string) || "",
    detail: detail as Broadcast.Bb.BulletinBoard,
    ttyAddrDetails: orderBy(state.address.ttyAddrList),
    mailAddrDetails: orderBy(state.address.mailAddrList),
    newBbId,
    bbExpiryDate: (selector(state, "BB.expiryDate") as string) || "",
    expiryDateInitialValue,
    broadcastType: (selector(state, "broadcastType") as BroadcastType) || "",
  };
};

export interface initialValues {
  templateJobCd: string;
  filterTabName: FilterTabName;
  tabName: TabName | null;
  keyword: string;
  isFlightLegEnabled: boolean;
  BB: {
    catCdList: never[];
    commGrpIdList: never[];
    jobGrpIdList: never[];
    jobIdList: number[];
    bbTitle: string;
    bbText: string;
    flightLeg: Record<string, unknown>;
    attachments: never[];
    expiryDate: string;
  };
  Mail: {
    mailAddrGrpIdList: never[];
    mailAddrList: string[];
    orgnMailAddr: string;
    mailTitle: string;
    mailText: string;
    attachments: never[];
  };
  Tty: {
    ttyAddrGrpIdList: never[];
    ttyAddrList: string[];
    ttyPriorityCd: string;
    orgnTtyAddr: string;
    ttyText: string;
  };
  Aftn: {
    priority: string;
    originator: string;
    aftnText: string;
  };
  Notification: {
    commGrpIdList: never[];
    jobGrpIdList: never[];
    jobIdList: number[];
    ntfTitle: string;
    ntfText: string;
    soundFlg: boolean;
  };
  Acars: {
    shipNoList: never[];
    orgnTtyAddr: string;
    uplinkText: string;
    reqAckFlg: boolean;
  };
}

export interface BroadcastFormParams {
  templateJobCd: string;
  keyword?: string;
  sendBy?: string;
  date: string;
  BB: BroadcastBbFormParams;
  Mail: BroadcastMailFormParams;
  Tty: BroadcastTtyFormParams;
  Aftn: BroadcastAftnFormParams;
  Notification: BroadcastNotificationFormParams;
  Acars: BroadcastAcarsFormParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastBbFormParams {
  catCdList: string[];
  flightLeg: object;
  commGrpIdList: number[];
  jobGrpIdList: number[];
  jobIdList: number[];
  bbTitle: string;
  expiryDate: string;
  bbText: string;
  attachments: UploadedFile[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastMailFormParams {
  mailAddrGrpIdList: number[];
  mailAddrList: string[];
  orgnMailAddr: string;
  mailTitle: string;
  mailText: string;
  attachments: UploadedFile[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastTtyFormParams {
  ttyAddrGrpIdList: number[];
  ttyAddrList: string[];
  ttyPriorityCd: string;
  orgnTtyAddr: string;
  ttyText: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastAftnFormParams {
  priority: string;
  originator: string;
  aftnText: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastNotificationFormParams {
  commGrpIdList: number[];
  jobGrpIdList: number[];
  jobIdList: number[];
  ntfTitle: string;
  ntfText: string;
  soundFlg: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastAcarsFormParams {
  shipNoList: string[];
  orgnTtyAddr: string;
  uplinkText: string;
  reqAckFlg: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TemplateNameFormParams {
  templateName: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BroadcastFormErrors {
  BB: FormErrors<BroadcastBbFormParams>;
  Mail: FormErrors<BroadcastMailFormParams>;
  Tty: FormErrors<BroadcastTtyFormParams>;
  Aftn: FormErrors<BroadcastAftnFormParams>;
  Notification: FormErrors<BroadcastNotificationFormParams>;
  Acars: FormErrors<BroadcastAcarsFormParams>;
  templateName: FormErrors<TemplateNameFormParams>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: FormErrors<any>;
}

const BroadcastForm = reduxForm<BroadcastFormParams, Props>({
  form: FORM_NAME,
  enableReinitialize: true,
})(Broadcast);

export default connect(mapStateToProps)(BroadcastForm);
