'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { sendMessage } from '@/actions/actions'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type NotificationFormData = {
  title: string
  body: string
}

const messagingPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NotificationFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (data: NotificationFormData) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('body', data.body)
    
    const {error} = await sendMessage(formData)
    if (error) {
      setErrorMessage("An error occurred while sending the notification. Please try again.")
    } else {
      setSuccessMessage("Notification sent successfully")
      reset()
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto p-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <Input 
            id="title" 
            {...register("title", { required: "Title is required" })}
            placeholder="Notification title" 
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        
        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-1">Message</label>
          <Textarea 
            id="body" 
            {...register("body", { required: "Message is required" })}
            placeholder="Enter your message" 
          />
          {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Notification'}
        </Button>
      </form>

      {successMessage && (
        <Alert variant="default" className="mt-4 bg-green-100 text-green-800 border-green-300 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mt-4 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default messagingPage