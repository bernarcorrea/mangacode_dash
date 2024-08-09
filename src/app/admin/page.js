"use client";

import React from "react";
import { useAuthorizationUser } from "@/services/helpers";

const DashboardHome = () => {
    const authorized = useAuthorizationUser('/admin');
    return <>{authorized && <h1>Dashboard Home</h1>}</>;
};

export default DashboardHome;
