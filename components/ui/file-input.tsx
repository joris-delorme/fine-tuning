'use client'
import { UploadCloud } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from './button'
import { Separator } from './separator'
import { cn } from '@/lib/utils'
import { DatasetFormat } from '@/components/dataset-format'

const FileInput = ({ onFileChange }: { onFileChange: (file: File | null) => void}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    onFileChange(file)
    if (fileInputRef.current && fileInputRef.current.value) fileInputRef.current.value = ''
  }

  const triggerFileSelectPopup = () => fileInputRef.current?.click()

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    onFileChange(file)
    if (fileInputRef.current && fileInputRef.current.value) fileInputRef.current.value = ''
  }

  return (
    <div className='flex min-h-[400px] w-full flex-col items-center group justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" value='' ref={fileInputRef} accept=".xls,.xlsx" onChange={handleFileChange} hidden />
      <div className="mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center group-hover:scale-120 transition-all duration-500 rounded-full bg-muted">
          <UploadCloud className={cn(isDragOver && '-translate-y-2')} size={30} />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Drag and drop dataset</h2>
        <p className="mb-4 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
          Commencé par ajouter votre première entreprise.
        </p>
        <Button onClick={triggerFileSelectPopup} className='mb-6'>Upload</Button>
        <div className="flex gap-5 items-center text-sm">
          <div className="text-center">
            <h3 className='font-bold'>File types</h3>
            <p>.xls, .xlsx</p>
          </div>
          <Separator className='w-[2px] h-[50px] rounded-xl' orientation="vertical" />
          <div className="text-center">
            <h3 className='font-bold'>100MB</h3>
            <p>max size</p>
          </div>
          <Separator className='w-[2px] h-[50px] rounded-xl' orientation="vertical" />
          <div className="text-center">
            <h3 className='font-bold'>Openai dataset</h3>
            <DatasetFormat />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileInput
