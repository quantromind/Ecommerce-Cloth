import React from "react";
import { useAuth } from "../../context/AuthContext";

const PendingApproval = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4">
      <div className="max-w-lg bg-secondary border border-white/10 rounded-2xl p-6">
        <h1 className="text-xl font-bold">Pending Approval</h1>
        <p className="text-sm opacity-80 mt-2">
          Your account is created but not verified by Super Admin yet.
          Once approved, you can login normally.
        </p>

        <button
          onClick={logout}
          className="mt-5 bg-highlight px-4 py-2 rounded-lg hover:bg-highlight/90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
