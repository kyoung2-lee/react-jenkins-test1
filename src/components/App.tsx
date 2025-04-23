// import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";

import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

// import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import { Const } from "../lib/commonConst";
import { funcAuthCheck } from "../lib/commonUtil";
import { storage } from "../lib/storage";
import { ServerConfig } from "../../config/config";
import lightTheme from "../themes/themeLight";
import GlobalStyle from "./GlobalStyle";
import { useAppSelector } from "../store/hooks";

import Auth from "./pages/Auth";
import BarChart from "./pages/BarChart";
import Broadcast from "./pages/Broadcast";
import Fis from "./pages/Fis";
import FlightSearch from "./pages/FlightSearch";
import Help from "./pages/Help";
import Error from "./pages/Error";
import JobAuth from "./pages/JobAuth";
import IssueSecurity from "./pages/IssueSecurity";
import MyPage from "./pages/MyPage";
import NotificationList from "./pages/NotificationList";
import Profile from "./pages/Profile";
import UserSetting from "./pages/UserSetting";
import { BulletinBoard } from "./pages/BulletinBoard";
import OalFlightSchedule from "./pages/OalFlightSchedule";
import MySchedule from "./pages/MySchedule";
import CognitoAuthenticated from "./pages/CognitoAuthenticated";
import CognitoRedirect from "./pages/CognitoRedirect";
import CognitoAuth from "./pages/CognitoAuth";

const App: React.FC = () => {
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const [reloadBb, setReloadBb] = useState<(() => void) | undefined>(undefined);

  const handleClickBb = () => {
    if (reloadBb) {
      reloadBb();
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <BrowserRouter basename={ServerConfig.BASE_ROUTE}>
        <Wrapper terminalCat={storage.terminalCat}>
          <Switch>
            <Route exact path={Const.PATH_NAME.cognitoAuth} component={CognitoAuth} />
            <Route exact path={Const.PATH_NAME.cognitoRedirect} component={CognitoRedirect} />
            <CognitoAuthenticated>
              <Route exact path={Const.PATH_NAME.jobAuth} component={JobAuth} />
              <Route exact path={Const.PATH_NAME.error} component={Error} />
              {!jobAuth.info.token && <Redirect to={Const.PATH_NAME.jobAuth} />}
              <Auth onClickBb={handleClickBb}>
                <Switch>
                  <Route exact path={Const.PATH_NAME.home} component={MyPage} />
                  <Route exact path={Const.PATH_NAME.profile} component={Profile} />
                  <Route exact path={Const.PATH_NAME.myPage} component={MyPage} />
                  <Route exact path={Const.PATH_NAME.help} component={Help} />
                  <Route
                    exact
                    path={Const.PATH_NAME.bulletinBoard}
                    render={(props) => <BulletinBoard {...props} setReloadBb={(func) => setReloadBb((_prev) => func)} />}
                  />
                  {jobAuth.jobAuth.map((menu) => {
                    if (funcAuthCheck(menu.funcId, jobAuth.jobAuth) === false) {
                      return undefined;
                    }
                    switch (menu.funcId) {
                      case Const.FUNC_ID.openBarChart:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.barChart} component={BarChart} />;
                      case Const.FUNC_ID.openFis:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.fis} component={Fis} />;
                      case Const.FUNC_ID.openFlightSearch:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.flightSearch} component={FlightSearch} />;
                      case Const.FUNC_ID.openAirportIssue:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.issueSecurity} component={IssueSecurity} />;
                      case Const.FUNC_ID.openUserSetting:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.userSetting} component={UserSetting} />;
                      case Const.FUNC_ID.openNotificationList:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.notification} component={NotificationList} />;
                      case Const.FUNC_ID.openBroadcast:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.broadcast} component={Broadcast} />;
                      case Const.FUNC_ID.openOalFlightSchedule:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.oalFlightSchedule} component={OalFlightSchedule} />;
                      case Const.FUNC_ID.mySchedule:
                        return <Route key={menu.funcId} exact path={Const.PATH_NAME.mySchedule} component={MySchedule} />;
                      default:
                        return undefined;
                    }
                  })}
                </Switch>
              </Auth>
            </CognitoAuthenticated>
          </Switch>
        </Wrapper>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const Wrapper = styled.div<{ terminalCat: string | null }>`
  background: #f6f6f6;
  min-width: ${({ terminalCat }) => (terminalCat === Const.TerminalCat.pc ? "1024px" : "100%")};
  height: 100%;
`;

export default hot(App);
