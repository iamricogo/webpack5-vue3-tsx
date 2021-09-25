/**
 * 传入一个状态，用storage做持久化
 */

import { PartialDeep } from 'type-fest'
import { merge } from 'lodash'

interface Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}
interface Options<State> {
  state: State
  key?: string
  storage?: Storage
  reducer?: (state: State) => PartialDeep<State> | State
  replace?: (newState: PartialDeep<State> | undefined, state: State) => void
}

export default class PersistedState<State> {
  constructor(options: Options<State>) {
    const defaultOptions: Required<Omit<Options<State>, 'state'>> = {
      storage: window && window.localStorage,
      key: 'persisted-state',
      reducer: (state) => state,
      replace: (newState, state) => merge(state, newState)
    }
    this.options = Object.assign(defaultOptions, options)
    this.replaceState()
    this.update()
  }

  private options!: Required<Options<State>>

  private getState(
    key: string,
    storage: Storage
  ): PartialDeep<State> | undefined {
    const value = storage.getItem(key)
    try {
      return typeof value !== 'undefined'
        ? JSON.parse(value as string)
        : undefined
    } catch (err) {
      console.log(err)
    }

    return undefined
  }

  private setState(
    key: string,
    state: PartialDeep<State> | State,
    storage: Storage
  ): void {
    storage.setItem(key, JSON.stringify(state))
  }

  private replaceState(): void {
    const { state, key, storage, replace } = this.options
    replace(this.getState(key, storage), state)
  }

  /**
   *
   * @param newState 外部state变化时，初始传入的state是不见得变化的，如react，所以新的状态可以暴露一个从外面传入的
   */
  public update(newState?: State): void {
    const { key, storage, state, reducer } = this.options
    this.setState(key, reducer(newState || state), storage)
  }
}
