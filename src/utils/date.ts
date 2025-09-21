/**
 * Date utility functions
 */

/**
 * Format a date string to a localized format
 */
export const formatDate = (dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const optionsMap = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' } as Intl.DateTimeFormatOptions,
    medium: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions,
    long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' } as Intl.DateTimeFormatOptions
  }

  return date.toLocaleDateString(undefined, optionsMap[format])
}

/**
 * Format a timestamp to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? 'just now' : `${diffSeconds} seconds ago`
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
  } else {
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`
  }
}

/**
 * Get date range for the last N days
 */
export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

/**
 * Check if a date is within the last N days
 */
export const isWithinLastDays = (dateString: string, days: number): boolean => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return diffDays <= days
}