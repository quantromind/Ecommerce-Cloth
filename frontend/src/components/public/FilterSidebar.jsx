import React, { useState, useEffect, useMemo } from "react"; // eslint-disable-line no-unused-vars
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

const FilterSection = ({ title, isOpen, toggle, children }) => (
    <div className="border-b border-white/10 py-5">
        <button
            onClick={toggle}
            className="flex items-center justify-between w-full text-left focus:outline-none group"
        >
            <span className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-[#D4AF37] transition-colors">
                {title}
            </span>
            <span className="text-gray-500 text-xs">
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
        </button>
        {isOpen && <div className="mt-4 space-y-2 animate-fadeIn">{children}</div>}
    </div>
);

const CheckboxItem = ({ label, count, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group hover:bg-white/5 p-1 rounded transition select-none">
        <input
            type="checkbox"
            checked={!!checked}
            onChange={onChange}
            className="sr-only"
            aria-label={label}
        />
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center transition-all ${checked ? 'bg-[#D4AF37] border-[#D4AF37]' : 'bg-transparent group-hover:border-[#D4AF37]'}`}>
                {checked && <div className="w-2 h-2 bg-black rounded-sm" />}
            </div>
            <span className={`text-sm ${checked ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                {label}
            </span>
        </div>
        <span className="text-xs text-gray-600 font-mono">({count})</span>
    </label>
);

const FilterSidebar = ({
    allProducts,
    activeFilters,
    onFilterChange,
    priceRange,
    setPriceRange,
    isOpen,
    onClose
}) => {
    const [sections, setSections] = useState({
        price: true,
        brand: true,
        productType: true,
        color: false,
        size: false,
        material: false,
        availability: true
    });

    const toggleSection = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Calculate dynamic counts based on all products
    const counts = useMemo(() => {
        const stats = {
            brands: {},
            colors: {},
            sizes: {},
            categories: {},
            materials: {},
            availableOnline: 0,
            maxPrice: 0,
            minPrice: Infinity
        };

        allProducts.forEach(p => {
            // Brands
            const brand = p.brandName || p.brand || "Other";
            stats.brands[brand] = (stats.brands[brand] || 0) + 1;

            // Colors
            if (p.color) {
                stats.colors[p.color] = (stats.colors[p.color] || 0) + 1;
            }

            // Sizes
            if (p.size) {
                stats.sizes[p.size] = (stats.sizes[p.size] || 0) + 1;
            }

            // Materials
            if (p.material) {
                stats.materials[p.material] = (stats.materials[p.material] || 0) + 1;
            }

            // Availability
            if (p.stock > 0) {
                stats.availableOnline++;
            }

            // Price
            if (p.price > stats.maxPrice) stats.maxPrice = p.price;
            if (p.price < stats.minPrice) stats.minPrice = p.price;
        });

        if (stats.minPrice === Infinity) stats.minPrice = 0;

        return stats;
    }, [allProducts]);

    const handleCheckboxChange = (category, value) => {
        const current = activeFilters[category] || [];
        const newValues = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        onFilterChange(category, newValues);
    };

    // Helper to format currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-[calc(100vh-8rem)] 
                w-[280px] bg-[#0a0a0a] border-r border-white/10 overflow-y-auto custom-scrollbar
                transform transition-transform duration-300 z-50 lg:z-0 lg:translate-x-0 p-5
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center lg:hidden mb-6">
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Price Section */}
                <FilterSection title="Price" isOpen={sections.price} toggle={() => toggleSection('price')}>
                    <div className="px-1">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                        </div>
                        {/* Simple Dual Range Slider Simulation using two inputs */}
                        <div className="relative h-1 bg-gray-800 rounded-full mb-6">
                            <div
                                className="absolute h-full bg-[#D4AF37] rounded-full"
                                style={{
                                    left: `${(priceRange[0] / (counts.maxPrice || 100000)) * 100}%`,
                                    right: `${100 - (priceRange[1] / (counts.maxPrice || 100000)) * 100}%`
                                }}
                            />
                            <input
                                type="range"
                                min={0}
                                max={counts.maxPrice || 100000}
                                value={priceRange[0]}
                                onChange={(e) => {
                                    const val = Math.min(Number(e.target.value), priceRange[1] - 1000);
                                    setPriceRange([val, priceRange[1]]);
                                }}
                                className="absolute w-full h-full opacity-0 z-20 pointer-events-none"
                            />
                            <input
                                type="range"
                                min={0}
                                max={counts.maxPrice || 100000}
                                value={priceRange[1]}
                                onChange={(e) => {
                                    const val = Math.max(Number(e.target.value), priceRange[0] + 1000);
                                    setPriceRange([priceRange[0], val]);
                                }}
                                className="absolute w-full h-full opacity-0 z-20 pointer-events-none"
                            />
                            {/* Thumbs (Visual only) */}
                            <div
                                className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-white border-2 border-[#D4AF37] rounded-full shadow cursor-pointer pointer-events-none"
                                style={{ left: `${(priceRange[0] / (counts.maxPrice || 100000)) * 100}%` }}
                            />
                            <div
                                className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-white border-2 border-[#D4AF37] rounded-full shadow cursor-pointer pointer-events-none"
                                style={{ left: `${(priceRange[1] / (counts.maxPrice || 100000)) * 100}%` }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-full bg-[#111] border border-white/10 text-white text-xs p-2 rounded focus:border-[#D4AF37] outline-none"
                                placeholder="Min"
                            />
                            <span className="text-gray-500 self-center">-</span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full bg-[#111] border border-white/10 text-white text-xs p-2 rounded focus:border-[#D4AF37] outline-none"
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </FilterSection>

                {/* Brand */}
                <FilterSection title="Brand" isOpen={sections.brand} toggle={() => toggleSection('brand')}>
                    {Object.keys(counts.brands).map(brand => (
                        <CheckboxItem
                            key={brand}
                            label={brand}
                            count={counts.brands[brand]}
                            checked={activeFilters.brands?.includes(brand)}
                            onChange={() => handleCheckboxChange('brands', brand)}
                        />
                    ))}
                </FilterSection>

                {/* Product Type (Category) */}
                <FilterSection title="Product Type" isOpen={sections.productType} toggle={() => toggleSection('productType')}>
                    {Object.keys(counts.categories).map(cat => (
                        <CheckboxItem
                            key={cat}
                            label={cat}
                            count={counts.categories[cat]}
                            checked={activeFilters.categories?.includes(cat)}
                            onChange={() => handleCheckboxChange('categories', cat)}
                        />
                    ))}
                </FilterSection>

                {/* Colors */}
                {Object.keys(counts.colors).length > 0 && (
                    <FilterSection title="Color" isOpen={sections.color} toggle={() => toggleSection('color')}>
                        {Object.keys(counts.colors).map(color => (
                            <CheckboxItem
                                key={color}
                                label={color}
                                count={counts.colors[color]}
                                checked={activeFilters.colors?.includes(color)}
                                onChange={() => handleCheckboxChange('colors', color)}
                            />
                        ))}
                    </FilterSection>
                )}

                {/* Sizes */}
                {Object.keys(counts.sizes).length > 0 && (
                    <FilterSection title="Size" isOpen={sections.size} toggle={() => toggleSection('size')}>
                        {Object.keys(counts.sizes).map(size => (
                            <CheckboxItem
                                key={size}
                                label={size}
                                count={counts.sizes[size]}
                                checked={activeFilters.sizes?.includes(size)}
                                onChange={() => handleCheckboxChange('sizes', size)}
                            />
                        ))}
                    </FilterSection>
                )}

                {/* Materials */}
                {Object.keys(counts.materials).length > 0 && (
                    <FilterSection title="Material" isOpen={sections.material} toggle={() => toggleSection('material')}>
                        {Object.keys(counts.materials).map(material => (
                            <CheckboxItem
                                key={material}
                                label={material}
                                count={counts.materials[material]}
                                checked={activeFilters.materials?.includes(material)}
                                onChange={() => handleCheckboxChange('materials', material)}
                            />
                        ))}
                    </FilterSection>
                )}

                {/* Availability */}
                <FilterSection title="Availability" isOpen={sections.availability} toggle={() => toggleSection('availability')}>
                    <CheckboxItem
                        label="Available Online"
                        count={counts.availableOnline}
                        checked={activeFilters.availability?.includes('Available Online')}
                        onChange={() => handleCheckboxChange('availability', 'Available Online')}
                    />
                </FilterSection>

            </aside>
        </>
    );
};

export default FilterSidebar;
