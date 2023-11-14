/*======================================================================*/
/*                            PROTECTED ROUTE                           */
/*======================================================================*/

//> Modules and Dependecies
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function ProtectedRoute({ children, accessBy }) {
   const [userAccessToken] = useContext(UserContext);

   if (accessBy === "non-authenticated") {
      if (!userAccessToken) {
         return children;
      }
   } else if (accessBy === "authenticated") {
      if (userAccessToken) {
         return children;
      }
   }
   return <Navigate to="/"></Navigate>;
};
