import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import './EventFilters.css';

const CATEGORIES = ['All', 'Workshop', 'Hackathon', 'Tech Talk', 'Competition', 'Social'];
const STATUSES = ['Upcoming', 'Past', 'All'];

export const EventFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  totalResults = 0,
}) => {
  return (
    <div className="event-filters-card" role="search" aria-label="Event search and filters">
      {/* Search Input Bar */}
      <div className="filter-search-box">
        <label htmlFor="event-search-input" className="sr-only">
          Search events by title, keyword, or speaker
        </label>
        <Search size={18} className="search-box-icon" aria-hidden="true" />
        <input
          id="event-search-input"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by workshop, AI, Kubernetes, speaker..."
          className="search-box-input"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="search-box-clear"
            aria-label="Clear search input"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Categories & Status Controls */}
      <div className="filter-controls-row">
        {/* Category Pills */}
        <div className="filter-group">
          <span className="filter-label" id="category-filter-label">Category:</span>
          <div 
            className="filter-pills" 
            role="radiogroup" 
            aria-labelledby="category-filter-label"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onCategoryChange(cat)}
                  className={`filter-pill ${isSelected ? 'filter-pill-active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Dropdown / Pills */}
        <div className="filter-group">
          <span className="filter-label" id="status-filter-label">Status:</span>
          <div 
            className="filter-pills" 
            role="radiogroup" 
            aria-labelledby="status-filter-label"
          >
            {STATUSES.map((status) => {
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onStatusChange(status)}
                  className={`filter-pill ${isSelected ? 'filter-pill-active' : ''}`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count Line */}
      <div className="filter-results-info">
        <span>
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'event' : 'events'}
        </span>
      </div>
    </div>
  );
};

export default EventFilters;
