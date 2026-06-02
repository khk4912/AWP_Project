'use client'

import { ImagePlusIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'

import PostImageSlider from './PostImageSlider'
import { uploadPostImages } from '@/lib/api'
import { parsePostImageUrls, serializePostImageUrls } from '@/lib/post-images'

type PostImageFieldProps = {
  defaultValue?: string
  disabled?: boolean
  name?: string
  onChange?: (value: string) => void
  value?: string
}

export default function PostImageField ({
  defaultValue = '',
  disabled = false,
  name = 'imageUrl',
  onChange,
  value,
}: PostImageFieldProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const imageUrl = value ?? localValue

  function commitValue (nextValue: string) {
    setLocalValue(nextValue)
    onChange?.(nextValue)
  }

  async function handleUpload (files: FileList | null) {
    if (files == null || files.length === 0) return

    setIsUploading(true)
    setError('')

    try {
      const urls = await uploadPostImages(Array.from(files))
      const nextValue = serializePostImageUrls([
        ...parsePostImageUrls(imageUrl),
        ...urls,
      ])
      commitValue(nextValue)
    } catch {
      setError('이미지를 업로드하지 못했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='mt-3'>
      <div className='flex items-center gap-2'>
        <input
          type='text'
          name={name}
          value={imageUrl}
          disabled={disabled || isUploading}
          placeholder='이미지 URL'
          className='min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-950 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500'
          onChange={(event) => commitValue(event.target.value)}
        />
        <label className='inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-gray-950'>
          <span className='sr-only'>이미지 업로드</span>
          {isUploading ? <Loader2Icon className='h-5 w-5 animate-spin' /> : <ImagePlusIcon className='h-5 w-5' />}
          <input
            type='file'
            accept='image/*'
            multiple
            disabled={disabled || isUploading}
            className='hidden'
            onChange={(event) => {
              handleUpload(event.target.files).catch(() => setError('이미지를 업로드하지 못했습니다.'))
              event.target.value = ''
            }}
          />
        </label>
      </div>
      {error.length > 0 ? <p className='mt-2 text-sm font-medium text-red-500'>{error}</p> : null}
      <PostImageSlider imageUrl={imageUrl} alt='게시글 이미지 미리보기' />
    </div>
  )
}
