import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hooks";
import Template from "./Template";
import BroadcastType = Broadcast.BroadcastType;

interface Props {
  id: number;
  onClickEdit: (id: number, name: string, type: BroadcastType) => void;
  onClickDelete: (id: number) => void;
  onClickTemplate: (id: number, type: Broadcast.BroadcastType) => void;
}

enum TemplatePosition {
  center = "center",
  left = "left",
  right = "right",
}

const TemplateList: React.FC<Props> = (props) => {
  const Broadcast = useAppSelector((state) => state.broadcast.Broadcast);
  const userJobCd = useAppSelector((state) => state.account.jobAuth.user.jobCd);
  const templateJobCd = useAppSelector((state) => state.form.broadcast.values?.templateJobCd as string);
  const [index, setIndex] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [position, setPosition] = useState(TemplatePosition.center);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    setIndex(0);
    setPosition(TemplatePosition.center);
    setDeltaX(0);
  }, [Broadcast.templates]);

  const handlePanStart = (i: number) => {
    setIndex(i);
    setPosition(index === i ? position : TemplatePosition.center);
    setDeltaX(index === i ? deltaX : 0);
    setSwiping(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePan = (e: any, i: number, disabled?: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (e.srcEvent && e.srcEvent.type === "pointercancel") {
      setIndex(i);
      setDeltaX(getFirstDistance(i));
      setSwiping(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    let distance = e.deltaX as number;
    if (disabled && position === TemplatePosition.center && distance > 0) {
      distance = 0;
    } else if (disabled && position === TemplatePosition.left && distance > DEFAULT_SWIPED_DISTANCE) {
      distance = DEFAULT_SWIPED_DISTANCE;
    } else if (position === TemplatePosition.center) {
      if (distance >= DEFAULT_SWIPED_DISTANCE * 2) {
        distance = DEFAULT_SWIPED_DISTANCE * 2;
      } else if (distance <= -1 * DEFAULT_SWIPED_DISTANCE * 2) {
        distance = -1 * DEFAULT_SWIPED_DISTANCE * 2;
      }
    } else if (position === TemplatePosition.left) {
      if (distance >= DEFAULT_SWIPED_DISTANCE * 3) {
        distance = DEFAULT_SWIPED_DISTANCE * 3;
      } else if (distance <= -1 * DEFAULT_SWIPED_DISTANCE) {
        distance = -1 * DEFAULT_SWIPED_DISTANCE;
      }
    } else if (distance >= DEFAULT_SWIPED_DISTANCE) {
      distance = DEFAULT_SWIPED_DISTANCE;
    } else if (distance <= -1 * DEFAULT_SWIPED_DISTANCE * 3) {
      distance = -1 * DEFAULT_SWIPED_DISTANCE * 3;
    }
    setIndex(i);
    setDeltaX(getFirstDistance(i) + distance);
    setSwiping(true);
  };

  const getFirstDistance = (i: number): number => {
    if (index === i) {
      if (position === TemplatePosition.center) return 0;
      if (position === TemplatePosition.left) return -1 * DEFAULT_SWIPED_DISTANCE;
      return DEFAULT_SWIPED_DISTANCE;
    }
    return 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePanEnd = (e: any, i: number, disabled?: boolean) => {
    setTimeout(() => setSwiping(false), 200);
    const firstPosition = getFirstPosition(i);
    if (disabled) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (firstPosition === TemplatePosition.center && e.deltaX > 0) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (firstPosition === TemplatePosition.left && e.deltaX > DEFAULT_SWIPED_DISTANCE) {
        setIndex(i);
        setPosition(TemplatePosition.center);
        setDeltaX(0);
        return;
      }
    }
    if (firstPosition === TemplatePosition.left) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setLeftTemplateNextPositionState(i, e.deltaX as number, firstPosition);
    } else if (firstPosition === TemplatePosition.right) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setRightTemplateNextPositionState(i, e.deltaX as number, firstPosition);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setCenterTemplateNextPositionState(i, e.deltaX as number, firstPosition);
    }
  };

  const setLeftTemplateNextPositionState = (i: number, delX: number, posi: TemplatePosition.left) => {
    if (delX >= DEFAULT_SWIPED_DISTANCE / 2 && delX <= DEFAULT_SWIPED_DISTANCE * 1.5) {
      setIndex(i);
      setPosition(TemplatePosition.center);
      setDeltaX(0);
      return;
    }
    if (delX > DEFAULT_SWIPED_DISTANCE * 1.5) {
      setIndex(i);
      setPosition(TemplatePosition.right);
      setDeltaX(DEFAULT_SWIPED_DISTANCE);
      return;
    }
    setIndex(i);
    setPosition(posi);
    setDeltaX(getFirstDistance(i));
  };

  const setRightTemplateNextPositionState = (i: number, delX: number, posi: TemplatePosition.right) => {
    if (delX <= (-1 * DEFAULT_SWIPED_DISTANCE) / 2 && delX >= -1 * DEFAULT_SWIPED_DISTANCE * 1.5) {
      setIndex(i);
      setPosition(TemplatePosition.center);
      setDeltaX(0);
      return;
    }
    if (delX < -1 * DEFAULT_SWIPED_DISTANCE * 1.5) {
      setIndex(i);
      setPosition(TemplatePosition.left);
      setDeltaX(-1 * DEFAULT_SWIPED_DISTANCE);
      return;
    }
    setIndex(i);
    setPosition(posi);
    setDeltaX(getFirstDistance(i));
  };

  const setCenterTemplateNextPositionState = (i: number, delX: number, posi: TemplatePosition.center) => {
    if (delX <= (-1 * DEFAULT_SWIPED_DISTANCE) / 2) {
      setIndex(i);
      setPosition(TemplatePosition.left);
      setDeltaX(-1 * DEFAULT_SWIPED_DISTANCE);
      return;
    }
    if (delX >= DEFAULT_SWIPED_DISTANCE / 2) {
      setIndex(i);
      setPosition(TemplatePosition.right);
      setDeltaX(DEFAULT_SWIPED_DISTANCE);
      return;
    }
    setIndex(i);
    setPosition(posi);
    setDeltaX(0);
  };

  const getFirstPosition = (i: number): TemplatePosition.center | TemplatePosition.left | TemplatePosition.right =>
    index === i ? position : TemplatePosition.center;

  const getDeltaX = (i: number) => (index === i ? deltaX : 0);

  const getTemplateDisabled = (type: Broadcast.BroadcastType): boolean => {
    const { canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification } = Broadcast;
    switch (type) {
      case "BB":
        return !canManageBb;
      case "MAIL":
        return !canManageEmail;
      case "TTY":
        return !canManageTty;
      case "AFTN":
        return !canManageAftn;
      case "ACARS":
        return !canManageAcars;
      case "NTF":
        return !canManageNotification;
      default:
        return true;
    }
  };

  const isOtherJobCdTemplate = templateJobCd !== userJobCd;

  const { id, onClickEdit, onClickDelete, onClickTemplate } = props;

  return (
    <List>
      {Broadcast.templates.map((template, i) => {
        const disabled = getTemplateDisabled(template.broadcastType);
        return (
          <Wrapper key={template.templateId}>
            <Template
              id={template.templateId}
              name={template.templateName}
              type={template.broadcastType}
              onClickEdit={onClickEdit}
              disabled={disabled}
              isEditable={!(disabled || isOtherJobCdTemplate)}
              isDeletable={!isOtherJobCdTemplate}
              onClickDelete={onClickDelete}
              onClickTemplate={(templateId, type) => !swiping && onClickTemplate(templateId, type)}
              isActive={id === template.templateId}
              deltaX={getDeltaX(i)}
              onPanStart={() => handlePanStart(i)}
              onPan={(e) => handlePan(e, i, disabled)}
              onPanEnd={(e) => handlePanEnd(e, i, disabled)}
            />
          </Wrapper>
        );
      })}
    </List>
  );
};

const DEFAULT_SWIPED_DISTANCE = 72;

const List = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  width: 250px;
  margin: 7px 0;
  div:nth-child(1) {
    margin-top: 0;
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
  margin-top: 5px;
`;

export default TemplateList;
