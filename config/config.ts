export namespace ServerConfig {
    export const API_SERVER_PRIORITY = "http://localhost:3000";
    export const API_SERVER_COMMON = "http://localhost:3000";
    export const USER_LOGIN_URL = "http://localhost:3333/login";
    export const MYPAGE_URL = "http://localhost:3333/content/mypage";
    export const HELP_URL = "http://localhost:3333/content/help";
    export const BASE_ROUTE = "/spa";
    export const MQTT_PUBSUB_VERSION = "V3";

    export const MQTT_KEEP_ALIVE = 30;
    export const MQTT_SESSION_EXPIRY = 90;

    export const BUFFER_INTERVAL = 10;

    export const AWS_REGION = "ap-northeast-1";

    export const COGNITO_APP_CLIENT_ID = "5s4fimnru8dfnohq34ro6tou52";

    export const COGNITO_EXTERNAL_USER_POOL_ID = "ap-northeast-1_cFWwa4QhL";

    export const COGNITO_INTERNAL_USER_LOGIN_REDIRECT_PATH = "/spa/cognito_redirect";
    export const COGNITO_INTERNAL_USER_LOGIN_REDIRECT_PATH_IOS = "/spa/cognito_redirect";
    export const COGNITO_INTERNAL_USER_LOGOUT_REDIRECT_PATH = "";
    export const COGNITO_INTERNAL_USER_LOGOUT_REDIRECT_PATH_IOS = "";
    export const COGNITO_INTERNAL_USER_LOGOUT_ENDPOINT = "https://soala-poc-user-pool.auth.ap-northeast-1.amazoncognito.com/logout";
    export const COGNITO_INTERNAL_USER_LOGIN_ENDPOINT =
      "https://soala-poc-user-pool.auth.ap-northeast-1.amazoncognito.com/oauth2/authorize";
    export const COGNITO_INTERNAL_USER_TOKEN_ENDPOINT = "https://soala-poc-user-pool.auth.ap-northeast-1.amazoncognito.com/oauth2/token";
    export const COGNITO_INTERNAL_USER_IDP = "soala-poc-cognito-id-provider";

    export const COGNITO_IDENTITY_POOL_ID = "ap-northeast-1:b04778ff-5604-4a8d-94c1-b957ac5e5a5d";
    export const API_ENDPOINT_POLICY_ATTACH = "https://yapl7txv76.execute-api.ap-northeast-1.amazonaws.com/soalapoc/iot-attach-policy-py";

    export const IOT_ENDPOINT = "a3hxsj7sht1zh5-ats.iot.ap-northeast-1.amazonaws.com";
    export const IOT_CLIENT_ID_PREFIX = "soala-poc-test";
};
