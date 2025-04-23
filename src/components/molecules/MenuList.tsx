import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { funcAuthCheck } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import MenuBarChart from "../../assets/images/menu/menu-barchart.svg";
import MenuFIS from "../../assets/images/menu/menu-fis.svg";
import MenuMyPage from "../../assets/images/menu/menu-mypage.svg";
import MenuFlightSearch from "../../assets/images/menu/menu-flight-search.svg";
import MenuIssue from "../../assets/images/menu/menu-issue.svg";
import MenuSetting from "../../assets/images/menu/menu-setting.svg";
import MenuHelp from "../../assets/images/menu/menu-help.svg";
import MenuBb from "../../assets/images/menu/menu-bb.svg";
import MenuBroadcast from "../../assets/images/menu/menu-broadcast.svg";
import MenuOalSchedule from "../../assets/images/menu/menu-oal_schedule.svg";
import MenuMySchedule from "../../assets/images/menu/menu-myschedule.svg";

interface Props {
  jobAuth: JobAuthApi.JobAuth[];
  onClickLink: (pathName: string | null, isNewTab: boolean) => void;
}

class MenuList extends React.Component<Props> {
  handleOnClickLink(pathName: string | null, externalUrl: string | null) {
    if (storage.isPc) {
      if (pathName) {
        // 新規タブで開く場合、セッションストレージの内容を遷移先に渡す
        localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
      } else if (externalUrl) {
        // ホスト（ドメイン名）を取得する
        const result = externalUrl.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
        if (result) {
          if (window.location.host === result[1]) {
            // ドメイン名が一致する場合、セッションストレージの内容を遷移先に渡す
            localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
          }
        }
      }
    }
    const isNewTab = storage.isPc;
    this.props.onClickLink(pathName, isNewTab);
  }

  render() {
    const { jobAuth } = this.props;
    const menuList = jobAuth.filter((auth) => auth.dispFlg && auth.funcCat === "1").sort((a, b) => a.dispSeq - b.dispSeq);
    const bookmarkList = jobAuth.filter((auth) => auth.dispFlg && auth.funcCat === "4").sort((a, b) => a.dispSeq - b.dispSeq);
    const linkTarget = storage.isPc ? "_blank" : undefined;
    let urlPrefix = "";
    if (storage.terminalCat !== Const.TerminalCat.pc) {
      // ネイティブアプリの方でブラウザを開く処理が行われるようにプレフィックスをつける
      urlPrefix = "app:";
    }

    return (
      <Wrapper>
        <MenuLinks>
          {menuList.map((menu) => {
            if (funcAuthCheck(menu.funcId, menuList) === false) {
              return undefined;
            }

            let item: React.ReactNode = null;

            switch (menu.funcId) {
              case Const.FUNC_ID.openBarChart: // バーチャート
                item = (
                  <Link
                    to={Const.PATH_NAME.barChart}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.barChart, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuBarChartIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">Barchart</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;

              case Const.FUNC_ID.openFis: // FIS
                item = (
                  <Link to={Const.PATH_NAME.fis} target={linkTarget} onClick={() => this.handleOnClickLink(Const.PATH_NAME.fis, null)}>
                    <MenuContainer>
                      <MenuBody>
                        <MenuFISIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">FIS</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              case Const.FUNC_ID.openFlightSearch: // 便一覧
                item = (
                  <Link
                    to={Const.PATH_NAME.flightSearch}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.flightSearch, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuFlightSearchIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">Flight Search</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              case Const.FUNC_ID.openAirportIssue: // 空港発令・保安情報
                item = (
                  <Link
                    to={Const.PATH_NAME.issueSecurity}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.issueSecurity, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuIssueIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">Airport Issue</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;

              case Const.FUNC_ID.openUserSetting: // ユーザー設定
                item = (
                  <Link
                    to={Const.PATH_NAME.userSetting}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.userSetting, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuSettingIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">User Setting</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              case Const.FUNC_ID.openBulletinBoard:
                item = (
                  <Link
                    to={Const.PATH_NAME.bulletinBoard}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.bulletinBoard, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuBbIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">B.B.</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              case Const.FUNC_ID.openBroadcast:
                item = (
                  <Link
                    to={Const.PATH_NAME.broadcast}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.broadcast, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuBroadcastIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">Broadcast</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              case Const.FUNC_ID.openOalFlightSchedule:
                item = (
                  <Link
                    to={Const.PATH_NAME.oalFlightSchedule}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.oalFlightSchedule, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuOalScheduleIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">OAL Schedule</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              case Const.FUNC_ID.mySchedule:
                item = (
                  <Link
                    to={Const.PATH_NAME.mySchedule}
                    target={linkTarget}
                    onClick={() => this.handleOnClickLink(Const.PATH_NAME.mySchedule, null)}
                  >
                    <MenuContainer>
                      <MenuBody>
                        <MenuMyScheduleIcon />
                      </MenuBody>
                      <MenuFooter className="menuFooter">My Schedule</MenuFooter>
                    </MenuContainer>
                  </Link>
                );
                break;
              default:
                break;
            }
            if (item) {
              return <li key={menu.funcId}>{item}</li>;
            }
            return item;
          })}
          <li>
            <Link to={Const.PATH_NAME.myPage} target={linkTarget} onClick={() => this.handleOnClickLink(Const.PATH_NAME.myPage, null)}>
              <MenuContainer>
                <MenuBody>
                  <MenuMyPageIcon />
                </MenuBody>
                <MenuFooter className="menuFooter">MyPage</MenuFooter>
              </MenuContainer>
            </Link>
          </li>
          <li>
            <Link to={Const.PATH_NAME.help} target={linkTarget} onClick={() => this.handleOnClickLink(Const.PATH_NAME.help, null)}>
              <MenuContainer>
                <MenuBody>
                  <MenuHelpIcon />
                </MenuBody>
                <MenuFooter className="menuFooter">Help</MenuFooter>
              </MenuContainer>
            </Link>
          </li>
        </MenuLinks>
        {bookmarkList.length > 0 ? (
          <>
            <SepLine />
            <BookMarks>
              {bookmarkList.map((menu, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                  <a
                    // eslint-disable-next-line no-script-url
                    href={menu.funcDtl ? urlPrefix + menu.funcDtl : "javascript:void(0)"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => this.handleOnClickLink(null, menu.funcDtl)}
                  >
                    {menu.funcIcon ? <img src={`data:image/png;base64,${menu.funcIcon}`} alt="" /> : <div />}
                  </a>
                  <div>{menu.funcName}</div>
                </li>
              ))}
            </BookMarks>
          </>
        ) : (
          ""
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  max-height: inherit;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MenuBarChartIcon = styled.img.attrs({ src: MenuBarChart })`
  width: 44.72px;
  height: 45.38px;
`;

const MenuFISIcon = styled.img.attrs({ src: MenuFIS })`
  width: 51.745px;
  height: 47.862px;
`;

const MenuMyPageIcon = styled.img.attrs({ src: MenuMyPage })`
  width: 33.962px;
  height: 33.962px;
`;

const MenuFlightSearchIcon = styled.img.attrs({
  src: MenuFlightSearch,
})`
  width: 48.505px;
  height: 45.271px;
`;

const MenuIssueIcon = styled.img.attrs({ src: MenuIssue })`
  width: 31.61px;
  height: 30.685px;
`;

const MenuSettingIcon = styled.img.attrs({ src: MenuSetting })`
  width: 33.181px;
  height: 33.036px;
`;

const MenuHelpIcon = styled.img.attrs({ src: MenuHelp })`
  width: 21.698px;
  height: 36.136px;
`;

const MenuBbIcon = styled.img.attrs({ src: MenuBb })`
  width: 47px;
  height: 47px;
`;

const MenuBroadcastIcon = styled.img.attrs({ src: MenuBroadcast })`
  width: 41px;
  height: 41px;
`;

const MenuOalScheduleIcon = styled.img.attrs({ src: MenuOalSchedule })`
  width: 52px;
  height: 52px;
`;

const MenuMyScheduleIcon = styled.img.attrs({ src: MenuMySchedule })`
  width: 50px;
  height: 53px;
`;

const MenuLinks = styled.ul`
  list-style: none;
  padding: 7px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;

  li {
    text-align: center;
    margin: 7px;
    font-size: 14px;
    a {
      display: flex;
      text-decoration: none;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
    }
  }
`;

const MenuContainer = styled.div`
  width: 106px;
  min-height: 106px;
  border-radius: 6px;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: ${(props) => props.theme.color.button.PRIMARY};
  color: ${(props) => props.theme.color.WHITE};
  &:hover {
    background: ${(props) => props.theme.color.button.PRIMARY_HOVER};
    .menuFooter {
      background: #4e7591;
    }
  }
  &:active {
    background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
    .menuFooter {
      background: #446d88;
    }
  }
`;
const MenuBody = styled.div`
  flex-basis: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const MenuFooter = styled.div`
  flex-basis: 27.67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #60859e;
  border-radius: 0 0 6px 6px;
`;
const BookMarks = styled(MenuLinks)`
  border-radius: 0px 0px 6px 6px;
  li {
    a {
      img {
        width: 106px;
        height: 106px;
        border-radius: 6px;
        background: ${(props) => props.theme.color.WHITE};
        &:hover {
          opacity: 0.8;
        }
      }
      div {
        width: 106px;
        height: 106px;
        border-radius: 6px;
        border-style: solid;
        border-width: 1px;
        border-color: ${(props) => props.theme.color.button.PRIMARY};
        background: ${(props) => props.theme.color.WHITE};
      }
    }
    > div:last-child {
      line-height: 19px;
      margin-top: 3px;
      color: #666666;
      width: 106px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
const SepLine = styled.hr`
  border-top: 1px solid #c9d3d0;
`;

export default MenuList;
