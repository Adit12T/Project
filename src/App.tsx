import { useEffect, useMemo, useState } from 'react'
import { AddProjectForm } from './components/AddProjectForm'
import { ProjectList } from './components/ProjectList'
import { TodoFeed } from './components/TodoFeed'
import { CATEGORIES, STATUSES, filterProjects, loadProjects, saveProjects, type Filters, type Project } from './projects'

const todayIso = () => new Date().toISOString().slice(0, 10)

export default function App({ todosUrl }: { todosUrl?: string }) {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects())
  const [filters, setFilters] = useState<Filters>({ query: '', category: 'All', status: 'All' })
  const [lastDeleted, setLastDeleted] = useState<{ project: Project; index: number } | null>(null)

  useEffect(() => saveProjects(projects), [projects])

  const visible = useMemo(() => filterProjects(projects, filters), [projects, filters])
  const counts = STATUSES.map((s) => ({ status: s, count: projects.filter((p) => p.status === s).length }))

  return (
    <>
      <header className="navbar">
        <h1>Project Tracker</h1>
        <p aria-live="polite">
          {counts.map(({ status, count }) => <span key={status} className="pill">{status}: {count}</span>)}
        </p>
      </header>
      <main className="layout">
        <div>
          <AddProjectForm
            projects={projects}
            onAdd={(p) => setProjects((all) => [...all, { ...p, id: crypto.randomUUID() }])}
          />
          <section className="card filters" aria-label="Filters">
            <label>Search<input type="search" value={filters.query}
                                onChange={(e) => setFilters({ ...filters, query: e.target.value })} /></label>
            <label>Category filter
              <select value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value as Filters['category'] })}>
                <option>All</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Status filter
              <select value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters['status'] })}>
                <option>All</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </section>
          {lastDeleted && (
            <p className="undo" role="status">
              Deleted “{lastDeleted.project.title}”.{' '}
              <button type="button" onClick={() => {
                setProjects((all) => {
                  const next = [...all]
                  next.splice(Math.min(lastDeleted.index, next.length), 0, lastDeleted.project)
                  return next
                })
                setLastDeleted(null)
              }}>Undo</button>
            </p>
          )}
          <ProjectList
            projects={visible}
            today={todayIso()}
            onStatusChange={(id, status) => setProjects((all) => all.map((p) => (p.id === id ? { ...p, status } : p)))}
            onDelete={(project) => {
              setLastDeleted({ project, index: projects.indexOf(project) })
              setProjects((all) => all.filter((p) => p.id !== project.id))
            }}
          />
        </div>
        <TodoFeed url={todosUrl} />
      </main>
    </>
  )
}
