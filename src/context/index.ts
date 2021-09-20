import { App } from 'Vue'
import { Application } from 'pixi.js'
import { Device } from './Device'
import { EventEmitter } from 'events'
import { Resolution } from './Resolution'
const emitter = new EventEmitter()
const device = new Device()
const resolution = new Resolution()

type Apps = {
  pixi?: Application
  vue?: App<Element>
}
const apps: Apps = {}
interface Context {
  apps: Apps
  emitter: EventEmitter
  device: Device
  resolution: Resolution
}

export { emitter, device, apps, resolution }

const context: Context = {
  apps,
  emitter,
  device,
  resolution
}

export default context
