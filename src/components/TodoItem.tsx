import type { Todo } from '../App'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  isEditing: boolean
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isEditing
}: TodoItemProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false
    const dueDate = new Date(todo.dueDate)
    return dueDate < new Date()
  }

  const getPriorityLabel = () => {
    const labels = {
      low: '🟢',
      medium: '🟡',
      high: '🔴'
    }
    return labels[todo.priority]
  }

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''} priority-${todo.priority} ${isOverdue() ? 'overdue' : ''}`}
    >
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-input"
          id={`todo-${todo.id}`}
        />
        <label htmlFor={`todo-${todo.id}`}></label>
      </div>

      <div className="todo-content">
        <div className="todo-header">
          <h3 className="todo-title">{todo.title}</h3>
          <span className="priority-badge">{getPriorityLabel()} {todo.priority}</span>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          {todo.category && (
            <span className="todo-tag">📁 {todo.category}</span>
          )}
          {todo.dueDate && (
            <span className={`todo-date ${isOverdue() ? 'overdue' : ''}`}>
              📅 {formatDate(todo.dueDate)}
              {isOverdue() && <span className="overdue-text"> (Overdue!)</span>}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          onClick={() => onEdit(todo.id)}
          className="btn-icon btn-edit"
          title="Edit todo"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="btn-icon btn-delete"
          title="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
