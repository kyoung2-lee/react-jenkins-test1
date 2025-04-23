import React from "react";
import reactStringReplace from "react-string-replace";
import { storage } from "../../lib/storage";

interface Props {
  children: React.ReactNode;
}

const HyperLinkedText: React.FC<Props> = (props: Props) => {
  const regUrl = /((?:ftp|http)[s]*:\/\/[^.]+\.[^ \n]+)/g;
  return (
    <>
      {storage.isPc
        ? reactStringReplace([props.children], regUrl, (match, i) => (
            <a key={i} href={match} target="_blank" rel="noopener noreferrer">
              {match}
            </a>
          ))
        : reactStringReplace([props.children], regUrl, (match, i) => (
            <a key={i} href={`app:${match}`} target="_blank" rel="noopener noreferrer">
              {match}
            </a>
          ))}
    </>
  );
};

export default HyperLinkedText;
