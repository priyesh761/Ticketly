import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const requestClient = buildClient(appContext.ctx);
  const { data } = await requestClient.get("/api/users/currentuser");
  const pageProps =
    (await appContext.Component.getInitialProps?.(appContext.ctx)) ?? {};
  return { pageProps, ...data };
};

export default AppComponent;
