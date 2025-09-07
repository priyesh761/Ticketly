import axios from "axios";

export default ({ req }) => {
  if (typeof window == "undefined") {
    // On Server
    return axios.create({
      baseURL: "http://www.ticketly.priyesh-shetty.dev/",
      headers: req.headers,
    });
  } else {
    // On Client
    return axios.create({
      baseURL: "/",
    });
  }
};
