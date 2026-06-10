import React, { useState } from "react";
import { api } from "../../services/api";

const InquiryForm = ({ onClose, inline = false }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        type: "brand",
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        gst: "",
        notes: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState(null);

    const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setMsg(null);

        // Basic Validation
        if (!form.businessName || !form.contactName || !form.email) {
            setMsg("Please complete all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/api/inquiries", form);
            setStep(2); // Success Step
        } catch (err) {
            setMsg(err?.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (step === 2) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white text-black p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                    <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for your interest in selling on Paytaan Men's. Our team will review your details and send login credentials to your email within 24 hours.
                    </p>
                    <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded shadow-md transition">
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={inline ? "w-full" : "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"}>
            <div className={`w-full max-w-2xl bg-[#fcfcfc] text-[#0f1111] rounded-lg shadow-xl overflow-hidden flex flex-col ${inline ? "" : "max-h-[90vh]"}`}>

                {/* Header - Amazon Style */}
                <div className="bg-[#f0f2f2] border-b border-[#d5d9d9] px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Sell on Paytaan Men's</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-xl">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-1">Company Information</h3>
                        <p className="text-sm text-gray-600">Tell us about your business to get started.</p>
                    </div>

                    {msg && (
                        <div className="mb-4 p-3 border border-red-400 bg-red-50 text-red-700 text-sm rounded flex items-center gap-2">
                            <span>⚠️</span> {msg}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Section 1 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Business Type</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={onChange}
                                    className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                >
                                    <option value="brand">Brand Owner</option>
                                    <option value="dealer">Authorized Dealer / Store</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Business Name <span className="text-red-600">*</span></label>
                                <input
                                    name="businessName"
                                    value={form.businessName}
                                    onChange={onChange}
                                    className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                    placeholder="e.g. Rolex Gallery"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Contact Person <span className="text-red-600">*</span></label>
                                <input
                                    name="contactName"
                                    value={form.contactName}
                                    onChange={onChange}
                                    className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Official Email <span className="text-red-600">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Phone Number</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={onChange}
                                    className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">GST / Tax ID (Optional)</label>
                                <input
                                    name="gst"
                                    value={form.gst}
                                    onChange={onChange}
                                    className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                placeholder="Street address, City, State"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Additional Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={onChange}
                                rows="3"
                                className="w-full bg-white border border-gray-400 rounded px-3 py-2 text-sm focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] outline-none"
                                placeholder="Tell us about your inventory size..."
                            />
                        </div>

                        <div className="pt-4 border-t border-[#d5d9d9]">
                            <button
                                disabled={submitting}
                                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-normal py-2 rounded-lg shadow-sm border border-[#fcd200] text-sm md:text-base disabled:opacity-50"
                            >
                                {submitting ? "Submitting Application..." : "Submit Application"}
                            </button>
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                By submitting, you agree to Paytaan Men's <button className="text-blue-600 underline">Conditions of Use</button> and <button className="text-blue-600 underline">Privacy Notice</button>.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InquiryForm;
