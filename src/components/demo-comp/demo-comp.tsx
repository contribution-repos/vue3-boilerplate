import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CheckLang',
  props: {
    modelValue: {
      type: String
    }
  },
  setup(props) {
    return () => (
      <div class="check-lang">
        {props.modelValue}
      </div>
    )
  }
})
