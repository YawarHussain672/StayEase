
import { motion, AnimatePresence } from "framer-motion";
import { AMENITY_OPTIONS, PROPERTY_TYPES } from "@/lib/constants";

interface FilterPanelProps {
    isOpen: boolean;
    type: string;
    setType: (val: string) => void;
    gender: string;
    setGender: (val: string) => void;
    minPrice: string;
    setMinPrice: (val: string) => void;
    maxPrice: string;
    setMaxPrice: (val: string) => void;
    selectedAmenities: string[];
    toggleAmenity: (amenity: string) => void;
    clearFilters: () => void;
    applyFilters: () => void;
    onClose: () => void;
}

export default function FilterPanel({
    isOpen,
    type, setType,
    gender, setGender,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    selectedAmenities, toggleAmenity,
    clearFilters, applyFilters, onClose
}: FilterPanelProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 glass-panel !rounded-2xl overflow-hidden"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Property Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="glass-select w-full !rounded-xl">
                            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="glass-select w-full !rounded-xl">
                            <option value="">Any</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="coed">Co-Ed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Min Price (₹/mo)</label>
                        <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="e.g. 3000" className="input !rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Max Price (₹/mo)</label>
                        <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="e.g. 15000" className="input !rounded-xl" />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium mb-3 text-[var(--text-primary)]">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {AMENITY_OPTIONS.map(a => (
                            <button key={a} onClick={() => toggleAmenity(a)}
                                className={`px-3.5 py-1.5 rounded-full text-sm font-medium capitalize transition-all backdrop-blur-md ${selectedAmenities.includes(a)
                                    ? "bg-indigo-500/90 text-white border border-indigo-400/50 shadow-md shadow-indigo-500/20"
                                    : "glass-badge hover:border-indigo-300/50"
                                    }`}>{a}</button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20 dark:border-white/10">
                    <button onClick={clearFilters} className="text-sm text-[var(--text-muted)] hover:text-red-500 transition-colors font-medium">
                        Clear all filters
                    </button>
                    <button onClick={() => { applyFilters(); onClose(); }} className="glass-btn-primary !px-6 !py-2.5 !text-sm">
                        Apply Filters
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
