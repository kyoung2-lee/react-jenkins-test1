import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { setSubmitFailed } from "redux-form";
import { RootState, AppDispatch } from "../store/storeType";

import { WebApi } from "../lib/webApi";
import { NotificationCreator } from "../lib/notifications";
import { getHeaderInfo } from "./common";

export const showMessage = createAsyncThunk<void, { message: NotificationCreator.Message }, { dispatch: AppDispatch; state: RootState }>(
  "issueSecurity/showMessage",
  (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message });
  }
);

export const getAirportIssue = createAsyncThunk<void, { apoCd: string }, { dispatch: AppDispatch; state: RootState }>(
  "issueSecurity/getAirportIssue",
  async (arg, thunkAPI) => {
    const { apoCd } = arg;
    const { dispatch } = thunkAPI;
    dispatch(fetchAirportIssue());
    try {
      const response = await WebApi.getAirportIssue(dispatch, { apoCd });
      dispatch(fetchAirportIssueSucsess(response.data));
    } catch (err) {
      dispatch(fetchAirportIssueFailure());
    }
  }
);

export const updateSendAirportIssue = createAsyncThunk<
  void,
  {
    params: AirportIssue.RequestPost;
    apoCd: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("issueSecurity/updateSendAirportIssue", async (arg, thunkAPI) => {
  const { params, apoCd } = arg;
  const { dispatch } = thunkAPI;
  try {
    await WebApi.postAirportIssue(dispatch, params);
    dispatch(setLastUpdateSendAirportIssueRequest(params));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    dispatch(getHeaderInfo({ apoCd }));
  } catch (err) {
    // 何もしない
  }
});

export const saveTemplate = createAsyncThunk<void, AirportIssue.IssuTemplate, { dispatch: AppDispatch; state: RootState }>(
  "issueSecurity/saveTemplate",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      await WebApi.postAirportIssueTemplate(dispatch, arg);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dispatch(getAirportIssue({ apoCd: arg.apoCd }));
    } catch (err) {
      // 何もしない
    }
  }
);

export const getMailAddress = createAsyncThunk<
  AddressMailApi.Response | undefined,
  {
    params: AddressMailApi.Request;
    showModal?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("issueSecurity/getMailAddress", async (arg, thunkAPI) => {
  const { params, showModal = true } = arg;
  const { dispatch } = thunkAPI;
  if (showModal) {
    dispatch(showEmailModal());
  }
  try {
    const response = await WebApi.postAddressMail(dispatch, params);
    dispatch(fetchMailAddressSucsess(response.data));
    return response.data;
  } catch (err) {
    dispatch(fetchMailAddressFailure());
    return undefined;
  }
});

export const getTtyAddress = createAsyncThunk<
  AddressTtyApi.Response | undefined,
  {
    params: AddressTtyApi.Request;
    showModal?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("issueSecurity/getTtyAddress", async (arg, thunkAPI) => {
  const { params, showModal = true } = arg;
  const { dispatch } = thunkAPI;
  if (showModal) {
    dispatch(showTtyModal());
  }
  try {
    const response = await WebApi.postAddressTty(dispatch, params);
    dispatch(fetchTtyAddressSucsess(response.data));
    return response.data;
  } catch (err) {
    dispatch(fetchTtyAddressFailure());
    return undefined;
  }
});

export const submitFailedField = createAsyncThunk<void, { fields: string[] }, { dispatch: AppDispatch; state: RootState }>(
  "issueSecurity/submitfailedField",
  ({ fields }, { dispatch }) => {
    dispatch(setSubmitFailed("issueSecurity", ...fields));
  }
);

// state
export interface IssueSecurityState {
  isFetching: boolean;
  isEmailModalActive: boolean;
  isTtyModalActive: boolean;
  airportIssue: AirportIssue;
  mailAddrList: string[];
  ttyAddrList: string[];
  lastUpdateSendAirportIssueRequest?: AirportIssue.RequestPost;
  checkHasDifference: () => boolean;
}

interface AirportIssue {
  now: string;
  mailAddrGrpList: option[];
  ttyAddrGrpList: option[];
  issuTemplateList: AirportIssue.IssuTemplate[];
}

interface option {
  label: string;
  value: string;
}

const initialState: IssueSecurityState = {
  isFetching: false,
  isEmailModalActive: false,
  isTtyModalActive: false,
  airportIssue: {
    now: "",
    mailAddrGrpList: [],
    ttyAddrGrpList: [],
    issuTemplateList: [],
  },
  mailAddrList: [],
  ttyAddrList: [],
  lastUpdateSendAirportIssueRequest: undefined,
  checkHasDifference: () => false,
};

export const slice = createSlice({
  name: "issueSecurity",
  initialState,
  reducers: {
    showEmailModal: (state) => {
      state.isEmailModalActive = true;
    },
    hideEmailModal: (state) => {
      state.isEmailModalActive = false;
      state.mailAddrList = [];
    },
    showTtyModal: (state) => {
      state.isTtyModalActive = true;
    },
    hideTtyModal: (state) => {
      state.isTtyModalActive = false;
      state.ttyAddrList = [];
    },
    fetchAirportIssue: (state) => {
      state.isFetching = true;
    },
    fetchAirportIssueSucsess: (state, action: PayloadAction<AirportIssue.Response>) => {
      const { now, mailAddrGrpList = [], ttyAddrGrpList = [], issuTemplateList = [] } = action.payload;
      state.airportIssue = {
        now,
        mailAddrGrpList: mailAddrGrpList
          ? mailAddrGrpList
              .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
              .map((ttyAddrGrp) => ({ label: `${ttyAddrGrp.addrGrpCd}`, value: `${ttyAddrGrp.addrGrpId}` }))
          : [],
        ttyAddrGrpList: ttyAddrGrpList
          ? ttyAddrGrpList
              .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
              .map((ttyAddrGrp) => ({ label: `${ttyAddrGrp.addrGrpCd}`, value: `${ttyAddrGrp.addrGrpId}` }))
          : [],
        issuTemplateList,
      };
      state.isFetching = false;
    },
    fetchAirportIssueFailure: (state) => {
      state.isFetching = false;
    },
    fetchMailAddressSucsess: (state, action: PayloadAction<AddressMailApi.Response>) => {
      const { mailAddrList } = action.payload;
      state.mailAddrList = mailAddrList;
    },
    fetchMailAddressFailure: (_state) => {},
    fetchTtyAddressSucsess: (state, action: PayloadAction<AddressTtyApi.Response>) => {
      const { ttyAddrList } = action.payload;
      state.ttyAddrList = ttyAddrList;
    },
    fetchTtyAddressFailure: (_state) => {},
    setLastUpdateSendAirportIssueRequest: (state, action: PayloadAction<AirportIssue.RequestPost>) => {
      state.lastUpdateSendAirportIssueRequest = action.payload;
    },
    setCheckHasDifference: (state, action: PayloadAction<{ data: () => boolean }>) => {
      const { data } = action.payload;
      state.checkHasDifference = data;
    },
  },
});

export const {
  showEmailModal,
  hideEmailModal,
  showTtyModal,
  hideTtyModal,
  fetchAirportIssue,
  fetchAirportIssueSucsess,
  fetchAirportIssueFailure,
  fetchMailAddressSucsess,
  fetchMailAddressFailure,
  fetchTtyAddressSucsess,
  fetchTtyAddressFailure,
  setLastUpdateSendAirportIssueRequest,
  setCheckHasDifference,
} = slice.actions;

export default slice.reducer;
