/*======================================================================*/
/*                             USER PROVIDER                            */
/*======================================================================*/

//> Modules and Dependecies
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserProvider (props) {
   const [userAccessToken, setUserAccessToken] = useState(localStorage.getItem("user_token"));

   useEffect(() => {
      const fetchUser = async () => {
         const requestOptions = {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: "Bearer " + userAccessToken,
            },
         };
         const response = await fetch("/users/profile", requestOptions);

         if (!response.ok) {
            setUserAccessToken(null);
         }
         localStorage.setItem("user_token", userAccessToken);
      };
      fetchUser();
   }, [userAccessToken]);

   return (
      <UserContext.Provider value={[userAccessToken, setUserAccessToken]}>
         {props.children}
      </UserContext.Provider>
   );
};