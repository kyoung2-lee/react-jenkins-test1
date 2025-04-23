"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterSpotFilterModal = exports.closeSpotFilterModal = exports.openSpotFilterModal = exports.slice = exports.showConfirmation = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
exports.showConfirmation = (0, toolkit_1.createAsyncThunk)("SpotFilterModal/showConfirmation", (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: onClickYes }) });
});
const initialState = { isOpen: false, spotNoList: [] };
exports.slice = (0, toolkit_1.createSlice)({
    name: "spotFilterModal",
    initialState,
    reducers: {
        openSpotFilterModal: (state, action) => {
            const { spotNoList } = action.payload;
            state.isOpen = true;
            state.spotNoList = spotNoList;
        },
        closeSpotFilterModal: (state) => {
            Object.assign(state, initialState);
        },
        enterSpotFilterModal: (state) => {
            Object.assign(state, initialState);
        },
    },
});
_a = exports.slice.actions, exports.openSpotFilterModal = _a.openSpotFilterModal, exports.closeSpotFilterModal = _a.closeSpotFilterModal, exports.enterSpotFilterModal = _a.enterSpotFilterModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=spotFilterModal.js.map