"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveHiddenSpotNo = exports.getHiddenSpotNoList = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const StorageOfUser_1 = require("../lib/StorageOfUser");
const initialState = {
    hiddenSpotNoList: [],
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "storageOfUser",
    initialState,
    reducers: {
        getHiddenSpotNoList: (state, action) => {
            const { apoCd } = action.payload;
            state.hiddenSpotNoList = StorageOfUser_1.storageOfUser.getHiddenSpotNoList({ apoCd });
        },
        saveHiddenSpotNo: (state, action) => {
            const { apoCd, hiddenSpotNo } = action.payload;
            StorageOfUser_1.storageOfUser.saveFilterSpotNo({ apoCd, hiddenSpotNo });
            state.hiddenSpotNoList = StorageOfUser_1.storageOfUser.getHiddenSpotNoList({ apoCd });
        },
    },
});
_a = exports.slice.actions, exports.getHiddenSpotNoList = _a.getHiddenSpotNoList, exports.saveHiddenSpotNo = _a.saveHiddenSpotNo;
exports.default = exports.slice.reducer;
//# sourceMappingURL=storageOfUser.js.map