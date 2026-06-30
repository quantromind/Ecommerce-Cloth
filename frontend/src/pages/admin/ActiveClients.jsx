import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";
import { FaEdit, FaSearch } from "react-icons/fa";

const ActiveClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state
    const [search, setSearch] = useState("");
    const [editingClient, setEditingClient] = useState(null);

    // Edit form state
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/api/users?role=brand"); // Get brands first
            const dealers = await api.get("/api/users?role=dealer"); // Get dealers
            // Combine and sort
            const all = [...data, ...dealers.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setClients(all);
        } catch (error) {
            console.error("Failed to fetch clients", error);
            setError("Failed to load clients. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({ name: client.name, email: client.email, password: "" }); // Password empty by default
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updatePayload = {
                name: formData.name,
                email: formData.email,
            };
            if (formData.password) updatePayload.password = formData.password;

            await api.put(`/api/users/${editingClient._id}`, updatePayload);

            // Refresh list
            fetchClients();
            setEditingClient(null);
            toast.success("Client credentials updated successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update client");
        } finally {
            setSaving(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-text-main p-8 text-center animate-pulse">Loading clients...</div>;

    if (error) return (
        <div className="text-red-400 p-8 text-center border border-red-500/20 bg-red-500/10 rounded-xl">
            <p className="mb-4">{error}</p>
            <button onClick={fetchClients} className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg text-sm font-bold">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Active Clients</h1>
                    <p className="text-text-muted text-sm">Manage store credentials and access ({filteredClients.length} total).</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchClients}
                        className="bg-[#2a2a2a] hover:bg-[#333] text-text-main px-4 py-2 rounded-lg text-sm font-bold transition"
                    >
                        Refresh List
                    </button>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-primary border border-border-light text-text-main pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-accent/30 w-64 transition"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-secondary border border-border-light rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-primary/40 text-xs uppercase text-text-muted font-bold">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Contact / Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-text-muted">
                        {filteredClients.map((client) => (
                            <tr key={client._id} className="hover:bg-black/5 transition">
                                <td className="px-6 py-4 font-medium text-text-main">{client.name}</td>
                                <td className="px-6 py-4">{client.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${client.role === 'brand' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {client.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(client)}
                                        className="bg-highlight hover:bg-highlight/80 text-text-main px-4 py-2 rounded-lg text-xs font-bold transition inline-flex items-center gap-2"
                                    >
                                        <FaEdit /> Manage Access
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                                    No active clients found. Only approved Brand/Dealer accounts appear here.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm p-4">
                    <div className="bg-secondary border border-border-light rounded-2xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setEditingClient(null)}
                            className="absolute top-4 right-4 text-text-muted hover:text-text-main"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-text-main mb-6">Update Credentials</h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Store / Business Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-primary border border-border-light rounded-lg p-3 text-text-main text-sm focus:outline-none focus:border-highlight"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Login Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-primary border border-border-light rounded-lg p-3 text-text-main text-sm focus:outline-none focus:border-highlight"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase mb-1">New Password (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-primary border border-border-light rounded-lg p-3 text-text-main text-sm focus:outline-none focus:border-highlight"
                                />
                                <p className="text-xs text-yellow-500 mt-1">
                                    ⚠️ Entering text here will reset the user's password immediately.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-highlight hover:bg-highlight/80 text-text-main font-bold py-3.5 rounded-xl transition mt-2 disabled:opacity-50"
                            >
                                {saving ? "Updating..." : "Update Credentials"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveClients;
