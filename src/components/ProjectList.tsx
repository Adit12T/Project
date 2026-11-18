import { STATUSES, isOverdue, type Project, type Status } from '../projects'

interface Props {
  projects: Project[]
  today: string
  onStatusChange: (id: string, status: Status) => void
  onDelete: (project: Project) => void
}

export function ProjectList({ projects, today, onStatusChange, onDelete }: Props) {
  if (projects.length === 0) return <p className="empty">No projects match these filters.</p>
  return (
    <ul className="projects" aria-label="Projects">
      {projects.map((p) => (
        <li key={p.id} className="card project">
          <div>
            <strong>{p.title}</strong>
            <span className="tag">{p.category}</span>
            {p.dueDate && (
              <span className={isOverdue(p, today) ? 'due overdue' : 'due'}>
                {isOverdue(p, today) ? 'Overdue · ' : 'Due '}{p.dueDate}
              </span>
            )}
          </div>
          <div className="row">
            <select aria-label={`Status of ${p.title}`} value={p.status}
                    onChange={(e) => onStatusChange(p.id, e.target.value as Status)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button type="button" className="danger" aria-label={`Delete ${p.title}`} onClick={() => onDelete(p)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
