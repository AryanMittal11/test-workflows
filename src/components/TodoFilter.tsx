interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

export default function TodoFilter({
  filter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  categories
}: TodoFilterProps) {
  return (
    <div className="filter-section">
      <div className="filter-group">
        <label className="filter-label">Filter by status:</label>
        <div className="filter-buttons">
          <button
            onClick={() => onFilterChange('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">Filter by category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
