import { useState, useEffect } from 'react'
import './App.css'
import TodoForm from './components/TodoForm.tsx'
import TodoItem from './components/TodoItem.tsx'
import TodoFilter from './components/TodoFilter.tsx'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate: string
  createdAt: string
}

type FilterType = 'all' | 'active' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (newTodo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const todo: Todo = {
      ...newTodo,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTodos([todo, ...todos])
    setEditingId(null)
  }

  const updateTodo = (id: string, updatedTodo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, ...updatedTodo }
        : todo
    ))
    setEditingId(null)
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  // Filter and search todos
  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || (filter === 'completed' ? todo.completed : !todo.completed)
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory
    return matchesFilter && matchesSearch && matchesCategory
  })

  const categories = [...new Set(todos.map(todo => todo.category))].filter(Boolean)
  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✓ Todo Application</h1>
        <p className="stats">
          Total: {todos.length} | Active: {activeCount} | Completed: {completedCount}
        </p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <TodoForm
            onAdd={addTodo}
            onUpdate={updateTodo}
            editingId={editingId}
            todos={todos}
            onCancelEdit={() => setEditingId(null)}
          />
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="controls-section">
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="clear-btn"
            >
              Clear Completed ({completedCount})
            </button>
          )}
        </div>

        <div className="todos-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>📝 No todos yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="todos-list">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleComplete}
                  onDelete={deleteTodo}
                  onEdit={setEditingId}
                  isEditing={editingId === todo.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App;
