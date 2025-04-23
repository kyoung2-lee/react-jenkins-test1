import React from "react";
import styled from "styled-components";
// import { VideoAttachment } from "../../molecules/VideoAttachment";
import { RootState } from "../../../store/storeType";
import { storage } from "../../../lib/storage";
import ClipIconSvg from "../../../assets/images/icon/clip.svg";

interface Props {
  items: Required<RootState["bulletinBoard"]>["thread"]["thread"]["bbFileList"];
  onDownloadThreadFile: (bbFileId: number) => Promise<BulletinBoardDownloadFileApi.File | undefined>;
}

export const Attachment: React.FC<Props> = ({ items, onDownloadThreadFile }) => {
  const linkItems = items.filter((item) => !item.fileTmb);
  const imageItems = items.filter((item) => !!item.fileTmb);

  const manageFile = async (bbFileId: number) => {
    const file = await onDownloadThreadFile(bbFileId);
    if (!file) return;

    if (storage.isPc) {
      // PCの場合、添付ファイルをダウンロードする
      const a = document.createElement("A") as HTMLAnchorElement;
      a.download = file.name;
      const fileBlobStr = file.url.replace(/^data:(.+);base64,/, "");
      let fileBlobStrDecoded = "";
      try {
        fileBlobStrDecoded = atob(fileBlobStr);
      } catch (e) {
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
    } else if (window.webkit) {
      // iPad、iPhoneの場合、アプリでプレビューを表示する。
      const message = {
        fileName: file.name,
        dataUri: file.url,
      };
      window.webkit.messageHandlers.previewFile.postMessage(message);
    }
  };

  return (
    <Container>
      {linkItems.map(({ fileId, fileName }) => (
        <Item key={fileId}>
          <ClipIcon />
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link
            onClick={() => {
              void manageFile(fileId);
            }}
          >
            {fileName}
          </Link>
        </Item>
      ))}
      {imageItems.length > 0 /* || videoItems.length > 0 */ && (
        <MediaAttachmentRow>
          {imageItems.map(({ fileId, fileTmb }) => (
            <MediaAttachmentCol key={fileId}>
              <AttachmentImage
                src={fileTmb}
                onClick={() => {
                  void manageFile(fileId);
                }}
              />
            </MediaAttachmentCol>
          ))}
          {/* videoItems.map(({ fileId, fileTmb }) => (
            <MediaAttachmentCol key={fileId}>
              <VideoAttachment url={fileTmb} onClick={() => downloadFile(fileId)} />
            </MediaAttachmentCol>
          )) */}
        </MediaAttachmentRow>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 20px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-top: 5px;
  }
`;

const ClipIcon = styled.img.attrs({ src: ClipIconSvg })`
  margin-right: 3px;
`;

const MediaAttachmentRow = styled.div`
  display: flex;
  margin: 15px -5px 0;
  flex-wrap: wrap;
  font-size: 15px;
`;

const MediaAttachmentCol = styled.div`
  min-width: 150px;
  height: 150px;
  padding: 0 5px;
`;

const AttachmentImage = styled.div<{ src: string }>`
  background-image: url("${(props) => props.src}");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const Link = styled.div`
  text-decoration: underline;
  cursor: pointer;
  color: blue;
`;
