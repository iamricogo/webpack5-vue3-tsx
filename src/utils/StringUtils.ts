import cssVar from '@/styles/var/config.module.scss'
export default class StringUtils {
  static classNameFormat(str: string): string {
    return str
      .replace(/{ui}/g, cssVar.namespace)
      .replace(/{__}/g, cssVar['element-separator'])
      .replace(/{--}/g, cssVar['modifier-separator'])
      .replace(/{is-}/g, cssVar['state-prefix'])
  }
}
