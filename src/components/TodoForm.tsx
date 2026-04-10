import { useState, useEffect } from 'react'
import type { Todo } from '../App'

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void
  onUpdate: (id: string, todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void
  editingId: string | null
  todos: Todo[]
  onCancelEdit: () => void
}

export default function TodoForm({
  onAdd,
  onUpdate,
  editingId,
  todos,
  onCancelEdit
}: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')

  const editingTodo = editingId ? todos.find(t => t.id === editingId) : null

  useEffect(() => {
    if (editingTodo) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(editingTodo.title)
      setDescription(editingTodo.description)
      setPriority(editingTodo.priority)
      setCategory(editingTodo.category)
      setDueDate(editingTodo.dueDate)
    }
  }, [editingTodo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a todo title')
      return
    }

    const todoData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim(),
      dueDate
    }

    if (editingId) {
      onUpdate(editingId, todoData)
    } else {
      onAdd(todoData)
    }

    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory('')
    setDueDate('')
  }

  const handleCancel = () => {
    resetForm()
    onCancelEdit()
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>{editingId ? '✏️ Edit Todo' : '➕ Add New Todo'}</h2>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          className="form-textarea"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="form-select"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Work, Personal"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {editingId ? 'Update Todo' : 'Add Todo'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
