import React, { MouseEvent } from 'react'
import { useEffect } from 'react'

export const useOnOutsideClick = <T extends HTMLElement, R>(ref: React.RefObject<T>, handler: (event: MouseEvent<T>) => R) => {
  useEffect(() => {
    const handlerClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as T)) {
        handler(event as unknown as MouseEvent<T>)
      }
    }
    document.addEventListener('mousedown', handlerClickOutside)
    return () => document.removeEventListener('mousedown', handlerClickOutside)
  }, [ref])
}
