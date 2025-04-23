"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPolicyToIdentityId = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../../config/config");
const attachPolicyToIdentityId = async (idToken) => {
    if (!idToken) {
        return false;
    }
    const response = await axios_1.default.post(config_1.ServerConfig.API_ENDPOINT_POLICY_ATTACH, {}, {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });
    console.log({ response });
    if (response.status !== 200) {
        console.error({ response });
        return false;
    }
    return true;
};
exports.attachPolicyToIdentityId = attachPolicyToIdentityId;
//# sourceMappingURL=attachPolicy.js.map