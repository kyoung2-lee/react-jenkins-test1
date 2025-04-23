"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FilterKeyword {
    constructor(searchParams, master) {
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
    buildAlc(searchParams, master) {
        const al = [];
        if (searchParams.airLineCode) {
            master.airlines.forEach((data) => {
                if (searchParams.airLineCode && searchParams.airLineCode.includes(data.alCd)) {
                    al.push(data.alCd);
                }
            });
        }
        return al;
    }
    buildOal(searchParams) {
        const al = [];
        if (searchParams.airLineCodeOALAll) {
            al.push("all");
        }
        else if (searchParams.airLineCodeOAL) {
            searchParams.airLineCodeOAL.forEach((alCd) => al.push(alCd));
        }
        return al;
    }
    buildFlt(searchParams) {
        return searchParams.flightNo ? searchParams.flightNo : "";
    }
    buildApo(searchParams) {
        return searchParams.airport ? searchParams.airport : "";
    }
    buildShip(searchParams) {
        return searchParams.ship ? searchParams.ship : "";
    }
    buildSpot(searchParams) {
        return searchParams.spot && searchParams.spot.length ? searchParams.spot.join("/") : "";
    }
    buildDomInt(searchParams) {
        return searchParams.domOrInt === "D" ? "DOM" : searchParams.domOrInt === "I" ? "INT" : "";
    }
    buildSkdNsk(searchParams) {
        return searchParams.skdOrNsk || "";
    }
    buildCnl(searchParams) {
        return searchParams.cnlHideFlg ? "hide" : "";
    }
    buildTime(searchParams) {
        return searchParams.dateTimeRadio ? searchParams.dateTimeRadio : "";
    }
    buildAfter(searchParams) {
        return searchParams.dateTimeFrom ? searchParams.dateTimeFrom : "";
    }
    buildBefore(searchParams) {
        return searchParams.dateTimeTo ? searchParams.dateTimeTo : "";
    }
    alToString() {
        if (this.al.length === 0) {
            return "";
        }
        if (this.al.length >= 2) {
            return `al:${this.al.join("/")}`;
        }
        return `al:${this.al[0]}`;
    }
    oalToString() {
        if (this.oal.length === 0) {
            return "";
        }
        if (this.oal.length >= 2) {
            return `oal:${this.oal.join("/")}`;
        }
        return `oal:${this.oal[0]}`;
    }
    FltToString() {
        return this.flt ? (this.casualFlg ? ` flt:*${this.flt}` : ` flt:${this.flt}`) : "";
    }
    ApoToString() {
        return this.apo ? ` apo:${this.apo}` : "";
    }
    ShipToString() {
        return this.ship ? ` ship:${this.ship}` : "";
    }
    SpotToString() {
        return this.spot ? ` spot:${this.spot}` : "";
    }
    domIntToString() {
        return this.domInt ? ` is:${this.domInt}` : "";
    }
    skdNskToString() {
        return this.skdNsk ? ` is:${this.skdNsk}` : "";
    }
    cnlToString() {
        return this.cnl ? ` cnl:${this.cnl}` : "";
    }
    timeToString() {
        return this.time ? ` is:${this.time}` : "";
    }
    afterToString() {
        return this.after ? ` after:${this.after}` : "";
    }
    beforeToString() {
        return this.before ? ` before:${this.before}` : "";
    }
    casualFlgToString() {
        return this.casualFlg ? "*" : "";
    }
}
exports.default = FilterKeyword;
//# sourceMappingURL=FilterKeyword.js.map