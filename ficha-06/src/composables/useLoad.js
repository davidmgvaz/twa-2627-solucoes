// useLoad — os três estados (loading / error / ready) escritos UMA vez. Um composable: uma função que usa
// ref + onMounted e devolve estado reativo. Cada chamada cria os seus próprios refs.
// The three states written ONCE. A composable: a function that uses ref + onMounted and returns reactive state.
// Each call creates its own refs.
import { onMounted, ref } from 'vue'

export function useLoad(fetcher) {
  const status = ref('loading') // 'loading' | 'error' | 'ready'
  const error = ref(null)
  const data = ref(null)

  async function load() {
    status.value = 'loading'
    error.value = null
    try {
      data.value = await fetcher()
      status.value = 'ready'
    } catch (err) {
      status.value = 'error'
      error.value = err.message
    }
  }

  onMounted(load) // registers on the component that called useLoad() · regista-se no componente que chamou useLoad()
  return { status, error, data, load }
}
