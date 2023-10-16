import { useEffect, useState } from 'react'

export const useScript = (src: string, onLoaded: () => any | undefined) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string | Event>(null)
  useEffect(() => {
    if (!src) {
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = src
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      script.onload = () => {
        setLoading(false)
        return onLoaded()
      }
      script.onerror = (error) => {
        setError(error)
        setLoading(false)
      }
    }
  }, [src])
  return [loading, error]
}
