import { ExtFisRow } from "../components/organisms/BarChart/selector";

export function getBarChartLayout({
  extFisRow,
  cellWidth,
  cellHeight,
  rowIndex,
}: {
  extFisRow: ExtFisRow;
  cellWidth: number;
  cellHeight: number;
  rowIndex: number;
}): { width: number; top: number; left: number } {
  let width: number;

  // 到着便のみのバーの幅を取得
  if (!!extFisRow.xtaLcl && !extFisRow.xtdLcl) {
    if (extFisRow.depNextCat > 0) {
      width = (cellWidth * 30) / 60; // 60分に対する長さ
      width = width > 210 ? width : 210;
    } else {
      width = (cellWidth * 20) / 60; // 60分に対する長さ
      width = width > 150 ? width : 150;
    }
    // 出発便のみのバーの幅を取得
  } else if (!extFisRow.xtaLcl && !!extFisRow.xtdLcl) {
    if (extFisRow.arrFromCat > 0) {
      width = (cellWidth * 35) / 60; // 60分に対する長さ
      width = width > 250 ? width : 250;
    } else {
      width = (cellWidth * 25) / 60; // 60分に対する長さ
      width = width > 180 ? width : 180;
    }
    // 通常のバーの幅を取得
  } else {
    width = Math.floor((extFisRow.minutesOfWidth / 60) * cellWidth) || cellWidth / 2;
  }

  // バーチャートのGrid上の位置を取得する
  const top = rowIndex * cellHeight;
  let left =
    (extFisRow.flightTimeDayjs.minute() / 60 + extFisRow.flightTimeDayjs.hour()) * cellWidth + 24 * extFisRow.flightDayDiff * cellWidth;
  if (!extFisRow.xtaLcl && extFisRow.xtdLcl) {
    left -= width;
  }

  return { width, top, left };
}
