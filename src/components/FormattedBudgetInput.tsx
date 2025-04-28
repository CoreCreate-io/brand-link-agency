'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"

export function FormattedBudgetInput() {
  const [value, setValue] = useState('')

  const formatCurrency = (num: string) => {
    const onlyNumbers = num.replace(/[^\d]/g, '')
    if (!onlyNumbers) return ''
    const number = parseInt(onlyNumbers, 10)
    return number.toLocaleString('en-US', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setValue(formatted)
  }

  return (
    <Input
      type="text"
      placeholder="$0"
      value={value}
      onChange={handleChange}
      required
    />
  )
}
