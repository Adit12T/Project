import { useCallback, useEffect, useState } from 'react'

export interface Todo {
  id: number
  title: string
  completed: boolean
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; todos: Todo[] }

export const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=20'

/** Loads the task feed with cancellation, a timeout, response validation and a retry function. */
export function useTodos(url = TODOS_URL) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(new DOMException('Timed out', 'TimeoutError')), 8000)
    setState({ status: 'loading' })

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`The task service answered ${response.status}.`)
        return response.json() as Promise<unknown>
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('The task service sent an unexpected response.')
        const todos = data
          .filter((t): t is Todo => typeof t?.id === 'number' && typeof t?.title === 'string' && typeof t?.completed === 'boolean')
          .map(({ id, title, completed }) => ({ id, title, completed }))
        setState({ status: 'ready', todos })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted && controller.signal.reason?.name !== 'TimeoutError') return
        const message = controller.signal.reason?.name === 'TimeoutError'
          ? 'The task service took too long to answer.'
          : error instanceof Error ? error.message : 'Could not load tasks.'
        setState({ status: 'error', message })
      })
      .finally(() => clearTimeout(timeout))

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [url, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { state, retry }
}
