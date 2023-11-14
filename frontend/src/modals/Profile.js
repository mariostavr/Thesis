/*======================================================================*/
/*				   	   		    MODAL - PROFILE       		   				*/
/*======================================================================*/

//> Modules and Dependecies
import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";

//> Styles
import "../styles/modal.css";

export default function Profile ({ userProfile }) {
  return (
    <div className="container">
      <div className="personal-info" style={{ padding: "30px 0" }}>
        <Form className="form">
          <FloatingLabel controlId="username" label="Username" className="mb-2">
            <Form.Control type="text" defaultValue={userProfile.username} placeholder="Username"/>
          </FloatingLabel>

          <FloatingLabel controlId="email" label="Email" className="mb-2">
            <Form.Control type="text" defaultValue={userProfile.email} placeholder="Email" disabled/>
          </FloatingLabel>
        </Form>
      </div>
    </div>
  );
};