/*
 * @Author: Rico
 * @Date: 2021-08-02 14:47:52
 * @LastEditors: Rico
 * @LastEditTime: 2021-08-02 15:55:45
 * @Description: 
 */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'