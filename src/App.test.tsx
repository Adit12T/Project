import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

function mockFetch(response: () => Promise<Response>) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(response)
}

const todosJson = [
  { userId: 1, id: 1, title: 'write tests', completed: true },
  { userId: 1, id: 2, title: 'ship release', completed: false },
]

afterEach(() => vi.restoreAllMocks())

describe('Project Tracker', () => {
  it('adds, filters, updates and deletes projects with undo', async () => {
    mockFetch(async () => new Response(JSON.stringify(todosJson)))
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Title'), 'Mobile banking')
    await user.selectOptions(screen.getByLabelText('Category'), 'Mobile Development')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Mobile banking')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search'), 'banking')
    const list = screen.getByRole('list', { name: 'Projects' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)

    await user.selectOptions(screen.getByLabelText('Status of Mobile banking'), 'Done')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Mobile banking' }))
    expect(screen.getByText('No projects match these filters.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(screen.getByText('Mobile banking')).toBeInTheDocument()
  })

  it('shows duplicate-title errors', async () => {
    mockFetch(async () => new Response(JSON.stringify(todosJson)))
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Title'), 'shopping cart')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('alert')).toHaveTextContent('already exists')
  })

  it('loads the task feed and hides completed tasks by default', async () => {
    mockFetch(async () => new Response(JSON.stringify(todosJson)))
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByText('ship release')).toBeInTheDocument()
    expect(screen.getByText('1 of 2 completed')).toBeInTheDocument()
    expect(screen.queryByText('write tests')).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Show completed'))
    expect(screen.getByText('write tests')).toBeInTheDocument()
  })

  it('reports feed errors and recovers on retry', async () => {
    const fetchMock = mockFetch(async () => new Response('down', { status: 503 }))
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByText('The task service answered 503.')).toBeInTheDocument()
    fetchMock.mockImplementation(async () => new Response(JSON.stringify(todosJson)))
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getByText('ship release')).toBeInTheDocument())
  })
})
