import { useState, type FormEvent } from 'react'
import { CATEGORIES, STATUSES, validateTitle, type Category, type Project, type Status } from '../projects'

interface Props {
  projects: Project[]
  onAdd: (project: Omit<Project, 'id'>) => void
}

export function AddProjectForm({ projects, onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>(CATEGORIES[0])
  const [status, setStatus] = useState<Status>('Planned')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const problem = validateTitle(title, projects)
    if (problem) return setError(problem)
    onAdd({ title: title.trim(), category, status, dueDate: dueDate || null })
    setTitle('')
    setDueDate('')
    setError(null)
  }

  return (
    <form className="card form" onSubmit={submit} noValidate aria-label="Add project">
      <h2>Add project</h2>
      <label>Title<input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Category
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Status
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Due date<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
      <button type="submit">Add</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  )
}
