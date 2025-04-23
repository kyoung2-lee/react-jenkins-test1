"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBase64Type = exports.makeFile = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const hooks_1 = require("../../store/hooks");
const file_svg_1 = __importDefault(require("../../assets/images/icon/file.svg"));
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const validates = __importStar(require("../../lib/validators"));
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const UploadFileButton_1 = __importDefault(require("../atoms/UploadFileButton"));
const UploadFileField_1 = __importDefault(require("../atoms/UploadFileField"));
const CloseButton_1 = __importDefault(require("../atoms/CloseButton"));
const FILE_SIZE_BYTE_5MB = 5242880;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".jpe", ".png", ".gif", ".bmp", ".tiff", ".heic"];
const makeFile = (base64, fileName, fileType, lastModified) => {
    let binary = "";
    try {
        binary = atob((0, exports.removeBase64Type)(base64));
    }
    catch (e) {
        // 何もしない
    }
    const len = binary.length;
    const uint8Array = new Uint8Array(len);
    let i = 0;
    while (i < len) {
        uint8Array[i] = binary.charCodeAt(i);
        i += 1;
    }
    return new File([uint8Array], fileName, { type: fileType, lastModified }); // 編集前の更新日を適用
};
exports.makeFile = makeFile;
const removeBase64Type = (base64) => base64.replace(/^data:(.*);base64,/, ""); // ファイル形式部分を取り除く
exports.removeBase64Type = removeBase64Type;
const UploadFilesComponent = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    let resizePxSize = null;
    let resizeTmbPxSize = null;
    const { cdCtrlDtls } = (0, hooks_1.useAppSelector)((state) => state.account.master);
    if (props.channel === "bb") {
        const cdCtrlDtls018 = cdCtrlDtls.find((c) => c.cdCls === "018" && c.cdCat1 === "BBImageFileResizePx");
        resizePxSize = cdCtrlDtls018 ? cdCtrlDtls018.num1 : 500;
        const cdCtrlDtls018Tmb = cdCtrlDtls.find((c) => c.cdCls === "018" && c.cdCat1 === "BBImageFileTmbPx");
        resizeTmbPxSize = cdCtrlDtls018Tmb ? cdCtrlDtls018Tmb.num1 : 150;
    }
    else {
        const cdCtrlDtls018 = cdCtrlDtls.find((c) => c.cdCls === "018" && c.cdCat1 === "ImageFileResizePx");
        resizePxSize = cdCtrlDtls018 ? cdCtrlDtls018.num1 : 500;
    }
    const showMessage = (message) => {
        notifications_1.NotificationCreator.create({ dispatch, message });
    };
    const onDropFileMobile = async (e) => {
        e.persist(); // 非同期でイベントのプロパティを参照できるようにする
        await addSelectedFiles(e.target.files);
        const event = e;
        event.target.value = "";
    };
    const onDropFilePc = (addFiles) => {
        void addSelectedFiles(addFiles);
    };
    const addSelectedFiles = async (addFiles) => {
        const { channel, uploadedFiles, onUploadFiles } = props;
        if (!addFiles) {
            return;
        }
        for (let i = 0; i < addFiles.length; i++) {
            const errorMessage = validates.isOkFileName(addFiles[i].name);
            if (errorMessage) {
                showMessage(errorMessage());
                return;
            }
        }
        const resizedFiles = [];
        let containsIllegalFormatFile = false;
        if (resizePxSize) {
            for (let i = 0; i < addFiles.length; i++) {
                // eslint-disable-next-line no-await-in-loop
                const resized = await resizeImageFile(resizePxSize, addFiles[i]);
                // 画像ファイルの場合、マジックナンバーを検証する
                // eslint-disable-next-line no-await-in-loop
                containsIllegalFormatFile = containsIllegalFormatFile || !(await validates.isOkImageFileFormat(addFiles[i]));
                resizedFiles.push(resized);
            }
        }
        let totalFileSize = 0;
        for (let i = 0; i < resizedFiles.length; i++) {
            totalFileSize += resizedFiles[i].size;
        }
        for (let i = 0; i < uploadedFiles.length; i++) {
            totalFileSize += uploadedFiles[i].file.size;
        }
        if (FILE_SIZE_BYTE_5MB < totalFileSize) {
            showMessage(soalaMessages_1.SoalaMessage.M50018C());
        }
        else if (containsIllegalFormatFile) {
            showMessage(soalaMessages_1.SoalaMessage.M50026C());
        }
        else {
            void Promise.all(Array.from(resizedFiles).map(async (file) => {
                let fileName = file.name;
                // PC以外の場合、拡張子が動画または画像の形式に限り、ファイル名を変更する
                const matched = file.name.match(/(?<extension>\.\w+)$/);
                const matchedExtension = (matched && matched.groups && (0, commonUtil_1.toLowerCase)(matched.groups.extension)) || "";
                if (!storage_1.storage.isPc && IMAGE_EXTENSIONS.some((ext) => ext === matchedExtension)) {
                    fileName = `IMG_${(0, dayjs_1.default)(file.lastModified).format("YYYYMMDD-HHmmss")}${matchedExtension}`;
                }
                let object = await getBase64(file);
                if (channel === "email" && typeof object === "string") {
                    object = (0, exports.removeBase64Type)(object);
                }
                const type = file.type.split("/")[0] || "application";
                let thumbnail = "";
                if (resizeTmbPxSize) {
                    thumbnail = await makeThumbnail(resizeTmbPxSize, file);
                }
                if (typeof object !== "string") {
                    object = "";
                }
                return { fileName, type, object, file, thumbnail };
            })).then((pushedFiles) => onUploadFiles(pushedFiles));
        }
    };
    const resizeImageFile = async (imagePixelSize, file) => {
        // 画像ファイル以外の場合は処理を終了する
        if (!file.type.match(commonConst_1.Const.IMAGE_MIMETYPE_REGEX)) {
            return file;
        }
        if (!imagePixelSize || !file.size) {
            return file;
        }
        const base64image = await getBase64(file);
        if (typeof base64image === "string") {
            // eslint-disable-next-line @typescript-eslint/return-await
            return await resizeBase64Image(imagePixelSize, base64image, file.type)
                .then((resizedBase64) => (0, exports.makeFile)(resizedBase64, file.name, file.type, file.lastModified))
                .catch(() => file);
        }
        return file;
    };
    const makeThumbnail = async (imagePixelSize, file) => {
        if (!file.type.match(commonConst_1.Const.IMAGE_MIMETYPE_REGEX) || !imagePixelSize || !file.size) {
            return "";
        }
        const base64image = await getBase64(file);
        if (typeof base64image === "string") {
            try {
                return await resizeBase64Image(imagePixelSize, base64image, file.type);
            }
            catch (e) {
                return "";
            }
        }
        return "";
    };
    const getBase64 = async (file) => {
        const fileType = file.type || "application/octet-stream";
        if (file.size === 0) {
            return new Promise((resolve) => {
                resolve(`data:${fileType};base64,`);
            });
        }
        const encoded = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            // eslint-disable-next-line prefer-promise-reject-errors
            reader.onerror = () => reject(null);
        });
        if (typeof encoded === "string") {
            const data = encoded.split(";")[0];
            const mime = data.split(":")[1];
            if (mime) {
                return encoded;
            }
            return encoded.replace("data:;base64,", "data:application/octet-stream;base64,");
        }
        return encoded;
    };
    const resizeBase64Image = (imagePixelSize, base64image, fileType) => new Promise((resolve, reject) => {
        // 画像をリサイズする
        const image = new Image();
        image.onload = () => {
            let width = 0;
            let height = 0;
            if (image.width > image.height && image.width > imagePixelSize) {
                // 横長の画像は横のサイズを指定値にあわせる
                const ratio = image.height / image.width;
                width = imagePixelSize;
                height = imagePixelSize * ratio;
            }
            else if (image.height > imagePixelSize) {
                // 縦長の画像は縦のサイズを指定値にあわせる
                const ratio = image.width / image.height;
                width = imagePixelSize * ratio;
                height = imagePixelSize;
            }
            else {
                // 長辺が既定のpxサイズに届いていない場合、そのサイズのままサムネイルを作成する
                width = image.width;
                height = image.height;
            }
            // canvasのサイズを上で算出した値に変更
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            if (ctx) {
                try {
                    // canvasに指定サイズで描画
                    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
                    // canvasからbase64画像データを取得
                    const base64 = canvas.toDataURL(fileType);
                    resolve(base64);
                }
                catch (err) {
                    reject();
                }
            }
            else {
                reject();
            }
        };
        image.onerror = () => {
            reject();
        };
        image.src = base64image;
    });
    const { innerRef, disabled = false, uploadedFiles, onRemoveFile } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Wrapper, { isPc: isPc, ref: innerRef },
        react_1.default.createElement(ActionField, { isPc: isPc }, isPc ? (react_1.default.createElement(UploadFileField_1.default, { disabled: disabled, onDrop: onDropFilePc })) : (react_1.default.createElement(UploadFileButton_1.default, { disabled: disabled, onChange: (e) => {
                void onDropFileMobile(e);
            } }))),
        react_1.default.createElement(ListField, null, uploadedFiles &&
            Array.from(uploadedFiles).map((file, index) => (
            // eslint-disable-next-line react/no-array-index-key
            react_1.default.createElement(FileList, { key: `${file.fileName}x_${index}` },
                react_1.default.createElement(FileName, null,
                    react_1.default.createElement(FileIcon, null),
                    react_1.default.createElement("span", null, file.fileName)),
                react_1.default.createElement(CloseButton_1.default, { onClick: () => onRemoveFile(index), style: { position: "relative" } })))))));
};
const Wrapper = styled_components_1.default.div `
  display: flex;
  width: 100%;
  flex-direction: ${({ isPc }) => (isPc ? "column" : "row")};
`;
const ActionField = styled_components_1.default.div `
  margin-right: ${({ isPc }) => (isPc ? "0" : "20px")};
  margin-bottom: 10px;
`;
const ListField = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const FileList = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const FileName = styled_components_1.default.div `
  background: #f6f6f6;
  display: flex;
  align-items: center;
  width: calc(100% - 34px - 5px - 7px);
  height: 44px;
  padding: 2px 11px 0 11px;
  margin-right: 5px;
  border: 1px solid #346181;
  border-radius: 1px;
  appearance: none;
  img {
    .a {
      fill: none;
      stroke: #595857;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
    }
    width: 20px;
    height: 20px;
    margin-right: 10px;
    margin-bottom: 2px;
  }
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const FileIcon = styled_components_1.default.img.attrs({ src: file_svg_1.default }) ``;
exports.default = UploadFilesComponent;
//# sourceMappingURL=UploadFilesComponent.js.map