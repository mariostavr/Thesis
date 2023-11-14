/*======================================================================*/
/*                                  APP     					        */
/*======================================================================*/

import "./App.css"

import Homepage from "./pages/Homepage"
import Home from "./pages/Home"
import AgentsPage from "./pages/AgentsPage"
import Marketpage from "./pages/MarketsPage"
import Monitor from "./pages/Monitor"

import React from "react";
import { Routes, Route } from "react-router-dom"

import UserProvider from "./components/shared/UserContext"
import ProtectedRoute from "./components/shared/ProtectedRoute"

const App = () => {


    return (
        <>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Homepage />}></Route>

                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute accessBy="authenticated">
                                <Home />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/agents"
                        element={
                            <ProtectedRoute accessBy="authenticated">
                                <AgentsPage />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/markets"
                        element={
                            <ProtectedRoute accessBy="authenticated">
                                <Marketpage />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/monitor"
                        element={
                            <ProtectedRoute accessBy="authenticated">
                                <Monitor />
                            </ProtectedRoute>
                        }
                    ></Route>
                </Routes>
            </UserProvider>
        </>
    );
};

export default App;