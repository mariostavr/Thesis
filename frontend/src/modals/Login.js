/*======================================================================*/
/*				   	   		   MODAL - LOGIN            						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

//> Components
import { UserContext } from "../components/shared/UserContext";

//> Style - CSS Files
import "../styles/modal.css"

export default function Login() {

   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [, setToken] = useContext(UserContext);

   async function submitLogin() {
      setIsLoading(true);
      const requestOptions = {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: JSON.stringify(
            `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
         ),
      };
      const response = await fetch("/login", requestOptions);
      const data = await response.json();

      if (response.ok) {
         setToken(data.access_token);
         navigate("/home");
      } else {
         setErrorMessage(data.detail);
      }
      setIsLoading(false);
   };

   function handleSubmit(e) {
      e.preventDefault();
      setErrorMessage("");
      submitLogin();
   };

   return (
      <div>
         <h2>Login</h2>
         <Form className="form" onSubmit={handleSubmit}>
            <FloatingLabel controlId='email' label='Email' className="mb-2">
               <Form.Control type="email" placeholder='youremail@hotmail.com' value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
            </FloatingLabel>

            <FloatingLabel controlId="password" label='Password' className="mb-2">
               <Form.Control type="password" placeholder='Password' value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
            </FloatingLabel>
            <div style={{ margin: "30px 0", color: "white" }}>
               {errorMessage && errorMessage}
            </div>
            {isLoading ? (
               <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status" style={{ marginTop: "20px", color: "white" }}></div>
               </div>
            ) : (
               <button type="submit" className="btn" variant="primary">Sign In</button>
            )}
         </Form>
      </div >
   );
};