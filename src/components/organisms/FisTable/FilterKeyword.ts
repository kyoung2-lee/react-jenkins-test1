import { SearchParams } from "../../../reducers/fisFilterModal";
import { Master } from "../../../reducers/account";

export default class FilterKeyword {
  al: string[];
  oal: string[];
  flt: string;
  apo: string;
  ship: string;
  spot: string;
  domInt: string;
  time: string;
  after: string;
  before: string;
  skdNsk: string;
  cnl: string;
  casualFlg: boolean;

  constructor(searchParams: SearchParams, master: Master) {
    this.al = this.buildAlc(searchParams, master);
    this.oal = this.buildOal(searchParams);
    this.flt = this.buildFlt(searchParams);
    this.apo = this.buildApo(searchParams);
    this.ship = this.buildShip(searchParams);
    this.spot = this.buildSpot(searchParams);
    this.domInt = this.buildDomInt(searchParams);
    this.time = this.buildTime(searchParams);
    this.after = this.buildAfter(searchParams);
    this.before = this.buildBefore(searchParams);
    this.skdNsk = this.buildSkdNsk(searchParams);
    this.cnl = this.buildCnl(searchParams);
    this.casualFlg = searchParams.casualFlg;
  }

  toString() {
    const str = `${this.alToString()}${this.oalToString()}${this.FltToString()}${this.ApoToString()}${this.ShipToString()}${this.SpotToString()}${this.domIntToString()}${this.skdNskToString()}${this.cnlToString()}${this.timeToString()}${this.afterToString()}${this.beforeToString()}`;
    return str.trim();
  }

  private buildAlc(searchParams: SearchParams, master: Master) {
    const al: string[] = [];
    if (searchParams.airLineCode) {
      master.airlines.forEach((data) => {
        if (searchParams.airLineCode && searchParams.airLineCode.includes(data.alCd)) {
          al.push(data.alCd);
        }
      });
    }
    return al;
  }

  private buildOal(searchParams: SearchParams) {
    const al: string[] = [];
    if (searchParams.airLineCodeOALAll) {
      al.push("all");
    } else if (searchParams.airLineCodeOAL) {
      searchParams.airLineCodeOAL.forEach((alCd) => al.push(alCd));
    }
    return al;
  }

  private buildFlt(searchParams: SearchParams) {
    return searchParams.flightNo ? searchParams.flightNo : "";
  }

  private buildApo(searchParams: SearchParams) {
    return searchParams.airport ? searchParams.airport : "";
  }

  private buildShip(searchParams: SearchParams) {
    return searchParams.ship ? searchParams.ship : "";
  }

  private buildSpot(searchParams: SearchParams) {
    return searchParams.spot && searchParams.spot.length ? searchParams.spot.join("/") : "";
  }

  private buildDomInt(searchParams: SearchParams) {
    return searchParams.domOrInt === "D" ? "DOM" : searchParams.domOrInt === "I" ? "INT" : "";
  }

  private buildSkdNsk(searchParams: SearchParams) {
    return searchParams.skdOrNsk || "";
  }

  private buildCnl(searchParams: SearchParams) {
    return searchParams.cnlHideFlg ? "hide" : "";
  }

  private buildTime(searchParams: SearchParams) {
    return searchParams.dateTimeRadio ? searchParams.dateTimeRadio : "";
  }

  private buildAfter(searchParams: SearchParams) {
    return searchParams.dateTimeFrom ? searchParams.dateTimeFrom : "";
  }

  private buildBefore(searchParams: SearchParams) {
    return searchParams.dateTimeTo ? searchParams.dateTimeTo : "";
  }

  private alToString() {
    if (this.al.length === 0) {
      return "";
    }

    if (this.al.length >= 2) {
      return `al:${this.al.join("/")}`;
    }
    return `al:${this.al[0]}`;
  }

  private oalToString() {
    if (this.oal.length === 0) {
      return "";
    }

    if (this.oal.length >= 2) {
      return `oal:${this.oal.join("/")}`;
    }
    return `oal:${this.oal[0]}`;
  }

  private FltToString() {
    return this.flt ? (this.casualFlg ? ` flt:*${this.flt}` : ` flt:${this.flt}`) : "";
  }

  private ApoToString() {
    return this.apo ? ` apo:${this.apo}` : "";
  }

  private ShipToString() {
    return this.ship ? ` ship:${this.ship}` : "";
  }

  private SpotToString() {
    return this.spot ? ` spot:${this.spot}` : "";
  }

  private domIntToString() {
    return this.domInt ? ` is:${this.domInt}` : "";
  }

  private skdNskToString() {
    return this.skdNsk ? ` is:${this.skdNsk}` : "";
  }

  private cnlToString() {
    return this.cnl ? ` cnl:${this.cnl}` : "";
  }

  private timeToString() {
    return this.time ? ` is:${this.time}` : "";
  }

  private afterToString() {
    return this.after ? ` after:${this.after}` : "";
  }

  private beforeToString() {
    return this.before ? ` before:${this.before}` : "";
  }

  private casualFlgToString() {
    return this.casualFlg ? "*" : "";
  }
}
