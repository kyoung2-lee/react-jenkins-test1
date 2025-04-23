import React from "react";
import styled from "styled-components";
import GearIcon from "../../../assets/images/icon/gear.svg?component";
import TrashIcon from "../../../assets/images/icon/trash.svg?component";
import { storage } from "../../../lib/storage";
import SwipeableCell from "../../atoms/SwipeableCell";
import BroadcastType = Broadcast.BroadcastType;

interface Props {
  id: number;
  name: string;
  type: Broadcast.BroadcastType;
  onClickEdit: (id: number, name: string, type: BroadcastType) => void;
  disabled: boolean;
  isEditable: boolean;
  isDeletable: boolean;
  onClickDelete: (id: number) => void;
  onClickTemplate: (id: number, type: Broadcast.BroadcastType) => void;
  isActive: boolean;
  deltaX: number;
  onPanStart: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPan: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPanEnd: (e: any) => void;
}

const Template: React.FC<Props> = (props) => {
  const { id, disabled, isEditable, isDeletable, onClickEdit, onClickDelete, onClickTemplate, isActive, name, type } = props;
  const { isPc } = storage;
  const sendBy = convertTypeToSendBy(type);
  if (isPc) {
    return (
      <TemplatePanel isPc={isPc}>
        <Tools className="tools">
          <TemplateEditButton isPc={isPc} onClick={() => onClickEdit(id, name, type)} disabled={!isEditable}>
            <GearIcon />
          </TemplateEditButton>
          <TemplateEditButton isPc={isPc} onClick={() => onClickDelete(id)} disabled={!isDeletable}>
            <TrashIcon />
          </TemplateEditButton>
        </Tools>
        <TemplateComponent onClick={() => !disabled && onClickTemplate(id, type)} isActive={isActive} disabled={disabled}>
          <TemplateNameComponent>{name}</TemplateNameComponent>
          <TemplateTypeComponent>{sendBy}</TemplateTypeComponent>
        </TemplateComponent>
      </TemplatePanel>
    );
  }
  const { deltaX, onPanStart, onPan, onPanEnd } = props;
  return (
    <TemplatePanel>
      <TemplateEditContainer onClick={() => onClickEdit(id, name, type)} disabled={!isEditable}>
        <TemplateEditButton isPc={isPc}>
          <GearIcon />
        </TemplateEditButton>
      </TemplateEditContainer>
      <TemplateTrashContainer onClick={() => onClickDelete(id)} disabled={!isDeletable}>
        <TemplateEditButton isPc={isPc}>
          <TrashIcon />
        </TemplateEditButton>
      </TemplateTrashContainer>
      <SwipeableCell deltaX={deltaX} onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd} disabled={!isDeletable}>
        <TemplateComponent onClick={() => !disabled && onClickTemplate(id, type)} isActive={isActive} disabled={disabled}>
          <TemplateNameComponent>{name}</TemplateNameComponent>
          <TemplateTypeComponent>{sendBy}</TemplateTypeComponent>
        </TemplateComponent>
      </SwipeableCell>
    </TemplatePanel>
  );
};

const convertTypeToSendBy = (type: BroadcastType) => {
  switch (type) {
    case "BB":
      return "B.B.";
    case "MAIL":
      return "e-mail";
    case "TTY":
      return "TTY";
    case "ACARS":
      return "ACARS";
    case "NTF":
      return "Notification";
    default:
      return type;
  }
};

const TemplatePanel = styled.div<{ isPc?: boolean }>`
  position: relative;
  background: #346181;
  cursor: pointer;
  ${(props) => (props.isPc ? "&:hover .tools { display: inline-block; }" : "")}
`;

const Tools = styled.div`
  display: none;
  float: right;
  color: black;
  line-height: 40px;
  > div {
    display: inline-block;
    cursor: pointer;
  }
`;

const TemplateEditButton = styled.div<{ isPc: boolean; disabled?: boolean }>`
  display: ${(props) => (props.disabled ? "none!important" : "inline-block")};
  vertical-align: middle;
  line-height: 0;
  text-align: center;
  height: ${(props) => (props.isPc ? 36 : 42)}px;
  width: ${(props) => (props.isPc ? 36 : 42)}px;
  margin-right: 5px;
  padding: ${(props) => (props.isPc ? 6 : 9)}px;
  cursor: pointer;
  &:hover {
    cursor: pointer;
    ${(props) => (props.isPc ? "border-radius: 50%; background: #EEEEEE;" : "")}
  }
  > svg {
    fill: ${(props) => (props.isPc ? "#346181" : "#FFFFFF")};
  }
`;

const TemplateComponent = styled.div<{ isActive?: boolean; disabled?: boolean }>`
  border: ${(props) => (props.isActive && !props.disabled ? "1px solid #F9A825" : "1px solid #346181")};
  padding: 5px 10px;
  background: ${(props) => (props.disabled ? "#EBEBE4" : "#FFFFFF")};
  ${(props) => (props.disabled ? "> div { opacity: .6; }" : "")}
`;

const TemplateNameComponent = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
`;

const TemplateTypeComponent = styled.div`
  color: #969696;
  font-size: 12px;
  margin-top: 2px;
  font-size: 11px;
`;

const TemplateEditContainer = styled.div<{ disabled?: boolean }>`
  display: ${(props) => (props.disabled ? "none" : "table")};
  position: absolute;
  width: 72px;
  color: white;
  text-align: center;
  height: 42px;
`;

const TemplateTrashContainer = styled.div<{ disabled?: boolean }>`
  display: ${(props) => (props.disabled ? "none" : "table")};
  position: absolute;
  width: 72px;
  color: white;
  text-align: center;
  height: 42px;
  right: 0;
`;

export default Template;
