"use client"

import { useState, useRef, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { submitPayment } from "./action"

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full bg-navy text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
    >
      {pending ? "กำลังอัปโหลด..." : "ยืนยันการจอง"}
    </button>
  )
}

export default function PaymentForm({ bookingId, totalPrice }) {
  const [state, formAction] = useActionState(submitPayment, null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("ขนาดไฟล์ต้องไม่เกิน 5MB")
        return
      }
      setFile(selectedFile)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
       if (!droppedFile.type.startsWith("image/")) {
         alert("รองรับไฟล์รูปภาพเท่านั้น")
         return
       }
       if (droppedFile.size > 5 * 1024 * 1024) {
         alert("ขนาดไฟล์ต้องไม่เกิน 5MB")
         return
       }
       setFile(droppedFile)
       const reader = new FileReader()
       reader.onloadend = () => {
         setPreview(reader.result)
       }
       reader.readAsDataURL(droppedFile)
       
       const dataTransfer = new DataTransfer()
       dataTransfer.items.add(droppedFile)
       if (fileInputRef.current) {
         fileInputRef.current.files = dataTransfer.files
       }
    }
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="totalPrice" value={totalPrice} />
      
      <p className="text-sm font-medium text-navy mb-3">แนบสลิปการโอนเงิน</p>
      
      <div 
        className="border-2 border-dashed border-border rounded-xl p-6 text-center mb-4 cursor-pointer hover:bg-slate-50 transition-colors relative"
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file"
          name="slip"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />

        {preview ? (
           <div className="flex flex-col items-center">
             <img src={preview} alt="Slip preview" className="max-h-48 object-contain mb-3 rounded-lg shadow-sm" />
             <p className="text-sm text-navy/70">คลิกเพื่อเปลี่ยนไฟล์</p>
           </div>
        ) : (
          <div className="py-8">
            <p className="text-navy/70">ลากไฟล์สลิปมาวาง หรือคลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-navy/50 mt-1">รองรับ jpg, png ขนาดไม่เกิน 5MB</p>
          </div>
        )}
      </div>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <SubmitButton disabled={!file} />
      
      <p className="text-xs text-navy/50 text-center mt-2">
        การจองของคุณจะรอการอนุมัติจากเจ้าหน้าที่หลังแนบสลิป
      </p>
    </form>
  )
}
