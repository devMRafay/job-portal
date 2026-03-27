import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Auth/home";
import Login from "../Auth/login";
import AdminDashboard from "../Components/adminDashboard";
import UserView from "../userPages/userView";
import Items from "../AdminPages/Items";
import UserData from "../AdminPages/UserData";
import Profile from "../AdminPages/Profile";
import Drawer from "../Components/drawer";
import AppliedJobs from "../userPages/appliedJobs";

function Navigation() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Routes with Drawer */}
                <Route element={<Drawer />}>
                    {/* <Route path="/profile" element={<Profile />} /> */}
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    <Route path="/users" element={<UserData />} />
                    <Route path="/items" element={<Items />} />
                </Route>

                {/* UserView without Drawer */}
                <Route path="/userView" element={<UserView />} />
                <Route path="/appliedJobs" element={<AppliedJobs/>}></Route>
            </Routes>
        </>
    );
}

export default Navigation;