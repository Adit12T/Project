import { useState } from 'react'
import { useTodos } from '../useTodos'

export function TodoFeed({ url }: { url?: string }) {
  const { state, retry } = useTodos(url)
  const [showCompleted, setShowCompleted] = useState(false)

  return (
    <section className="card" aria-labelledby="todos-heading">
      <h2 id="todos-heading">Task feed</h2>
      {state.status === 'loading' && <p role="status">Loading tasks…</p>}
      {state.status === 'error' && (
        <div role="alert">
          <p className="error">{state.message}</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      )}
      {state.status === 'ready' && (
        <>
          <label className="inline">
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />
            Show completed
          </label>
          <p>{state.todos.filter((t) => t.completed).length} of {state.todos.length} completed</p>
          <ul className="todos">
            {state.todos.filter((t) => showCompleted || !t.completed).map((t) => (
              <li key={t.id} className={t.completed ? 'done' : undefined}>{t.title}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
