import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../store/hooks";
import { NotificationCreator } from "../../../lib/notifications";
import { SoalaMessage } from "../../../lib/soalaMessages";
import IconSvg from "../../../assets/images/icon/action_menu.svg";

interface Props {
  actions: { icon?: string; title: string; onClick: () => void }[];
  editing: boolean;
  clearCommentStorage: () => void;
  toggleActionMenu: () => void;
}

export const ActionMenu: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const closingTimeoutRef = useRef<number | undefined>(undefined);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visibled, setVisibled] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(
    () => () => {
      if (closingTimeoutRef.current) {
        window.clearTimeout(closingTimeoutRef.current);
      }
    },
    []
  );

  const showMessage = (message: NotificationCreator.Message): void => NotificationCreator.create({ dispatch, message });

  const toggle = () => {
    const { editing = false } = props;
    if (visibled) {
      close();
    } else if (editing) {
      showMessage(
        SoalaMessage.M40012C({
          onYesButton: () => {
            props.clearCommentStorage();
            openMenu();
          },
        })
      );
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    if (overlayRef && overlayRef.current) {
      overlayRef.current.addEventListener("touchend", parentClose, { once: true });
      overlayRef.current.addEventListener("click", parentClose, { once: true });
    }
    setVisibled(true);
    props.toggleActionMenu();
  };

  const close = () => {
    setVisibled(false);
    setClosing(true);
    props.toggleActionMenu();
    if (closingTimeoutRef.current) window.clearTimeout(closingTimeoutRef.current);
    closingTimeoutRef.current = window.setTimeout(() => {
      setClosing(false);
    }, 250);

    return false;
  };

  const parentClose = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    close();
    return true;
  };

  const handleClickMenuItem = (e: React.MouseEvent<HTMLDivElement>, onClick: () => void) => {
    e.stopPropagation();
    close();
    onClick();
  };

  const classNames = [visibled && "is-open", closing && "is-close"];

  if (props.actions.length === 0) {
    return null;
  }

  return (
    <ThreadActionMenu>
      <MenuTrigger onClick={toggle}>
        <Icon />
      </MenuTrigger>
      <MenuContainer className={classNames.join(" ")}>
        {props.actions.map((action, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <MenuItem key={`action-${i}`} onClick={(e) => handleClickMenuItem(e, action.onClick)}>
            {action.icon && <MenuIcon src={action.icon} />}
            {action.title}
          </MenuItem>
        ))}
      </MenuContainer>
      <Overlay className={classNames.join(" ")} ref={overlayRef} />
    </ThreadActionMenu>
  );
};

const MenuIcon = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 4px;
  margin-top: -5px;
  margin-bottom: -5px;
`;

const ThreadActionMenu = styled.div`
  position: relative;
`;

const MenuTrigger = styled.div`
  cursor: pointer;
  user-select: none;
`;

const Icon = styled.img.attrs({ src: IconSvg })`
  display: block;
  padding: 8px;
`;

const MenuContainer = styled.div`
  width: 200px;
  display: none;
  position: absolute;
  right: -8px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.3);
  z-index: 3;
  transition: opacity 0.25s;

  &.is-open {
    padding: 8px 16px;
    margin-top: 8px;
    height: auto;
    display: inline-block;
  }

  &.is-close {
    padding: 8px 16px;
    margin-top: 8px;
    height: auto;
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: -20px;
    right: 15px;
    border: 8px solid transparent;
    border-bottom: 15px solid #fff;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2;
  width: 300vw;
  height: 300vh;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  visibility: hidden;

  &.is-open {
    display: inline-block;
    visibility: visible;
  }
`;

const MenuItem = styled.div`
  color: #346181;
  user-select: none;
  cursor: pointer;
  border-bottom: 2px solid #eee;
  padding: 8px 8px;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;
