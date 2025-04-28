'use client'

import { useState } from 'react'
import { set, unset } from 'sanity'

export default function NumberInputWithSeparators({ value, onChange }: any) {
  const [displayValue, setDisplayValue] = useState(value ? value.toLocaleString() : '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '')
    if (rawValue === '') {
      onChange(unset())
      setDisplayValue('')
      return
    }

    const num = parseInt(rawValue, 10)
    if (!isNaN(num)) {
      onChange(set(num))
      setDisplayValue(num.toLocaleString())
    }
  }

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className="border border-gray-300 rounded-md p-2 w-full"
    />
  )
}
