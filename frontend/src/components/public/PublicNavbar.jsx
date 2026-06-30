import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaHeart, FaTimes, FaBoxOpen, FaSignOutAlt, FaStore, FaGem, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import NavMegaMenu from "./NavMegaMenu";

const PublicNavbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Mega Menu State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const hoverTimeoutRef = useRef(null);



  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  // --- DATA STRUCTURE ---
  // --- DATA STRUCTURE ---
  const navLinks = [
    { name: "HOME", path: "/" },
    {
      name: "CATEGORIES",
      path: "/products",
      megaMenu: [
        {
          title: "Topwear",
          links: [
            { name: "T-Shirts", path: "/products?search=t-shirt" },
            { name: "Shirts", path: "/products?search=shirt" },
            { name: "Jackets", path: "/products?search=jacket" }
          ]
        },
        {
          title: "Bottomwear",
          links: [
            { name: "Jeans", path: "/products?search=jeans" },
            { name: "Trousers", path: "/products?search=trousers" },
            { name: "Shorts", path: "/products?search=shorts" }
          ]
        },
        {
          title: "Special",
          links: [
            { name: "Activewear", path: "/products?search=activewear" },
            { name: "Ethnic Wear", path: "/products?search=ethnic" },
            { name: "Winter Wear", path: "/products?search=winter" }
          ]
        }
      ]
    },
    {
      name: "NEW ARRIVALS",
      path: "/products?sort=newest",
      megaMenu: [
        {
          title: "Just In",
          links: [
            { name: "This Week's Drops", path: "/products?sort=newest&days=7" },
            { name: "Trending Now", path: "/products?sort=trending" }
          ]
        },
        {
          title: "Collections",
          links: [
            { name: "Summer 2026", path: "/products?collection=summer" },
            { name: "Premium Denim", path: "/products?search=denim" }
          ]
        }
      ]
    },
    {
      name: "SALE",
      path: "/products?on_sale=true",
      megaMenu: [
        {
          title: "Offers",
          links: [
            { name: "Clearance", path: "/products?sale=clearance" },
            { name: "Festival Offers", path: "/products?sale=festival" }
          ]
        },
        {
          title: "By Price",
          links: [
            { name: "Under ₹1,000", path: "/products?price_max=1000" },
            { name: "Under ₹2,500", path: "/products?price_max=2500" },
            { name: "Premium Apparel", path: "/products?price_min=2500" }
          ]
        }
      ]
    }
  ];

  // Desktop Hover Handlers
  const handleMouseEnter = (name) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay for smooth diagonal movement
  };

  // Mobile Accordion Toggle
  const toggleMobileMenu = (name) => {
    setMobileExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // --- SPLIT LINKS FOR RESPONSIVENESS ---
  // On LG (Laptop), we show first 5 links + "More". On XL (Desktop), we show all.
  const primaryLinks = navLinks.slice(0, 5); // HOME, BRANDS, LUXURY, NEW, SALE
  const secondaryLinks = navLinks.slice(5);  // GENDER, TYPE, etc.

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary/95 backdrop-blur-md shadow-lg py-2" : "bg-primary/80 backdrop-blur-sm py-4"}`}
        onMouseLeave={handleMouseLeave} // Close when leaving entire nav area
      >
        <div className="w-full px-4 lg:px-6 xl:px-10 relative">
          <div className="flex items-center justify-between h-16 gap-2 xl:gap-4">

            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-3 xl:gap-4 flex-shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-text-main text-2xl hover:text-accent transition"
              >
                <FaBars />
              </button>

              <Link to="/" className="flex items-center gap-2 xl:gap-3 group">
                <div className="bg-transparent rounded-xl sm:rounded-2xl p-1 sm:p-1.5 transition-transform duration-300 group-hover:scale-105">
                  <img src="/logo.png" alt="StyleCloth Logo" className="h-12 sm:h-14 xl:h-20 w-auto object-contain rounded-lg sm:rounded-xl" />
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Nav & Search */}
            {/* Middle: Desktop Nav & Search */}
            <div className="hidden lg:flex flex-1 min-w-0 mx-2 xl:mx-4 items-center gap-4 justify-center relative">
              {/* Links */}
              <div className="flex items-center gap-4 xl:gap-8 text-[11px] xl:text-[12px] font-bold text-text-main h-16 whitespace-nowrap tracking-wide">

                {/* 1. Primary Links (Always Visible) */}
                {primaryLinks.map(link => (
                  <div
                    key={link.name}
                    className="h-full flex items-center relative group"
                    onMouseEnter={() => handleMouseEnter(link.name)}
                  >
                    <Link
                      to={link.path}
                      className={`hover:text-accent transition-colors relative tracking-wide flex items-center gap-1 ${activeDropdown === link.name ? 'text-accent' : ''}`}
                    >
                      {link.name}
                      {link.megaMenu && <FaChevronDown className={`text-[10px] transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                      <span className={`absolute left-0 bottom-[-4px] h-[2px] bg-accent transition-all duration-300 ${activeDropdown === link.name ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  </div>
                ))}

                {/* 2. Secondary Links (Desktop XL ONLY) */}
                <div className="hidden xl:flex items-center gap-8">
                  {secondaryLinks.map(link => (
                    <div
                      key={link.name}
                      className="h-full flex items-center relative group"
                      onMouseEnter={() => handleMouseEnter(link.name)}
                    >
                      <Link
                        to={link.path}
                        className={`hover:text-accent transition-colors relative tracking-wide flex items-center gap-1 ${activeDropdown === link.name ? 'text-accent' : ''}`}
                      >
                        {link.name}
                        {link.megaMenu && <FaChevronDown className={`text-[10px] transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                        <span className={`absolute left-0 bottom-[-4px] h-[2px] bg-accent transition-all duration-300 ${activeDropdown === link.name ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* 3. "More" Dropdown (Laptop LG ONLY) */}
                <div
                  className="xl:hidden h-full flex items-center relative group cursor-pointer"
                  onMouseEnter={() => handleMouseEnter('MORE')}
                >
                  <span className={`hover:text-accent transition-colors relative tracking-wide flex items-center gap-1 ${activeDropdown === 'MORE' ? 'text-accent' : ''}`}>
                    MORE <FaChevronDown className={`text-[10px] transition-transform duration-300 ${activeDropdown === 'MORE' ? 'rotate-180' : ''}`} />
                  </span>

                  {/* Simple Dropdown for More */}
                  <div className={`absolute top-full right-0 w-48 bg-secondary border border-border-light shadow-xl rounded-lg overflow-hidden transition-all duration-200 origin-top-right ${activeDropdown === 'MORE' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="flex flex-col py-2">
                      {secondaryLinks.map(link => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className="px-4 py-3 text-sm text-text-muted hover:text-accent hover:bg-black/5 transition border-b border-border-light last:border-0"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Search Bar (Restored with strict shrink constraints) */}
              <form onSubmit={handleSearch} className="relative group w-[140px] xl:w-[180px] focus-within:w-[200px] xl:focus-within:w-[240px] transition-all duration-300 ml-4 hidden lg:block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-black/5 border border-border-light rounded-full px-4 py-1.5 pl-9 text-xs font-medium text-text-main focus:bg-black/5 focus:border-accent outline-none transition-all placeholder-gray-400"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs group-focus-within:text-accent transition-colors" />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 xl:gap-5 text-text-main flex-shrink-0 ml-auto">





              {/* Mobile Search Trigger */}
              <button className="lg:hidden text-xl text-text-muted hover:text-text-main"><FaSearch /></button>

              {/* Wishlist */}
              <Link to="/customer/wishlist" className="relative group text-text-muted hover:text-accent transition">
                <FaHeart className="text-xl" />
              </Link>

              {/* Account Dropdown (Consolidated Login/Register) */}
              <div
                className="relative group h-full flex items-center justify-center"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                {/* Trigger: Always Icon */}
                <div 
                  className="cursor-pointer flex items-center justify-center p-1 text-text-muted hover:text-accent transition"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <FaUser className={`text-xl ${isUserMenuOpen ? 'text-accent' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                <div className={`absolute top-[80%] right-0 w-56 bg-secondary border border-border-light shadow-2xl rounded-xl overflow-hidden transition-all duration-200 origin-top-right z-[9999] ${isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>

                  {/* Header */}
                  <div className="p-4 border-b border-border-light bg-primary">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Account</p>
                    <p className="font-bold text-text-main truncate text-sm">{user ? user.name : "Guest"}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 flex flex-col">

                    {user ? (
                      <>
                        {user.role === "customer" ? (
                          <>
                            <Link to="/customer/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-black/5 hover:text-accent transition">
                              <FaBoxOpen className="text-xs" /> My Orders
                            </Link>
                            <Link to="/customer/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-black/5 hover:text-accent transition">
                              <FaHeart className="text-xs" /> Wishlist
                            </Link>
                          </>
                        ) : (
                          <Link
                            to={
                              (user.role === "admin") ? "/admin/inventory" : "/"
                            }
                            className="flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-black/5 hover:text-accent transition"
                          >
                            <FaGem className="text-xs" /> Dashboard
                          </Link>
                        )}
                        <button onClick={logout} className="full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition text-left w-full mt-2 border-t border-border-light">
                          <FaSignOutAlt className="text-xs" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-text-main font-bold hover:bg-black/5 hover:text-accent transition">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Sign In
                        </Link>
                        <Link to="/signup" className="flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:bg-black/5 hover:text-text-main transition">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> Register
                        </Link>
                        <div className="px-4 py-3 mt-1 bg-primary text-[10px] text-text-muted leading-tight">
                          Access your orders, wishlist, and exclusive offers.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center text-text-muted hover:text-accent transition pl-1"
              >
                <FaShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        {
          primaryLinks.map(link => (
            <NavMegaMenu
              key={link.name}
              isOpen={activeDropdown === link.name}
              items={link.megaMenu}
              onClose={() => setActiveDropdown(null)}
            />
          ))
        }
        {
          secondaryLinks.map(link => (
            <NavMegaMenu
              key={link.name}
              isOpen={activeDropdown === link.name}
              items={link.megaMenu}
              onClose={() => setActiveDropdown(null)}
            />
          ))
        }

      </nav >

      {/* Mobile Sidebar (Premium Drawer) */}
      < div className={`fixed inset-0 z-[60] transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Backdrop */}
        < div className={`absolute inset-0 bg-primary/80 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsSidebarOpen(false)}></div >

        {/* Drawer */}
        < div className="relative w-[300px] h-full bg-secondary border-r border-border-light shadow-2xl flex flex-col text-text-main" >
          <div className="p-6 border-b border-border-light flex justify-between items-center bg-primary">
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wide">MENU</span>
              <span className="text-xs text-accent uppercase tracking-widest">Navigation</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-text-muted hover:text-accent transition text-xl bg-black/5 p-2 rounded-full"><FaTimes /></button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">

            {/* Nav Links with Accordion */}
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-border-light pb-2">
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-black/5 cursor-pointer transition select-none"
                  onClick={() => toggleMobileMenu(link.name)}
                >
                  <Link
                    to={link.path}
                    onClick={(e) => {
                      if (link.megaMenu) e.preventDefault();
                      else setIsSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 text-text-main font-medium"
                  >
                    <FaGem className="text-xs text-accent" /> {link.name}
                  </Link>
                  {link.megaMenu && (
                    <span className="text-text-muted text-xs">
                      {mobileExpanded[link.name] ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>

                {/* Mobile Submenu */}
                <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded[link.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {link.megaMenu?.map((section, idx) => (
                    <div key={idx} className="pl-10 pr-4 py-2">
                      <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold">{section.title}</h4>
                      <div className="flex flex-col gap-2 border-l border-border-light pl-3">
                        {section.links.map((sublink, subIdx) => (
                          <Link
                            key={subIdx}
                            to={sublink.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-sm text-text-muted hover:text-accent transition py-1"
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Account */}
            <div className="mt-8 pt-4 border-t border-border-light">
              <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest ml-4 mb-3">My Account</h3>
              <div className="flex flex-col gap-1">
                <Link to="/customer/orders" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black/5 hover:text-accent transition">
                  <FaBoxOpen className="text-xs opacity-50" /> Orders
                </Link>
                <Link to="/customer/wishlist" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black/5 hover:text-accent transition">
                  <FaHeart className="text-xs opacity-50" /> Wishlist
                </Link>

              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border-light bg-primary">
            {user ? (
              <button onClick={() => { logout(); setIsSidebarOpen(false); }} className="w-full bg-black/5 hover:bg-red-500/10 text-text-muted hover:text-red-400 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2">
                <FaSignOutAlt /> Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsSidebarOpen(false)} className="block w-full bg-accent hover:bg-[#b5952f] text-black font-bold py-3 rounded-lg text-center transition shadow-lg shadow-yellow-500/20">
                Sign In
              </Link>
            )}
          </div>
        </div >
      </div >

      {/* Spacer to prevent content overlap with fixed navbar */}
      < div className="h-20 bg-primary" ></div >
    </>
  );
};

export default PublicNavbar;

