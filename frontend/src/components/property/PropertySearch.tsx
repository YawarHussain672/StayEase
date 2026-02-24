
import { Search, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";

interface PropertySearchProps {
    searchInput: string;
    setSearchInput: (val: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    sort: string;
    setSort: (val: string) => void;
    filtersOpen: boolean;
    setFiltersOpen: (val: boolean) => void;
    activeFilterCount: number;
}

export default function PropertySearch({
    searchInput,
    setSearchInput,
    handleSearch,
    sort,
    setSort,
    filtersOpen,
    setFiltersOpen,
    activeFilterCount,
}: PropertySearchProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] z-10" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by city, area..."
                    className="glass-input !pl-13 !py-3 !text-sm"
                />
            </form>

            <div className="flex gap-2">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="glass-select h-12"
                >
                    {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={`flex items-center gap-2 px-5 h-12 rounded-full border-1.5 transition-all whitespace-nowrap font-semibold text-sm backdrop-blur-xl ${filtersOpen || activeFilterCount > 0
                        ? "glass-btn-primary !px-5 !py-0 !h-12"
                        : "glass-btn-ghost !px-5 !py-0 !h-12"
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center shadow-sm">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
