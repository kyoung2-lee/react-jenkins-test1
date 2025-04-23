import { useEffect } from "react";

interface Props {
  eventHandlers: EventHandler[];
}

export interface EventHandler {
  target: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject | null;
  options?: AddEventListenerOptions | boolean;
}

const EventListener: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    props.eventHandlers.forEach((e) => {
      e.target.addEventListener(e.type, e.listener, e.options);
    });
    return () => {
      props.eventHandlers.forEach((e) => {
        e.target.removeEventListener(e.type, e.listener, e.options);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default EventListener;
