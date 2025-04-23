import React, { useEffect, useState } from "react";
import { usePrevious, useLatest } from "../../store/hooks";
import { FilterInput } from "../atoms/FilterInput";

interface Props {
  placeholder: string;
  onClickAdvanceSearchFormButton(stringParam: string): void;
  onSubmit(stringParam: string, onSubmitCallback?: () => void): void;
  onChange(filterString: string, onAccept: () => void): void;
  filtering: boolean;
  searchStringParam: string; // 参照ポインタで比較できるようにStringインスタンスを持つ
}

export const AdvanceSearch: React.FC<Props> = (props) => {
  const [filterString, setFilterString] = useState(String(props.searchStringParam));
  const prevSearchStringParam = usePrevious(props.searchStringParam);
  const latestProps = useLatest(props);
  const latestFilterString = useLatest(filterString);

  useEffect(() => {
    if (props.filtering) {
      setFilterString(String(props.searchStringParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filtering]);

  useEffect(() => {
    if (prevSearchStringParam !== props.searchStringParam) {
      setFilterString(String(props.searchStringParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchStringParam]);

  const onChangeFilterString = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fltString = e.currentTarget.value;
    props.onChange(fltString, () => setFilterString(fltString));
  };

  const submit = () => {
    props.onSubmit(props.filtering ? "" : filterString, () => adjustFilterString());
  };

  const handleClickAdvanceSearchFormButton = () => {
    props.onClickAdvanceSearchFormButton(filterString);
  };

  const handleFilterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.onSubmit(filterString, () => adjustFilterString());
    }
  };

  // フィルタ検索実行時の検索条件が全て不正確なものであり、検索条件整式後に検索文字列が空となる場合に、
  // componentDidUpdateが呼び出されないことによる searchStringParam と filterString の齟齬を無くすための対応
  const adjustFilterString = () => {
    if (!latestProps.current.filtering && !latestProps.current.searchStringParam && !!latestFilterString.current) {
      setFilterString("");
    }
  };

  return (
    <FilterInput
      placeholder={props.placeholder}
      handleKeyPress={handleFilterKeyPress}
      handleChange={onChangeFilterString}
      value={filterString}
      handleClick={handleClickAdvanceSearchFormButton}
      handleSubmit={submit}
      filtering={props.filtering}
    />
  );
};
