import { List } from "immutable";
import { maxBy as _maxBy } from "lodash";
import dayjs from "dayjs";
import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../../store/storeType";
import { FisState } from "../../../reducers/fis";
import { FisRow } from "../../../reducers/fisType";
import { SearchParams } from "../../../reducers/fisFilterModal";
import { Master } from "../../../reducers/account";

const fisSelector = (state: RootState) => state.fis;
const fisFilterModalSelector = (state: RootState) => state.fisFilterModal;
const masterSelector = (state: RootState) => state.account.master;

const searchFisRowsSelector = createSelector(
  [fisSelector, fisFilterModalSelector, masterSelector],
  (fisFilter, fisFilterModalFilter, masterFilter) => {
    // console.time('fisSelectorFilter');

    const { searchParams } = fisFilterModalFilter;

    const filteredFisRows = doFilter(fisFilter, searchParams, masterFilter);
    // console.timeEnd('fisSelectorFilter');
    // console.time('fisSelectorSort');
    const sortedFisRows = doSort(filteredFisRows, fisFilter.isSortArrival, fisFilter.isSortAsc);
    // console.timeEnd('fisSelectorSort');

    return sortedFisRows;
  }
);

// 検索条件を元にフィルタリングする
const doFilter = (fisFilter: FisState, searchParams: SearchParams, masterFilter: Master) => {
  let { fisRows } = fisFilter;
  // 表示範囲とTowing非表示モードによるフィルタリング
  if (fisFilter.dispRangeFromLcl && fisFilter.dispRangeToLcl) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        // Towing非表示モードの時は便なしの行を非表示にする
        if (fisFilter.isSortNoTowing) {
          if ((fisFilter.isSortArrival && !val.arr) || (!fisFilter.isSortArrival && !val.dep)) {
            return false;
          }
        }

        // 表示範囲内に入っているものを表示する
        if (val.xtaLcl && val.xtdLcl) {
          if (
            (val.xtaLcl >= fisFilter.dispRangeFromLcl && val.xtaLcl <= fisFilter.dispRangeToLcl) ||
            (val.xtdLcl >= fisFilter.dispRangeFromLcl && val.xtdLcl <= fisFilter.dispRangeToLcl)
          ) {
            return true;
          }
        } else if (val.xtaLcl) {
          if (val.xtaLcl >= fisFilter.dispRangeFromLcl && val.xtaLcl <= fisFilter.dispRangeToLcl) {
            return true;
          }
        } else if (val.xtdLcl) {
          if (val.xtdLcl >= fisFilter.dispRangeFromLcl && val.xtdLcl <= fisFilter.dispRangeToLcl) {
            return true;
          }
        }
        return false;
      })
      .toList();
  }

  // airLine
  const jalGrpAlCds = masterFilter.airlines.filter((al) => al.jalGrpFlg).map((a) => a.alCd);
  const selectedJalAlCds = searchParams.airLineCode || [];
  const selectedOALAlCds = searchParams.airLineCodeOAL || [];
  if (jalGrpAlCds.length === selectedJalAlCds.length && searchParams.airLineCodeOALAll) {
    // ALL JAL GRP & OAL
    fisRows = fisRows.toList();
  } else if (selectedJalAlCds.length > 0 || selectedOALAlCds.length > 0 || searchParams.airLineCodeOALAll) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        // JAL GRP
        if (searchParams.airLineCode) {
          if (val.dep && selectedJalAlCds.includes(val.dep.omAlCd)) {
            return true;
          }
          if (val.arr && selectedJalAlCds.includes(val.arr.omAlCd)) {
            return true;
          }
        }

        // OAL
        if (searchParams.airLineCodeOALAll) {
          if (val.dep && val.dep.isOal) {
            return true;
          }
          if (val.arr && val.arr.isOal) {
            return true;
          }
        } else if (selectedOALAlCds.length > 0) {
          if (val.dep && val.dep.isOal && selectedOALAlCds.includes(val.dep.alCd)) {
            return true;
          }
          if (val.arr && val.arr.isOal && selectedOALAlCds.includes(val.arr.alCd)) {
            return true;
          }
        }

        return false;
      })
      .toList();
  }

  // FlightNo
  if (searchParams.flightNo) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        if (
          val.arr && searchParams.casualFlg
            ? val.arr.casFltNo === searchParams.flightNo
            : val.arr && (val.arr.alCd === searchParams.flightNo || val.arr.alCd + val.arr.fltNo === searchParams.flightNo)
        ) {
          return true;
        }
        if (
          val.dep && searchParams.casualFlg
            ? val.dep.casFltNo === searchParams.flightNo
            : val.dep && (val.dep.alCd === searchParams.flightNo || val.dep.alCd + val.dep.fltNo === searchParams.flightNo)
        ) {
          return true;
        }
        return false;
      })
      .toList();
  }

  // cnlHideFlg
  if (searchParams.cnlHideFlg) {
    fisRows = fisRows.filter((val: FisRow) => !val.isCancel);
  }

  // Airport
  if (searchParams.airport) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        if (val.arr && val.arr.lstOrgApoCd === searchParams.airport) {
          return true;
        }
        if (val.dep && val.dep.lstLasApoCd === searchParams.airport) {
          return true;
        }
        return false;
      })
      .toList();
  }

  // Ship
  if (searchParams.ship) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        if (val.shipNo && val.shipNo.endsWith(searchParams.ship)) {
          return true;
        }
        return false;
      })
      .toList();
  }

  // Spot
  if (searchParams.spot && searchParams.spot.length) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        if (searchParams.spot.includes(val.spotNo)) {
          return true;
        }
        return false;
      })
      .toList();
  }

  // DateTime
  const from = searchParams.dateTimeFrom;
  const to = searchParams.dateTimeTo;
  if (from || to) {
    if (searchParams.dateTimeRadio === "DEP") {
      fisRows = fisRows
        .filter((val: FisRow) => {
          const xtdLcl = dayjs(val.xtdLcl).format("HHmm");
          if (from && to) {
            if (Number(xtdLcl) >= Number(from) && Number(xtdLcl) <= Number(to)) {
              return true;
            }
          } else if (from) {
            if (Number(xtdLcl) >= Number(from)) {
              return true;
            }
          } else if (to) {
            if (Number(xtdLcl) <= Number(to)) {
              return true;
            }
          }
          return false;
        })
        .toList();
    } else if (searchParams.dateTimeRadio === "ARR") {
      fisRows = fisRows
        .filter((val: FisRow) => {
          const xtaLcl = dayjs(val.xtaLcl).format("HHmm");
          if (from && to) {
            if (Number(xtaLcl) >= Number(from) && Number(xtaLcl) <= Number(to)) {
              return true;
            }
          } else if (from) {
            if (Number(xtaLcl) >= Number(from)) {
              return true;
            }
          } else if (to) {
            if (Number(xtaLcl) <= Number(to)) {
              return true;
            }
          }
          return false;
        })
        .toList();
    }
  }

  // DOM/INT
  if (searchParams.domOrInt) {
    fisRows = fisRows
      .filter((val: FisRow) => {
        if (val.arr && val.arr.intDomCat === searchParams.domOrInt) {
          return true;
        }
        if (val.dep && val.dep.intDomCat === searchParams.domOrInt) {
          return true;
        }
        return false;
      })
      .toList();
  }

  // SKD/NSK
  if (searchParams.skdOrNsk) {
    fisRows = fisRows.filter((val: FisRow) => {
      const skd = "SKD";
      if (searchParams.skdOrNsk === skd) {
        if ((val.arr && val.arr.skdlNonskdlCat === skd) || (val.dep && val.dep.skdlNonskdlCat === skd)) {
          return true;
        }
      }
      if ((val.arr && val.arr.skdlNonskdlCat !== skd) || (val.dep && val.dep.skdlNonskdlCat !== skd)) {
        return true;
      }
      return false;
    });
  }
  return fisRows;
};

// ソート条件を元に並び順を変更する
const doSort = (fisRows: List<FisRow>, isSortArrival: boolean, isSortAsc: boolean): List<{ date: string; fis: FisRow }> => {
  // Arrival選択時のソート
  if (isSortArrival) {
    // 日付の配列を取得
    const dates = Array.from(new Set(fisRows.map((f) => f.sortArrDate)));

    // ATAの最大値をもつ日付の連想配列に変換
    const maxAtas = dates
      .map((date) => {
        const filterfunc = (f: FisRow) => f.sortArrDate === date && f.sortArrGroupNo === 1 && f.arr && f.arr.ataLcl;
        const max = _maxBy(fisRows.filter(filterfunc).toArray(), (f) => f.sortXtaLcl);
        return { [date]: max ? max.sortXtaLcl : "" };
      })
      .reduce((acc, cur) => Object.assign(acc, cur), {});

    // ソートの実行
    const sortedFisRows = fisRows
      .filter((fisRow) => fisRow.sortArrDate !== "99999999")
      .map((f) => {
        const fisRow = f;
        if (fisRow.sortArrGroupNo === 4) {
          // CNL区間
          if (maxAtas[fisRow.sortArrDate] >= fisRow.sortXtaLcl) {
            fisRow.sortGroupNo = 1; // ①最終ATA ≧ ④便XTA ＝ ①に振り分け
          } else {
            fisRow.sortGroupNo = 3; // ①最終ATA ＜ ④便XTA ＝ ③に振り分け ※①最終ATAが無い場合はすべて③に振り分ける。
          }
        } else if (fisRow.sortArrGroupNo === 5) {
          // XTAが設定されていないもの
          if (maxAtas[fisRow.sortArrDate] >= fisRow.sortXtdLcl) {
            fisRow.sortGroupNo = 1; // ①最終ATA ≧ ⑤便XTD ＝ ①に振り分け
          } else {
            fisRow.sortGroupNo = 3; // ①最終ATA ＜ ④便XTD ＝ ③に振り分け ※①最終ATAが無い場合はすべて③に振り分ける。
          }
        } else {
          fisRow.sortGroupNo = fisRow.sortArrGroupNo;
        }

        return {
          date: fisRow.sortArrDate,
          fis: fisRow,
        };
      })
      .sort((a, b) => {
        const aKey = `${a.fis.sortArrDate}${a.fis.sortGroupNo}${a.fis.sortXtaLcl}${a.fis.sortXtdLcl}${a.fis.sortArrFlt}`;
        const bKey = `${b.fis.sortArrDate}${b.fis.sortGroupNo}${b.fis.sortXtaLcl}${b.fis.sortXtdLcl}${b.fis.sortArrFlt}`;
        if (aKey > bKey) return 1;
        if (aKey < bKey) return -1;
        if (a.fis.arrDepCtrl.seq > b.fis.arrDepCtrl.seq) return 1;
        return 0;
      });

    if (isSortAsc) {
      return sortedFisRows;
    }
    return sortedFisRows.reverse();

    // Departure選択時のソート
  }
  // 日付の配列を取得
  const dates = Array.from(new Set(fisRows.map((f) => f.sortDepDate)));

  // ATDの最大値をもつ日付の連想配列に変換
  const maxAtds = dates
    .map((date) => {
      const filterfunc = (f: FisRow) =>
        f.sortDepDate === date && (f.sortDepGroupNo === 1 || f.sortDepGroupNo === 2) && f.dep && f.dep.atdLcl;
      const max = _maxBy(fisRows.filter(filterfunc).toArray(), (f) => f.sortXtdLcl);
      return { [date]: max ? max.sortXtdLcl : "" };
    })
    .reduce((acc, cur) => Object.assign(acc, cur), {});

  // ソートの実行
  const sortedFisRows = fisRows
    .filter((fisRow) => fisRow.sortDepDate !== "99999999")
    .map((f) => {
      const fisRow = f;
      if (fisRow.sortDepGroupNo === 4) {
        // CNL区間
        if (maxAtds[fisRow.sortDepDate] >= fisRow.sortXtdLcl) {
          fisRow.sortGroupNo = 1; // ②最終ATD ≧ ④便XTD ＝ ①に振り分け
        } else {
          fisRow.sortGroupNo = 3; // ②最終ATD ＜ ④便XTD ＝ ③に振り分け ※②最終ATDが無い場合はすべて③に振り分ける。
        }
      } else if (fisRow.sortDepGroupNo === 5) {
        // XTDが設定されていないもの
        if (maxAtds[fisRow.sortDepDate] >= fisRow.sortXtaLcl) {
          fisRow.sortGroupNo = 1; // ②最終ATD ≧ ⑤便XTA ＝ ①に振り分け
        } else {
          fisRow.sortGroupNo = 3; // ②最終ATD ＜ ⑤便XTA ＝ ③に振り分け ※②最終ATDが無い場合はすべて③に振り分ける。
        }
      } else {
        fisRow.sortGroupNo = fisRow.sortDepGroupNo;
      }

      return {
        date: fisRow.sortDepDate,
        fis: fisRow,
      };
    })
    .sort((a, b) => {
      const aKey = `${a.fis.sortDepDate}${a.fis.sortGroupNo}${a.fis.sortXtdLcl}${a.fis.sortXtaLcl}${a.fis.sortDepFlt}`;
      const bKey = `${b.fis.sortDepDate}${b.fis.sortGroupNo}${b.fis.sortXtdLcl}${b.fis.sortXtaLcl}${b.fis.sortDepFlt}`;
      if (aKey > bKey) return 1;
      if (aKey < bKey) return -1;
      if (a.fis.arrDepCtrl.seq > b.fis.arrDepCtrl.seq) return 1;
      return 0;
    });

  if (isSortAsc) {
    return sortedFisRows;
  }
  return sortedFisRows.reverse();
};

export default searchFisRowsSelector;
