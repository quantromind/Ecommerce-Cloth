import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InquiryForm from "../components/public/InquiryForm";
import PublicNavbar from "../components/public/PublicNavbar";
import { FaGlobe, FaShieldAlt, FaHandshake, FaArrowRight } from "react-icons/fa";

const Partner = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(true);

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
            <PublicNavbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="text-[#D4AF37] tracking-[0.3em] text-xs font-bold uppercase mb-4 block">Exclusive Partnership Program</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Scale Your Legacy with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D4AF37] to-white animate-shine bg-[length:200%_auto]">Paytan Men's</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Join the world's most premier marketplace for luxury timepieces.
                        Connect with discerning collectors and elevate your brand's global presence.
                    </p>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="max-w-6xl mx-auto px-6 mb-24 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: FaGlobe, title: "Global Reach", desc: "Access verified high-net-worth collectors across 50+ countries instantly." },
                        { icon: FaShieldAlt, title: "Secure Transactions", desc: "Enjoy 100% fraud protection and guaranteed payouts for every accredited sale." },
                        { icon: FaHandshake, title: "Verified Network", desc: "Join an elite ecosystem of authorized dealers, certified brands, and curators." }
                    ].map((item, idx) => (
                        <div key={idx} className="group bg-[#111] p-8 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/5 hover:-translate-y-2">
                            <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 border border-white/5 group-hover:bg-[#D4AF37] transition-all">
                                <item.icon className="text-2xl text-gray-400 group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Application Section */}
            <div className="max-w-4xl mx-auto px-6 pb-24">
                {showForm ? (
                    <div className="bg-[#0a0a0a] relative p-1 rounded-3xl bg-gradient-to-b from-[#333] to-transparent">
                        <div className="bg-[#0f0f0f] p-8 md:p-12 rounded-[22px] relative overflow-hidden">
                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />

                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-3">Begin Your Application</h2>
                                <p className="text-gray-500">Share your details. Our curation team will review your profile within 48 hours.</p>
                            </div>

                            <InquiryForm onClose={() => navigate('/')} inline={true} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={() => setShowForm(true)}
                            className="group bg-[#D4AF37] hover:bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center gap-2 mx-auto"
                        >
                            Apply for Partnership <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {/* Simple Footer */}
            <footer className="border-t border-white/10 py-12 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} Paytan Men's. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Partner;
