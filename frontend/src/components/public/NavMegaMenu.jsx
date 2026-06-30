import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaRegGem } from 'react-icons/fa';

const NavMegaMenu = ({ isOpen, items, onClose }) => {
    if (!isOpen || !items) return null;

    return (
        <div
            className="absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-2xl text-text-main shadow-2xl border-t border-accent/30 animate-fade-in z-50 overflow-hidden"
            onMouseEnter={(e) => e.stopPropagation()}
        >
            {/* Shiny Hive Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-8 py-10 relative z-10">
                <div className="grid grid-cols-12 gap-10">

                    {/* Main Links Columns (Spread across 9 cols) */}
                    <div className="col-span-9 grid grid-cols-3 gap-8">
                        {items.map((column, idx) => (
                            <div key={idx} className="flex flex-col space-y-5">
                                <h3 className="font-bold text-xs tracking-[0.2em] text-accent uppercase border-b border-border-light pb-3 flex items-center gap-2">
                                    {column.title}
                                </h3>
                                <div className="flex flex-col space-y-3">
                                    {column.links.map((link, linkIdx) => (
                                        <Link
                                            key={linkIdx}
                                            to={link.path}
                                            onClick={onClose}
                                            className="text-sm text-text-muted hover:text-accent hover:pl-2 transition-all duration-300 flex items-center justify-between group font-medium"
                                        >
                                            <span className="tracking-wide group-hover:text-text-main transition-colors">{link.name}</span>
                                            <FaChevronRight className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 text-[10px] text-accent transition-all duration-300" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Featured / Visual Column (3 cols) */}
                    <div className="col-span-3">
                        <div className="h-full bg-gradient-to-br from-[#111] to-primary border border-border-light rounded-xl p-6 relative overflow-hidden group hover:border-accent/50 transition-all duration-500 shadow-lg hover:shadow-[#D4AF37]/10">
                            {/* Glass Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-text-main/0 via-white/5 to-text-main/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <FaRegGem className="text-9xl text-accent rotate-12 transform group-hover:scale-110 transition-transform duration-700" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <h4 className="text-accent text-lg font-bold mb-2">New Collection</h4>
                                <p className="text-text-muted text-xs mb-6 leading-relaxed line-clamp-3">
                                    Discover our latest arrivals featuring premium craftsmanship and timeless design.
                                </p>
                                <Link to="/products?sort=newest" onClick={onClose} className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-black bg-accent px-4 py-2 rounded-full hover:bg-white transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                    Shop Now <FaChevronRight />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NavMegaMenu;
