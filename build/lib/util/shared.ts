export const isWindows = process.platform === 'win32'

export const isDev = process.env.NODE_ENV === 'development'

export const _typeof = (context: unknown): string =>
  Object.prototype.toString.call(context).slice(8, -1).toLowerCase()

/**
 * @param {string} key 
 *  can't find    =>undefined
        --key         =>true
        --key=value   =>value
        --key value   =>value
 * @returns 
 */
export const getParamsByKey = (key: string): string => {
  let value = undefined
  for (let index = 0; index < process.argv.length; index++) {
    const cur = process.argv[index],
      next = process.argv[index + 1]
    if (new RegExp(`^--${key}(=\\w+)?$`).test(cur)) {
      if (new RegExp(`^--${key}$`).test(cur)) {
        //--key value
        value =
          !next || (next && new RegExp(`^--\\w+(=\\w+)?$`).test(next))
            ? true
            : next
      } else {
        //--key=value
        value = cur.split('=')[1]
      }
      break
    }
  }
  return value
}
