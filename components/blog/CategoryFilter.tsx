'use client'

import { X } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  className?: string
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  className = '',
}: CategoryFilterProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          selectedCategory === null
            ? 'bg-white text-dark-bg'
            : 'bg-dark-tertiary text-gray-400 hover:text-white hover:bg-dark-tertiary/80 border border-dark-border'
        }`}
      >
        All Categories
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === category
              ? 'bg-gradient-primary text-white'
              : 'bg-dark-tertiary text-gray-400 hover:text-white hover:bg-dark-tertiary/80 border border-dark-border'
          }`}
        >
          {category}
          {selectedCategory === category && (
            <X size={14} className="inline ml-1" />
          )}
        </button>
      ))}
    </div>
  )
}
