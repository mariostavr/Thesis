/*======================================================================*/
/*				   	   		   MODAL - REGISTER        						*/
/*======================================================================*/

//> Modules and Dependecies
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';

//> Components
import { UserContext } from "../components/shared/UserContext";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";

export default function Register() {
   const [email, setEmail] = useState("");
   const [dateOfBirth, setDateOfBirth] = useState("");
   const [password, setPassword] = useState("");
   const [confirmationPassword, setConfirmationPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [, setToken] = useContext(UserContext);
   const [isLoading, setIsLoading] = useState(false);

   const navigate = useNavigate();

   async function submitRegistration() {
      setIsLoading(true);
      const requestOptions = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ username: "User", dateOfBirth: dateOfBirth, email: email, password: password }),
      };

      const response = await fetch("/signup", requestOptions);
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
      setErrorMessage("");
      e.preventDefault();
      if (password === confirmationPassword && password.length > 5) {
         submitRegistration();
      } else {
         setErrorMessage(
            "Ensure that the passwords match and greater than 5 characters"
         );
      }
   };

   return (
      <div>
         <h2>Register</h2>
         <Form className="form" onSubmit={handleSubmit}>
            <FloatingLabel controlId='email' label='Email' className="mb-2">
               <Form.Control type="email" placeholder='youremail@hotmail.com' value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
            </FloatingLabel>
            <FloatingLabel controlId='birth' label='Date of Birth' className="mb-2">
               <Form.Control type="date" placeholder='1998-01-19' value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)} required />
            </FloatingLabel>
            <FloatingLabel controlId='password' label='Password' className="mb-2">
               <Form.Control type="password" placeholder='Password' value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
            </FloatingLabel>
            <FloatingLabel controlId='confPass' label='Confirm Passeord' className="mb-2">
               <Form.Control type="password" placeholder='Confirm Password' value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)} required />
            </FloatingLabel>
            <div style={{ margin: "30px 0", color: "white" }}>
               {errorMessage && errorMessage}
            </div>
            {isLoading ? (
               <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status" style={{ marginTop: "20px", color: "white" }}>
                     <span className="visually-hidden">Loading...</span>
                  </div>
               </div>
            ) : (
               <button type="submit" className="btn" variant="primary">Sign Up</button>
            )}
         </Form>
      </div>
   );
};