import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-secondary border-t border-border-light pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-xl font-bold tracking-widest uppercase">Style<span className="text-accent">Cloth</span></Link>
                        <p className="text-sm text-text-muted mt-4">
                            Premium apparel for the modern individual. Experience timeless elegance with every piece.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main mb-4 uppercase tracking-wider text-sm">Shop</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="/products?category=Topwear" className="hover:text-accent transition-colors">Topwear</Link></li>
                            <li><Link to="/products?category=Bottomwear" className="hover:text-accent transition-colors">Bottomwear</Link></li>
                            <li><Link to="/products" className="hover:text-accent transition-colors">All Products</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main mb-4 uppercase tracking-wider text-sm">Support</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main mb-4 uppercase tracking-wider text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border-light pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted">
                    <p>&copy; {new Date().getFullYear()} StyleCloth. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <span>Designed for Elegance</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
