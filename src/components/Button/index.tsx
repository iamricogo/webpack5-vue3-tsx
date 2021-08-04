import { defineComponent } from 'vue'
import AppTypes, { func, oneOf } from '@/vue-types'

export type IButtonProps = ExtractOutPropTypes<typeof iButtonProps>

const iButtonProps = {
  nativeType: oneOf(['button', 'submit', 'reset'] as const).def('button'),
  type: oneOf(['primary', 'success', 'warning', 'danger', 'info', 'text', 'default'] as const).def(
    'default'
  ),
  size: oneOf(['large', 'medium', 'small', 'mini'] as const),
  icon: AppTypes.string,
  loading: AppTypes.looseBool,
  disabled: AppTypes.looseBool,
  plain: AppTypes.looseBool,
  autofocus: AppTypes.looseBool,
  round: AppTypes.looseBool,
  circle: AppTypes.looseBool,
  onClick: func<(evt: MouseEvent) => void>()
}

console.log(iButtonProps)

export default defineComponent({
  name: 'IButton',
  props: iButtonProps,
  emits: ['click'],
  setup: (props, { slots, emit }) => {
    return () => (
      <button
        class={[
          'i-button',
          props.type ? 'i-button--' + props.type : '',
          props.size ? 'i-button--' + props.size : '',
          {
            'is-disabled': props.disabled,
            'is-loading': props.loading,
            'is-plain': props.plain,
            'is-round': props.round,
            'is-circle': props.circle
          }
        ]}
        disabled={props.disabled || props.loading}
        autofocus={props.autofocus}
        type={props.nativeType}
        onClick={(e) => emit('click', e)}
      >
        {[
          props.loading && <i class="i-icon-loading"></i>,
          props.icon && !props.loading && <i class={props.icon}></i>,
          slots.default && <span>{slots.default()}</span>
        ]}
      </button>
    )
  }
})
