export default class Validator {
  static isEmail(context: unknown): boolean {
    if (typeof context === 'string') {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(context)
    }

    return false
  }

  static isEmpty(context: string | null | undefined): boolean {
    return ['', undefined, null].includes(context)
  }

  static isMobileNumber(context: string | null | undefined): boolean {
    if (typeof context === 'string') {
      return /^\d{1,17}$/.test(context)
    }

    return false
  }
}
