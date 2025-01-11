import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group m-1">
        <label htmlFor="email">Email</label>
        <input
          className="form-control"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
        />
      </div>
      <div className="form-group m-1">
        <label htmlFor="password">Password</label>
        <input
          className="form-control"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
