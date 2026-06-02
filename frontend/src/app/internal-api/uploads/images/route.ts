import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { NextResponse } from 'next/server'

import { requireAuthToken } from '@/lib/auth'

export const runtime = 'nodejs'

const MAX_FILE_COUNT = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024
const allowedExtensions = new Map([
  ['image/gif', 'gif'],
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

export async function POST (request: Request) {
  try {
    await requireAuthToken()
  } catch {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData
    .getAll('images')
    .filter((value): value is File => value instanceof File)
    .slice(0, MAX_FILE_COUNT)

  if (files.length === 0) {
    return NextResponse.json({ message: 'No image files uploaded' }, { status: 400 })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posts')
  await mkdir(uploadDir, { recursive: true })

  const urls: string[] = []

  for (const file of files) {
    const extension = allowedExtensions.get(file.type)

    if (extension == null || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: 'Only image files up to 5MB are allowed' }, { status: 400 })
    }

    const filename = `${Date.now()}-${randomUUID()}.${extension}`
    const filepath = path.join(uploadDir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)
    urls.push(`/uploads/posts/${filename}`)
  }

  return NextResponse.json({ urls })
}
