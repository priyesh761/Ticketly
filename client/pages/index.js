import axios from "axios";

const LandingPage = ({ currentUser }) => {
  return <h1>LandingPage</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window == "undefined") {
    // On server
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: req.headers, // Forward Host + Cookies
      }
    );
    return data;
  } else {
    // On Client
    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }
};

export default LandingPage;
