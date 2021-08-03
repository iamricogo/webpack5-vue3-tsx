import { defineComponent, ExtractPropTypes, PropType } from 'vue'

export enum ISize {
  large = 'large',
  medium = 'medium',
  small = 'small',
  mini = 'mini'
}

export enum IType {
  primary = 'primary',
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  info = 'info',
  text = 'text',
  default = 'default'
}

export enum INativeType {
  button = 'button',
  submit = 'submit',
  reset = 'reset'
}
export type IButtonProps = Partial<ExtractPropTypes<typeof iButtonProps>>

const iButtonProps = {
  nativeType: {
    type: String as PropType<INativeType.button | INativeType.submit | INativeType.reset>,
    default: IType.default
  },
  type: {
    type: String as PropType<
      | IType.primary
      | IType.success
      | IType.warning
      | IType.danger
      | IType.info
      | IType.text
      | IType.default
    >,
    default: 'default'
  },
  size: {
    type: String as PropType<ISize.large | ISize.medium | ISize.small | ISize.mini>
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
  circle: Boolean
}

export default defineComponent({
  name: 'IButton',
  props: iButtonProps,
  setup: (props: IButtonProps) => {
    return () => <div>{JSON.stringify(props)}</div>
  }
})
