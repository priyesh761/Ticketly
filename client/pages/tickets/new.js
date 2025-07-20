import { useState } from "react";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: (response) =>
      console.log("Ticket created successfully", response),
  });

  const onBlur = () => {
    setPrice((prev) => {
      const value = parseFloat(prev);
      if (isNaN(value)) {
        return prev;
      }
      return value.toFixed(2);
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };
  return (
    <div>
      <h1>Create a New Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="my-1">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="my-1">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="my-1 btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
