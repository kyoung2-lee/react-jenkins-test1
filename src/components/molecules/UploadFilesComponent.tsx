import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import FileIconSvg from "../../assets/images/icon/file.svg";
import { toLowerCase } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import * as validates from "../../lib/validators";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import UploadFileButton from "../atoms/UploadFileButton";
import UploadFileField from "../atoms/UploadFileField";
import CloseButton from "../atoms/CloseButton";

const FILE_SIZE_BYTE_5MB = 5242880;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".jpe", ".png", ".gif", ".bmp", ".tiff", ".heic"];

export const makeFile = (base64: string, fileName: string, fileType: string, lastModified: number) => {
  let binary = "";
  try {
    binary = atob(removeBase64Type(base64));
  } catch (e) {
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

export const removeBase64Type = (base64: string): string => base64.replace(/^data:(.*);base64,/, ""); // ファイル形式部分を取り除く

export type UploadedFile = {
  fileName: string;
  type: string;
  object: string;
  thumbnail: string;
  file: File;
};

interface Props {
  innerRef?: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
  channel: "bb" | "email";
  uploadedFiles: UploadedFile[];
  onUploadFiles: (uploadFiles: UploadedFile[]) => void;
  onRemoveFile: (index: number) => void;
}

const UploadFilesComponent: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  let resizePxSize: number | null = null;
  let resizeTmbPxSize: number | null = null;

  const { cdCtrlDtls } = useAppSelector((state) => state.account.master);

  if (props.channel === "bb") {
    const cdCtrlDtls018 = cdCtrlDtls.find((c) => c.cdCls === "018" && c.cdCat1 === "BBImageFileResizePx");
    resizePxSize = cdCtrlDtls018 ? cdCtrlDtls018.num1 : 500;
    const cdCtrlDtls018Tmb = cdCtrlDtls.find((c) => c.cdCls === "018" && c.cdCat1 === "BBImageFileTmbPx");
    resizeTmbPxSize = cdCtrlDtls018Tmb ? cdCtrlDtls018Tmb.num1 : 150;
  } else {
    const cdCtrlDtls018 = cdCtrlDtls.find((c) => c.cdCls === "018" && c.cdCat1 === "ImageFileResizePx");
    resizePxSize = cdCtrlDtls018 ? cdCtrlDtls018.num1 : 500;
  }

  const showMessage = (message: NotificationCreator.Message) => {
    NotificationCreator.create({ dispatch, message });
  };

  const onDropFileMobile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<object | void> => {
    e.persist(); // 非同期でイベントのプロパティを参照できるようにする
    await addSelectedFiles(e.target.files);
    const event = e;
    event.target.value = "";
  };

  const onDropFilePc = (addFiles: File[]): void => {
    void addSelectedFiles(addFiles);
  };

  const addSelectedFiles = async (addFiles: FileList | File[] | null): Promise<object | void> => {
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

    const resizedFiles: File[] = [];
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
      showMessage(SoalaMessage.M50018C());
    } else if (containsIllegalFormatFile) {
      showMessage(SoalaMessage.M50026C());
    } else {
      void Promise.all(
        Array.from(resizedFiles).map(async (file) => {
          let fileName = file.name;
          // PC以外の場合、拡張子が動画または画像の形式に限り、ファイル名を変更する
          const matched = file.name.match(/(?<extension>\.\w+)$/);
          const matchedExtension = (matched && matched.groups && toLowerCase(matched.groups.extension)) || "";
          if (!storage.isPc && IMAGE_EXTENSIONS.some((ext) => ext === matchedExtension)) {
            fileName = `IMG_${dayjs(file.lastModified).format("YYYYMMDD-HHmmss")}${matchedExtension}`;
          }
          let object = await getBase64(file);
          if (channel === "email" && typeof object === "string") {
            object = removeBase64Type(object);
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
        })
      ).then((pushedFiles) => onUploadFiles(pushedFiles));
    }
  };

  const resizeImageFile = async (imagePixelSize: number, file: File): Promise<File> => {
    // 画像ファイル以外の場合は処理を終了する
    if (!file.type.match(Const.IMAGE_MIMETYPE_REGEX)) {
      return file;
    }
    if (!imagePixelSize || !file.size) {
      return file;
    }

    const base64image = await getBase64(file);
    if (typeof base64image === "string") {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await resizeBase64Image(imagePixelSize, base64image, file.type)
        .then((resizedBase64) => makeFile(resizedBase64, file.name, file.type, file.lastModified))
        .catch(() => file);
    }
    return file;
  };

  const makeThumbnail = async (imagePixelSize: number, file: File): Promise<string> => {
    if (!file.type.match(Const.IMAGE_MIMETYPE_REGEX) || !imagePixelSize || !file.size) {
      return "";
    }
    const base64image = await getBase64(file);
    if (typeof base64image === "string") {
      try {
        return await resizeBase64Image(imagePixelSize, base64image, file.type);
      } catch (e) {
        return "";
      }
    }
    return "";
  };

  const getBase64 = async (file: Blob): Promise<string | ArrayBuffer | null> => {
    const fileType = file.type || "application/octet-stream";
    if (file.size === 0) {
      return new Promise<string | ArrayBuffer | null>((resolve) => {
        resolve(`data:${fileType};base64,`);
      });
    }
    const encoded = await new Promise<string | ArrayBuffer | null>((resolve, reject) => {
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

  const resizeBase64Image = (imagePixelSize: number, base64image: string, fileType: string): Promise<string> =>
    new Promise((resolve, reject) => {
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
        } else if (image.height > imagePixelSize) {
          // 縦長の画像は縦のサイズを指定値にあわせる
          const ratio = image.width / image.height;
          width = imagePixelSize * ratio;
          height = imagePixelSize;
        } else {
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
          } catch (err) {
            reject();
          }
        } else {
          reject();
        }
      };
      image.onerror = () => {
        reject();
      };
      image.src = base64image;
    });

  const { innerRef, disabled = false, uploadedFiles, onRemoveFile } = props;

  const { isPc } = storage;

  return (
    <Wrapper isPc={isPc} ref={innerRef}>
      <ActionField isPc={isPc}>
        {isPc ? (
          <UploadFileField disabled={disabled} onDrop={onDropFilePc} />
        ) : (
          <UploadFileButton
            disabled={disabled}
            onChange={(e) => {
              void onDropFileMobile(e);
            }}
          />
        )}
      </ActionField>
      <ListField>
        {uploadedFiles &&
          Array.from(uploadedFiles).map((file, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <FileList key={`${file.fileName}x_${index}`}>
              <FileName>
                <FileIcon />
                <span>{file.fileName}</span>
              </FileName>
              <CloseButton onClick={() => onRemoveFile(index)} style={{ position: "relative" }} />
            </FileList>
          ))}
      </ListField>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isPc: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: ${({ isPc }) => (isPc ? "column" : "row")};
`;

const ActionField = styled.div<{ isPc: boolean }>`
  margin-right: ${({ isPc }) => (isPc ? "0" : "20px")};
  margin-bottom: 10px;
`;

const ListField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FileList = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const FileName = styled.div`
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

const FileIcon = styled.img.attrs({ src: FileIconSvg })``;

export default UploadFilesComponent;
