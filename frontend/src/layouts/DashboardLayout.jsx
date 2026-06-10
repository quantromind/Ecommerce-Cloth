import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F7FB]">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F5F7FB]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
