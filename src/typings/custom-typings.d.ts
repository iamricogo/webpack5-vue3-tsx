import { IAnimation } from 'pixi-spine'

declare module 'pixi-spine' {
  export interface ITrackEntry {
    animation: IAnimation
  }
}
