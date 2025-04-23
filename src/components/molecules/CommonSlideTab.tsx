import React from "react";
import styled from "styled-components";
import { storage } from "../../lib/storage";
import tabArrowIconSvg from "../../assets/images/icon/modal_tab_arrow.svg";

interface Props {
  tabs: { name: string; enabled: boolean }[];
  currentTabName?: string;
  onClickTab: (tabName: string) => void;
}

interface State {
  tabHeaderScrollPosition: number;
  tabHeaderLeftPosition: number;
  pastCurrentTabName: string;
}

const ARROW_WIDTH = 25;

export default class CommonSlideTab extends React.Component<Props, State> {
  private tabHeaderRef: React.RefObject<HTMLDivElement>;
  private timeIdScrollEnd?: NodeJS.Timeout = undefined;
  private timeIdSmoothScroll?: number = undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      tabHeaderScrollPosition: 0,
      tabHeaderLeftPosition: 0,
      pastCurrentTabName: "",
    };
    this.tabHeaderRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (this.props.currentTabName !== undefined) {
      this.changeTab(this.props.currentTabName);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // State経由でスクロール位置が変化した場合、反映する
    if (this.tabHeaderRef.current && this.state.tabHeaderScrollPosition !== prevState.tabHeaderScrollPosition) {
      const tabHeaderCurrent = this.tabHeaderRef.current;
      // バウンススクロール時の挙動に合わせるため、スクロール位置の左限と右限を合わせる
      const tabHeaderCurrentScrollLeftLimit = tabHeaderCurrent.scrollWidth - tabHeaderCurrent.clientWidth;
      const tabHeaderCurrentScrollLeft = Math.min(Math.max(tabHeaderCurrent.scrollLeft, 0), tabHeaderCurrentScrollLeftLimit);
      // 手動でスクロールしていた場合には、位置合わせを行わない
      if (tabHeaderCurrentScrollLeft !== this.state.tabHeaderScrollPosition) {
        if (storage.isIpad || storage.isIphone) {
          if (this.timeIdSmoothScroll) {
            window.cancelAnimationFrame(this.timeIdSmoothScroll);
          }
          this.smoothScroll(tabHeaderCurrent.scrollLeft, window.performance.now(), 200);
        } else {
          this.tabHeaderRef.current.scrollTo({ left: this.state.tabHeaderScrollPosition, behavior: "smooth" });
        }
      }
    }

    // タブの表示個数が異なる場合、タブを再描画して位置合わせする
    if (this.props.tabs.length !== prevProps.tabs.length && this.props.currentTabName !== undefined) {
      this.changeTab(this.props.currentTabName);
    }

    // 現在タブ位置が異なる場合、タブを再描画して位置合わせする
    const pastCurrentTabName = prevProps.currentTabName !== undefined ? prevProps.currentTabName : this.state.pastCurrentTabName;
    if (this.props.currentTabName === undefined && prevProps.currentTabName !== undefined) {
      this.setState({ pastCurrentTabName: prevProps.currentTabName });
    } else if (this.props.currentTabName !== undefined && this.props.currentTabName !== pastCurrentTabName) {
      this.changeTab(this.props.currentTabName);
    }
  }

  changeTab = (tabName: string) => {
    if (!this.tabHeaderRef.current || !this.tabHeaderRef.current.parentElement) {
      return;
    }
    const uncastedChildNodes = [...this.tabHeaderRef.current.childNodes];
    if (!uncastedChildNodes.every((item) => item instanceof HTMLDivElement)) {
      return;
    }
    const childNodes = uncastedChildNodes as HTMLDivElement[];
    const currentItemIndex = this.props.tabs.findIndex((tab) => tab.name === tabName && tab.enabled);
    if (currentItemIndex < 0) {
      return;
    }
    const currentItem = childNodes[currentItemIndex];
    const lastItem = childNodes[childNodes.length - 1];
    const tabHeaderViewportWidth = this.tabHeaderRef.current.parentElement.offsetWidth;
    const tabHeaderScrollWidth = lastItem.offsetLeft + lastItem.offsetWidth - this.tabHeaderRef.current.offsetLeft;
    const minimumBothMargin = (tabHeaderViewportWidth - currentItem.offsetWidth) / 2;
    const leftDistance = currentItem.offsetLeft - childNodes[0].offsetLeft;
    const rightDistance = lastItem.offsetLeft + lastItem.offsetWidth - (currentItem.offsetLeft + currentItem.offsetWidth);

    if (tabHeaderScrollWidth <= tabHeaderViewportWidth) {
      // スクロールの必要がない
      this.setState({
        tabHeaderScrollPosition: 0,
        tabHeaderLeftPosition: Math.round((tabHeaderViewportWidth - tabHeaderScrollWidth) / 2),
      });
    } else if (leftDistance < minimumBothMargin) {
      // 左側にあり、真ん中にスライドできないタブを選択
      this.setState({
        tabHeaderScrollPosition: 0,
        tabHeaderLeftPosition: 0,
      });
    } else if (rightDistance < minimumBothMargin) {
      // 右側にあり、真ん中にスライドできないタブを選択
      this.setState({
        tabHeaderScrollPosition: tabHeaderScrollWidth - tabHeaderViewportWidth,
        tabHeaderLeftPosition: 0,
      });
    } else {
      this.setState({
        tabHeaderScrollPosition: Math.round(leftDistance + currentItem.offsetWidth / 2 - tabHeaderViewportWidth / 2),
        tabHeaderLeftPosition: 0,
      });
    }
  };

  handleClick = (tabName: string) => () => {
    const { onClickTab } = this.props;
    if (tabName !== this.props.currentTabName && onClickTab) {
      onClickTab(tabName);
    }
  };

  handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft } = e.currentTarget;
    // バウンススクロール対応
    const tabHeaderCurrent = this.tabHeaderRef.current;
    const tabHeaderCurrentScrollLeftLimit = tabHeaderCurrent
      ? tabHeaderCurrent.scrollWidth - tabHeaderCurrent.clientWidth
      : Number.MAX_VALUE;
    if (this.timeIdScrollEnd) {
      clearTimeout(this.timeIdScrollEnd);
    }
    // iOS, iPadOSでのSmoothScrollの際には、適用しない
    if (this.timeIdSmoothScroll !== undefined) {
      return;
    }
    this.timeIdScrollEnd = setTimeout(() => {
      this.setState({ tabHeaderScrollPosition: Math.min(Math.max(scrollLeft, 0), tabHeaderCurrentScrollLeftLimit) });
    }, 50);
  };

  getTabHeaderWidths = (): { viewportWidth: number; scrollWidth: number } | null => {
    if (!this.tabHeaderRef.current || !this.tabHeaderRef.current.parentElement) {
      return null;
    }
    const items = this.tabHeaderRef.current.childNodes;
    if (items.length === 0) {
      return null;
    }
    const lastItem = items[items.length - 1] as HTMLDivElement;
    const tabHeaderViewportWidth = this.tabHeaderRef.current.parentElement.offsetWidth;
    const tabHeaderScrollWidth = lastItem.offsetLeft + lastItem.offsetWidth - this.tabHeaderRef.current.offsetLeft;

    return { viewportWidth: tabHeaderViewportWidth, scrollWidth: tabHeaderScrollWidth };
  };

  prev = () => {
    this.setState({ tabHeaderScrollPosition: 0 });
  };

  next = () => {
    const tabHeaderWidths = this.getTabHeaderWidths();
    if (tabHeaderWidths === null) {
      return;
    }
    this.setState({ tabHeaderScrollPosition: tabHeaderWidths.scrollWidth - tabHeaderWidths.viewportWidth });
  };

  existsOnLeftSide = (): boolean => this.state.tabHeaderScrollPosition <= 0;
  existsOnRightSide = (): boolean => {
    const tabHeaderWidths = this.getTabHeaderWidths();
    if (tabHeaderWidths === null) {
      return false;
    }
    return this.state.tabHeaderScrollPosition >= tabHeaderWidths.scrollWidth - tabHeaderWidths.viewportWidth;
  };

  isScrollable = (): boolean => {
    const tabHeaderWidths = this.getTabHeaderWidths();
    if (tabHeaderWidths === null) {
      return false;
    }
    return tabHeaderWidths.viewportWidth < tabHeaderWidths.scrollWidth;
  };

  smoothScroll = (beginningScrollLeft: number, beginningPerfMillis: number, durationMillis: number) => {
    if (!this.tabHeaderRef.current) {
      this.timeIdSmoothScroll = undefined;
      return;
    }
    const destinationScrollLeft = this.state.tabHeaderScrollPosition;
    if (!("performance" in window)) {
      this.timeIdSmoothScroll = undefined;
      this.tabHeaderRef.current.scrollTo({ left: destinationScrollLeft });
      return;
    }
    const currentPerfMillis = window.performance.now();
    if (currentPerfMillis - beginningPerfMillis >= durationMillis) {
      // スクロール終了時
      this.timeIdSmoothScroll = undefined;
      this.tabHeaderRef.current.scrollTo({ left: destinationScrollLeft });
      return;
    }
    // スクロール継続時
    this.tabHeaderRef.current.scrollTo({
      left:
        beginningScrollLeft + ((currentPerfMillis - beginningPerfMillis) / durationMillis) * (destinationScrollLeft - beginningScrollLeft),
    });

    this.timeIdSmoothScroll = window.requestAnimationFrame(() =>
      this.smoothScroll(beginningScrollLeft, beginningPerfMillis, durationMillis)
    );
  };

  render() {
    const { currentTabName, tabs } = this.props;
    const isScrollable = this.isScrollable();
    const isLeftSide = this.existsOnLeftSide();
    const isRightSide = this.existsOnRightSide();
    return (
      <Wrapper>
        <TabHeader>
          <TabArrow onClick={this.prev} isVisible={!isLeftSide && isScrollable}>
            <TabArrowPrev />
          </TabArrow>
          <TabHeaderViewport>
            <TabHeaderInner
              ref={this.tabHeaderRef}
              style={{ marginLeft: `${this.state.tabHeaderLeftPosition}px` }}
              onScroll={this.handleScroll}
            >
              {tabs.map((tab) => (
                <TabItemCol key={tab.name}>
                  <TabItem
                    onClick={tab.enabled ? this.handleClick(tab.name) : undefined}
                    active={tab.name === currentTabName}
                    enabled={tab.enabled}
                    currentTabName={currentTabName}
                  >
                    {tab.name}
                  </TabItem>
                </TabItemCol>
              ))}
            </TabHeaderInner>
          </TabHeaderViewport>
          <TabArrow onClick={this.next} isVisible={!isRightSide && isScrollable}>
            <TabArrowNext />
          </TabArrow>
        </TabHeader>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;

const TabHeader = styled.div`
  background-color: #eeeeee;
  display: flex;
  height: 36px;
  align-items: center;
`;

const TabHeaderViewport = styled.div`
  height: 100%;
  flex: 1;
  overflow: hidden;
`;

const TabHeaderInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  //  transition: margin-left 0.2s;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TabArrow = styled.div<{ isVisible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.isVisible ? "pointer" : "default")};
  width: ${ARROW_WIDTH}px;
  height: 100%;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 0.2s;
`;

const TabArrowNext = styled.img.attrs({ src: tabArrowIconSvg })`
  width: 10px;
  height: 9.33px;
`;

const TabArrowPrev = styled(TabArrowNext)`
  transform: rotateZ(180deg);
`;

const TabItemCol = styled.div`
  font-size: 14px;
  text-align: center;
  padding: 0 7px;
`;
const TabItem = styled.div<{ active?: boolean; enabled?: boolean; currentTabName?: string }>`
  display: inline-block;
  border-radius: 9px;
  padding: 2px 8px;
  ${({ enabled }) => enabled && "cursor: pointer;"}
  user-select: none;

  ${({ currentTabName }) => {
    if (currentTabName === "Emergency" || currentTabName === "DEP MVT" || currentTabName === "ARR MVT" || currentTabName === "Irregular") {
      return "color: #346181;";
    }

    return "";
  }};

  ${({ active, enabled }) => {
    if (enabled) {
      if (active) {
        return `
          background-color: #346181;
          color: #fff;
         `;
      }
    } else {
      return "opacity: 0.6";
    }

    return "";
  }};
`;
