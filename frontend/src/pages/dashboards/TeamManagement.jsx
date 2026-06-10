import React, { useState } from "react";
import { FaUserPlus, FaUserShield, FaEnvelope } from "react-icons/fa";

const TeamManagement = () => {
    const [managers, setManagers] = useState([
        { id: 1, name: "Store Manager 1", email: "manager1@store.com", status: "Active" }
    ]);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Team Management</h1>
                    <p className="text-gray-400 mt-1">Create and manage access for your store managers.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-highlight/20 flex items-center gap-2"
                >
                    <FaUserPlus /> Create Manager
                </button>
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-xs uppercase text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                        {managers.map((m) => (
                            <tr key={m.id} className="hover:bg-white/5 transition">
                                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><FaUserShield /></div>
                                    {m.name}
                                </td>
                                <td className="px-6 py-4 text-gray-400">{m.email}</td>
                                <td className="px-6 py-4"><span className="bg-white/5 px-3 py-1 rounded-full text-xs">Manager</span></td>
                                <td className="px-6 py-4"><span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs">Active</span></td>
                                <td className="px-6 py-4 text-right text-gray-500 hover:text-white cursor-pointer">Edit</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Placeholder */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Manager</h2>
                        <p className="text-gray-400 text-sm mb-6">Create a sub-account with limited access.</p>
                        <form className="space-y-4">
                            <input className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Full Name" />
                            <input className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Email Address" />
                            <input className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" placeholder="Password" type="password" />
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                                <button type="button" onClick={() => setShowModal(false)} className="bg-highlight px-6 py-2 rounded-lg text-white font-bold">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
