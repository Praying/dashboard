/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate username (alphanumeric, underscores, hyphens, 3-20 characters)
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Validate password (at least 8 characters, one uppercase, one lowercase, one number)
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) {
    return false
  }

  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Validate number range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0
  }

  return true
}

/**
 * Validate file size in bytes
 */
export const isValidFileSize = (fileSize: number, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return fileSize <= maxSizeInBytes
}

/**
 * Validate file type
 */
export const isValidFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}

/**
 * Sanitize string input
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '')
}

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: number

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => func(...args), delay)
  }
}