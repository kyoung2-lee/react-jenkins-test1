"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../../lib/storage");
const clip_svg_1 = __importDefault(require("../../../assets/images/icon/clip.svg"));
const Attachment = ({ items, onDownloadThreadFile }) => {
    const linkItems = items.filter((item) => !item.fileTmb);
    const imageItems = items.filter((item) => !!item.fileTmb);
    const manageFile = async (bbFileId) => {
        const file = await onDownloadThreadFile(bbFileId);
        if (!file)
            return;
        if (storage_1.storage.isPc) {
            // PCの場合、添付ファイルをダウンロードする
            const a = document.createElement("A");
            a.download = file.name;
            const fileBlobStr = file.url.replace(/^data:(.+);base64,/, "");
            let fileBlobStrDecoded = "";
            try {
                fileBlobStrDecoded = atob(fileBlobStr);
            }
            catch (e) {
                // 何もしない
            }
            const fileBlobBuffer = new Uint8Array([...fileBlobStrDecoded].map((e) => e.charCodeAt(0)));
            const fileTypeMatches = file.url.match(/^data:(?<type>.+);base64,/);
            const fileType = fileTypeMatches && fileTypeMatches.groups ? fileTypeMatches.groups.type : "application/octet-stream";
            const fileBlob = new Blob([fileBlobBuffer], { type: fileType });
            const fileBlobUrl = URL.createObjectURL(fileBlob);
            a.href = fileBlobUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(fileBlobUrl), 60000);
        }
        else if (window.webkit) {
            // iPad、iPhoneの場合、アプリでプレビューを表示する。
            const message = {
                fileName: file.name,
                dataUri: file.url,
            };
            window.webkit.messageHandlers.previewFile.postMessage(message);
        }
    };
    return (react_1.default.createElement(Container, null,
        linkItems.map(({ fileId, fileName }) => (react_1.default.createElement(Item, { key: fileId },
            react_1.default.createElement(ClipIcon, null),
            react_1.default.createElement(Link, { onClick: () => {
                    void manageFile(fileId);
                } }, fileName)))),
        imageItems.length > 0 /* || videoItems.length > 0 */ && (react_1.default.createElement(MediaAttachmentRow, null, imageItems.map(({ fileId, fileTmb }) => (react_1.default.createElement(MediaAttachmentCol, { key: fileId },
            react_1.default.createElement(AttachmentImage, { src: fileTmb, onClick: () => {
                    void manageFile(fileId);
                } }))))))));
};
exports.Attachment = Attachment;
const Container = styled_components_1.default.div `
  margin-top: 20px;
`;
const Item = styled_components_1.default.div `
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-top: 5px;
  }
`;
const ClipIcon = styled_components_1.default.img.attrs({ src: clip_svg_1.default }) `
  margin-right: 3px;
`;
const MediaAttachmentRow = styled_components_1.default.div `
  display: flex;
  margin: 15px -5px 0;
  flex-wrap: wrap;
  font-size: 15px;
`;
const MediaAttachmentCol = styled_components_1.default.div `
  min-width: 150px;
  height: 150px;
  padding: 0 5px;
`;
const AttachmentImage = styled_components_1.default.div `
  background-image: url("${(props) => props.src}");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
const Link = styled_components_1.default.div `
  text-decoration: underline;
  cursor: pointer;
  color: blue;
`;
//# sourceMappingURL=Attachment.js.map