import { defineComponent, ExtractPropTypes, PropType } from 'vue'
export type INativeType = 'button' | 'submit' | 'reset'
export type IType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
export type ISize = 'large' | 'medium' | 'small' | 'mini'
export type IButtonProps = Partial<ExtractPropTypes<typeof iButtonProps>>

const iButtonProps = {
  nativeType: {
    type: String as PropType<INativeType>,
    default: 'button'
  },
  type: {
    type: String as PropType<IType>,
    default: 'default'
  },
  size: {
    type: String as PropType<ISize>
  },
  icon: {
    type: String,
    default: ''
  },
  loading: Boolean,
  disabled: Boolean,
  plain: Boolean,
  autofocus: Boolean,
  round: Boolean,
  circle: Boolean,
  onClick: {
    type: Function as PropType<(evt: MouseEvent) => void>
  }
}

export default defineComponent({
  name: 'IButton',
  props: iButtonProps,
  emits: ['click'],
  setup: (props: IButtonProps, { slots, emit }) => {
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
