import React from "react";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import "./HomePage.css";
const schema = yup.object({
  auctionId: yup.string().required("Auction ID is required"),
  accountId: yup.string().required("Account ID is required"),
});
function HomePage({ history }) {
  const handleSubmit = async (values) => {
    const isValid = await schema.validate(values);
    if (!isValid) {
      return;
    }
    localStorage.setItem("chatData", JSON.stringify(values));
    history.push("/console");
  };
  return (
    <div className="home-page">
      <h1>Join Chat</h1>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={JSON.parse(localStorage.getItem("chatData") || "{}")}
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
                <Form.Label>Account Id</Form.Label>
                <Form.Control
                  type="text"
                  name="accountId"
                  placeholder="Account Id"
                  value={values.accountId || ""}
                  onChange={handleChange}
                  isInvalid={touched.accountId && errors.accountId}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="auctionId">
                <Form.Label>Auction Id</Form.Label>
                <Form.Control
                  type="text"
                  name="auctionId"
                  placeholder="Auction Id"
                  value={values.auctionId || ""}
                  onChange={handleChange}
                  isInvalid={touched.auctionId && errors.auctionId}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.auctionId}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button type="submit" style={{ marginRight: "10px" }}>
              Join
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default HomePage;
