/**
 * 传入一个状态，用storage做持久化
 */

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
  reducer?: (state: State) => DeepPartial<State>
}

export default class PersistedState<State> {
  constructor(options: Options<State>) {
    this.options = Object.assign(
      {
        storage: window && window.localStorage,
        key: 'persisted-state',
        reducer: (state: State) => state
      },
      options
    )
    this.replaceState()
    this.update()
  }

  private options!: Required<Options<State>>

  private getState(key: string, storage: Storage): State | undefined {
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
    state: DeepPartial<State>,
    storage: Storage
  ): void {
    storage.setItem(key, JSON.stringify(state))
  }

  private replaceState(): void {
    const { state, key, storage } = this.options
    merge(state, this.getState(key, storage))
  }

  public update(): void {
    const { key, storage, state, reducer } = this.options
    this.setState(key, reducer(state), storage)
  }
}
