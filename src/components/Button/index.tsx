import { defineComponent } from 'vue'
import AppTypes, { func, oneOf } from '@/vue-types'
import StringUtils from '@/utils/StringUtils'
import './styles/index.scss'

export type IButtonProps = ExtractOutPropTypes<typeof iButtonProps>

const iButtonProps = {
  nativeType: oneOf(['button', 'submit', 'reset'] as const).def('button'),
  type: oneOf([
    'primary',
    'success',
    'warning',
    'danger',
    'info',
    'text',
    'default'
  ] as const).def('default'),
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

export default defineComponent({
  name: 'IButton',
  props: iButtonProps,
  setup: (props, { slots }) => {
    return () => (
      <button
        class={[
          StringUtils.classNameFormat('{ui}-button'),
          props.type
            ? StringUtils.classNameFormat('{ui}-button{--}' + props.type)
            : '',
          props.size
            ? StringUtils.classNameFormat('{ui}-button{--}' + props.size)
            : '',
          {
            [StringUtils.classNameFormat('{is-}disabled')]: props.disabled,
            [StringUtils.classNameFormat('{is-}loading')]: props.loading,
            [StringUtils.classNameFormat('{is-}plain')]: props.plain,
            [StringUtils.classNameFormat('{is-}round')]: props.round,
            [StringUtils.classNameFormat('{is-}circle')]: props.circle
          }
        ]}
        disabled={props.disabled || props.loading}
        autofocus={props.autofocus}
        type={props.nativeType}
        onClick={props.onClick}
      >
        {[
          props.loading && (
            <i class={StringUtils.classNameFormat('{ui}-icon-loading')}></i>
          ),
          props.icon && !props.loading && <i class={props.icon}></i>,
          slots.default && <span>{slots.default()}</span>
        ]}
      </button>
    )
  }
})
