import { describe, expect, it } from 'vitest'
import { filterProjects, isOverdue, loadProjects, sampleProjects, saveProjects, validateTitle, type Project } from './projects'

describe('projects', () => {
  it('validates titles, including duplicates in any case', () => {
    expect(validateTitle('  ', sampleProjects)).toBe('Title is required.')
    expect(validateTitle('SOCIAL APP', sampleProjects)).toMatch(/already exists/)
    expect(validateTitle('x'.repeat(81), [])).toMatch(/80 characters/)
    expect(validateTitle('New thing', sampleProjects)).toBeNull()
  })

  it('filters by text, category and status together', () => {
    expect(filterProjects(sampleProjects, { query: 'app', category: 'All', status: 'All' }).map((p) => p.id)).toEqual(['p2'])
    expect(filterProjects(sampleProjects, { query: '', category: 'Web Design', status: 'Done' })).toHaveLength(1)
    expect(filterProjects(sampleProjects, { query: '', category: 'Web Design', status: 'Planned' })).toHaveLength(0)
  })

  it('flags unfinished projects past their due date', () => {
    const p: Project = { id: '1', title: 't', category: 'Web Design', status: 'Planned', dueDate: '2026-01-01' }
    expect(isOverdue(p, '2026-02-01')).toBe(true)
    expect(isOverdue({ ...p, status: 'Done' }, '2026-02-01')).toBe(false)
    expect(isOverdue({ ...p, dueDate: null }, '2026-02-01')).toBe(false)
  })

  it('persists projects and rejects tampered storage', () => {
    saveProjects([sampleProjects[0]])
    expect(loadProjects()).toEqual([sampleProjects[0]])
    localStorage.setItem('project-tracker:v2', JSON.stringify([{ ...sampleProjects[0], category: '<img onerror>' }]))
    expect(loadProjects()).toEqual(sampleProjects)
  })
})
