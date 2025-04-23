export interface LayoutProps {
  header: {
    default: string;
    tablet: string;
    mobile: string;
    moblieSlim: string;
    statusBar: string;
  };

  footer: {
    default: string;
    mobile: string;
  };
}

const layout: LayoutProps = {
  header: {
    default: "56px",
    tablet: "98px", // ステータスバーの22px分を加算しておく
    mobile: "72px", // ステータスバーの22px分を加算しておく
    moblieSlim: "50px", // ステータスバーの22px分を加算しておく
    statusBar: "22px",
  },
  footer: {
    default: "0px",
    mobile: "54px",
  },
};

export default layout;
