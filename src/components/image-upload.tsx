"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Link } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string | undefined
  onChange: (url: string) => void
  name?: string
  onBlur?: () => void
}

export function ImageUpload({ value, onChange, name, onBlur }: ImageUploadProps) {
  const [inputType, setInputType] = useState<"url" | "file">("url")
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    setPreview(url || null)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      onChange(result)
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={inputType === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputType("url")}
        >
          <Link className="h-4 w-4 mr-2" />
          URL
        </Button>
        <Button
          type="button"
          variant={inputType === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputType("file")}
        >
          <Upload className="h-4 w-4 mr-2" />
          Arquivo
        </Button>
      </div>

      {inputType === "url" ? (
        <Input
          type="text"
          placeholder="Digite a URL da imagem"
          value={value || ""}
          onChange={handleUrlChange}
          name={name}
          onBlur={onBlur}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            name={name}
          />
          <Button type="button" variant="outline" onClick={handleFileButtonClick} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Selecionar imagem
          </Button>
        </div>
      )}

      {preview && (
        <div className="mt-2 relative aspect-video rounded-md overflow-hidden border">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview da imagem"
            fill
            className="object-cover"
            onError={() => setPreview(null)}
          />
        </div>
      )}
    </div>
  )
}

