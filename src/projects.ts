export const CATEGORIES = ['Web Design', 'Web Development', 'Mobile Development', 'Data & AI'] as const
export const STATUSES = ['Planned', 'In progress', 'Done'] as const

export type Category = (typeof CATEGORIES)[number]
export type Status = (typeof STATUSES)[number]

export interface Project {
  id: string
  title: string
  category: Category
  status: Status
  dueDate: string | null
}

export interface Filters {
  query: string
  category: Category | 'All'
  status: Status | 'All'
}

export const sampleProjects: Project[] = [
  { id: 'p1', title: 'Business website', category: 'Web Design', status: 'Done', dueDate: null },
  { id: 'p2', title: 'Social app', category: 'Mobile Development', status: 'In progress', dueDate: '2026-12-15' },
  { id: 'p3', title: 'Shopping cart', category: 'Web Development', status: 'Planned', dueDate: '2027-01-31' },
]

export function validateTitle(title: string, existing: Project[]): string | null {
  const t = title.trim()
  if (!t) return 'Title is required.'
  if (t.length > 80) return 'Title must be 80 characters or fewer.'
  if (existing.some((p) => p.title.toLowerCase() === t.toLowerCase())) return 'A project with this title already exists.'
  return null
}

export function filterProjects(projects: Project[], filters: Filters): Project[] {
  const q = filters.query.trim().toLowerCase()
  return projects.filter(
    (p) =>
      (filters.category === 'All' || p.category === filters.category) &&
      (filters.status === 'All' || p.status === filters.status) &&
      (!q || p.title.toLowerCase().includes(q)),
  )
}

/** Overdue = has a due date before today and is not done. Dates are compared as YYYY-MM-DD strings. */
export function isOverdue(project: Project, today: string): boolean {
  return project.status !== 'Done' && project.dueDate !== null && project.dueDate < today
}

const STORAGE_KEY = 'project-tracker:v2'

function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return typeof p.id === 'string' && typeof p.title === 'string'
    && (CATEGORIES as readonly unknown[]).includes(p.category)
    && (STATUSES as readonly unknown[]).includes(p.status)
    && (p.dueDate === null || (typeof p.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.dueDate)))
}

export function loadProjects(storage: Storage = localStorage): Project[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
    if (Array.isArray(parsed) && parsed.every(isProject)) return parsed
  } catch {
    // Corrupt or unavailable storage: use the samples.
  }
  return sampleProjects
}

export function saveProjects(projects: Project[], storage: Storage = localStorage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {
    // Storage blocked or full: keep working without persistence.
  }
}
