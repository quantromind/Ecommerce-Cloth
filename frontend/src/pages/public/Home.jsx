import React from "react";
import PublicNavbar from "../../components/public/PublicNavbar";

const demoWatches = [];

const Home = () => {
    return (
        <div className="min-h-screen bg-primary text-white">
            <PublicNavbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="bg-secondary border border-white/10 rounded-2xl p-6 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Premium Watches. Controlled Marketplace. SaaS Ready.
                    </h1>
                    <p className="mt-3 text-sm md:text-base opacity-80 max-w-2xl">
                        Browse watches without login. Try-On is available for everyone. Login required only for cart, checkout and order tracking.
                    </p>
                </div>

                <h2 className="mt-10 text-xl font-bold">Trending Watches (Demo)</h2>
                <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {demoWatches.map((w) => (
                        <div key={w.id} className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
                            <img src={w.img} alt={w.name} className="h-44 w-full object-cover" />
                            <div className="p-4">
                                <div className="font-semibold">{w.name}</div>
                                <div className="text-xs opacity-70 mt-1">Store: {w.store}</div>
                                <div className="mt-2 font-bold">{w.price}</div>

                                <button className="mt-3 w-full bg-white/10 hover:bg-white/15 rounded-lg py-2 text-sm">
                                    View Details (Public)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
