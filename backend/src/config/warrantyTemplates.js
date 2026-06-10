// Warranty Plan Templates
// These can be extended or moved to DB later if dynamic creation is needed

const WARRANTY_TEMPLATES = [
    {
        id: "standard_1_year",
        name: "Standard 1-Year Warranty",
        durationMonths: 12,
        coverage: "MOVEMENT_ONLY",
        terms: "This warranty covers manufacturing defects in the watch movement for a period of one (1) year from the date of purchase. It does not cover the case, crystal, bracelet, strap, or damage resulting from water moisture, accidents, or normal wear and tear.",
        highlights: [
            "1 Year Movement Coverage",
            "Manufacturing Defects Only",
            "Valid at Dealer Location"
        ],
        exclusions: [
            "Water damage",
            "Physical damage to case/glass",
            "Strap/Bracelet wear",
            "Battery replacement"
        ],
        provider: "DEALER"
    },
    {
        id: "premium_2_year",
        name: "Premium 2-Year Comprehensive",
        durationMonths: 24,
        coverage: "FULL",
        terms: "This comprehensive warranty covers the watch head, movement, and dial for two (2) years. We guarantee the watch is free from defects in material and workmanship. Includes one free battery replacement (for quartz) or regulation (for mechanical) within the first year.",
        highlights: [
            "2 Years Full Coverage",
            "Includes 1 Free Service",
            "Parts & Labor Included"
        ],
        exclusions: [
            "Intentional damage",
            "Theft or loss",
            "Normal wear on leather straps"
        ],
        provider: "DEALER"
    },
    {
        id: "manufacturer_intl",
        name: "International Manufacturer Warranty",
        durationMonths: 60, // e.g. Rolex 5 years
        coverage: "FULL",
        terms: "Covered directly by the manufacturer's international warranty policy. Requires valid warranty card dated at purchase. Service can be obtained at any authorized service center worldwide.",
        highlights: [
            "Global Coverage",
            "Authorized Service Centers",
            "Direct Manufacturer Support"
        ],
        exclusions: [
            "As per manufacturer terms"
        ],
        provider: "MANUFACTURER"
    }
];

module.exports = WARRANTY_TEMPLATES;
