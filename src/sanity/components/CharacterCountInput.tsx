'use client'

import { type StringInputProps } from 'sanity'
import { useState, useEffect, useRef } from 'react'

export default function CharacterCountInput(props: StringInputProps) {
  const { elementProps, value } = props

  const characterLimit = 160
  const length = value?.length || 0
  const overLimit = length > characterLimit

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set to scroll height
    }
  }, [value])

  return (
    <div>
      <textarea
        {...elementProps}
        ref={textareaRef}
        rows={1}
        className={`p-2 border rounded w-full resize-none overflow-hidden ${
          overLimit ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <div className={`mt-1 text-xs ${overLimit ? 'text-red-500' : 'text-gray-500'}`}>
        {length}/{characterLimit} characters
      </div>
    </div>
  )
}
