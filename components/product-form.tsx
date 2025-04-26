"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface ProductFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  defaultValues?: {
    name: string
    price: string
    image: string
  },
}

export function ProductForm({
  onSubmit,
  defaultValues = { name: "", price: "", image: "" },
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(defaultValues.image)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasImage, setHasImage] = useState(!!defaultValues.image)
  const [hasUpdatedImage, setHasUpdatedImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize the hidden input with the default image
    if (imageInputRef.current && defaultValues.image) {
      imageInputRef.current.value = defaultValues.image
    }
  }, [defaultValues.image])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string
        setImagePreview(dataUrl)
        setHasImage(true)

        // Update the hidden input with the data URL
        if (imageInputRef.current) {
          imageInputRef.current.value = dataUrl
        }
      }
    }
    reader.readAsDataURL(file)
    setHasUpdatedImage(true)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        processFile(file)
      }
    }
  }

  const handleDeleteImage = () => {
    setImagePreview("")
    setHasImage(false)
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    e.preventDefault()

    // Check if image is provided
    if (!imageInputRef.current?.value) {
      setIsSubmitting(false)
      return
    }

    // Use the form's native FormData submission
    const formData = new FormData(e.currentTarget)

    if (defaultValues.image && !hasUpdatedImage) {
      // If the image hasn't been updated, remove the image input from FormData
      formData.delete("image")
    }

    // onSubmit(formData)
    onSubmit(formData)
      .then(() => {
        setIsSubmitting(false)
        router.push("/")
        router.refresh()
      })
      .catch((error) => {
        console.error("Error submitting form:", error)
        setIsSubmitting(false)
      })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" required defaultValue={defaultValues.name} placeholder="Enter product name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (Rp)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={defaultValues.price}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-dropzone">
          Product Image <span className="text-destructive">*</span>
        </Label>

        {hasImage ? (
          <div className="relative border rounded-lg overflow-hidden aspect-square">
            <Image src={imagePreview || "/placeholder.svg"} alt="Product preview" fill className="object-contain" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={handleDeleteImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Delete image</span>
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center aspect-square ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Drag and drop an image here, or click to select a file
            </p>
            <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, GIF</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Hidden input to store the image data URL */}
      <input ref={imageInputRef} type="hidden" name="image" id="image" />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  )
}
