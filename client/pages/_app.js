import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="container-fluid">
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const requestClient = buildClient(appContext.ctx);
  const { data } = await requestClient.get("/api/users/currentuser");
  const pageProps =
    (await appContext.Component.getInitialProps?.(
      appContext.ctx,
      requestClient,
      data.currentUser
    )) ?? {};
  return { pageProps, ...data };
};

export default AppComponent;
