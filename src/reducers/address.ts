import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { AppDispatch } from "../store/storeType";

interface AddressState {
  jobList: AddressJobApi.Response["jobList"];
  ttyAddrList: AddressTtyApi.Response["ttyAddrList"];
  mailAddrList: AddressMailApi.Response["mailAddrList"];
  fetchingAllJobCodeAddress: boolean;
  fetchingAllTtyAddress: boolean;
  fetchingAllMailAddress: boolean;
}

export const initialState: AddressState = {
  fetchingAllJobCodeAddress: false,
  jobList: [],
  fetchingAllTtyAddress: false,
  ttyAddrList: [],
  fetchingAllMailAddress: false,
  mailAddrList: [],
};

export const fetchAllJobCodeAddressList = createAsyncThunk<AddressJobApi.Response | null, AddressJobApi.Request, { dispatch: AppDispatch }>(
  "address/fetchAllJobCodeAddressList",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestJobCodeAddressList());
    try {
      const response = await WebApi.postAddressJob(dispatch, arg);
      const { data } = response;
      dispatch(slice.actions.successJobCodeAddressList({ data }));
      return response.data;
    } catch (error) {
      dispatch(slice.actions.failureJobCodeAddressList());
      return null;
    }
  }
);

export const fetchAllTtyAddressList = createAsyncThunk<AddressTtyApi.Response | null, AddressTtyApi.Request, { dispatch: AppDispatch }>(
  "address/fetchAllTtyAddressList",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestTtyAddressList());
    try {
      const response = await WebApi.postAddressTty(dispatch, arg);
      const { data } = response;
      dispatch(slice.actions.successTtyAddressList({ data }));
      return response.data;
    } catch (error) {
      dispatch(slice.actions.failureTtyAddressList());
      return null;
    }
  }
);

export const fetchAllMailAddressList = createAsyncThunk<AddressMailApi.Response | null, AddressMailApi.Request, { dispatch: AppDispatch }>(
  "address/fetchAllMailAddressList",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestMailAddressList());
    try {
      const response = await WebApi.postAddressMail(dispatch, arg);
      const { data } = response;
      dispatch(slice.actions.successMailAddressList({ data }));
      return response.data;
    } catch (e) {
      dispatch(slice.actions.failureMailAddressList());
      return null;
    }
  }
);

export const slice = createSlice({
  name: "address",
  initialState,
  reducers: {
    requestMailAddressList: (state) => {
      state.fetchingAllMailAddress = true;
    },
    successMailAddressList: (state, action: PayloadAction<{ data: AddressMailApi.Response }>) => {
      const { mailAddrList } = action.payload.data;
      state.fetchingAllMailAddress = false;
      state.mailAddrList = mailAddrList;
    },
    failureMailAddressList: (state) => {
      state.fetchingAllMailAddress = false;
    },
    requestTtyAddressList: (state) => {
      state.fetchingAllTtyAddress = true;
    },
    successTtyAddressList: (state, action: PayloadAction<{ data: AddressTtyApi.Response }>) => {
      state.fetchingAllTtyAddress = false;
      state.ttyAddrList = action.payload.data.ttyAddrList;
    },
    failureTtyAddressList: (state) => {
      state.fetchingAllTtyAddress = false;
    },
    requestJobCodeAddressList: (state) => {
      state.fetchingAllJobCodeAddress = true;
    },
    successJobCodeAddressList: (state, action: PayloadAction<{ data: AddressJobApi.Response }>) => {
      state.fetchingAllJobCodeAddress = false;
      state.jobList = action.payload.data.jobList;
    },
    failureJobCodeAddressList: (state) => {
      state.fetchingAllJobCodeAddress = false;
    },
  },
});

export default slice.reducer;
