import React from "react";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import io from "socket.io-client";
import "./ChatRoomPage.css";
import { getAuctionMessages } from "./requests";
import constants from "./constants";

const socket = io(constants.API_PATH);
const getChatData = () => {
  return JSON.parse(localStorage.getItem("chatData"));
};
const schema = yup.object({
  message: yup.string().required("Message is required"),
});
function ChatRoomPage() {
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const handleSubmit = async (evt) => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    const data = Object.assign({}, evt);
    data.auctionId = getChatData().auctionId;
    data.accountId = getChatData().accountId;
    data.message = evt.message;
    socket.emit("message", data);
  };
  const connectToRoom = () => {
    socket.on("connect", (data) => {
      socket.emit("join", getChatData().auctionId);
    });
    socket.on("newMessage", (data) => {
      getMessages();
    });
    setInitialized(true);
  };
  const getMessages = async () => {
    const response = await getAuctionMessages(getChatData().auctionId);
    setMessages(response.data);
    setInitialized(true);
  };
  useEffect(() => {
    if (!initialized) {
      getMessages();
      connectToRoom();
    }
  });
  return (
    <div className="chat-room-page">
      <h1>
        Bidding Auction: {getChatData().auctionId}. Bidding Account:{" "}
        {getChatData().accountId}
      </h1>
      <div className="chat-box">
        {messages.map((m, i) => {
          return (
            <div className="col-12" key={i}>
              <div className="row">
                <div className="col-2">{m.accountId}</div>
                <div className="col">{m.message}</div>
                <div className="col-3">{m.createdAt}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Formik
        initialValues={{}}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isInvalid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="accountId">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  type="text"
                  name="message"
                  placeholder="Message"
                  value={values.message || ""}
                  onChange={handleChange}
                  isInvalid={touched.message && errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button type="submit" style={{ marginRight: "10px" }}>
              Send
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default ChatRoomPage;
