'use client'
import { Dataset } from "@/components/dataset"
import { FineTuning } from "@/components/fine-tuning"
import { Home } from "@/components/home"
import { IMessages } from "@/types/globals"
import { useEffect, useState } from "react"
import OpenAI from "openai";
import { JSONLToUploadable } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export default function Page() {
  const [JSONL, setJSONL] = useState('')
  const [JSON, setJSON] = useState<IMessages[]>([])
  const [step, setStep] = useState(0)
  const [apiKey, setApiKey] = useState('')


  const train = async (apikey: string) => {
    if (!apikey) return
    setStep(3)
    const openai = new OpenAI({ apiKey: apikey, dangerouslyAllowBrowser: true })

    const file = await openai.files.create({
      file: JSONLToUploadable(JSONL),
      purpose: 'fine-tune'
    })

    let isFileProcessed = false
    let fileRetreive = ''

    while (!isFileProcessed) {
        const f = await openai.files.retrieve(file.id)
        isFileProcessed = ['processed', 'error', 'deleting', 'deleted'].includes(f.status || '')
        console.log(f.status)
        if (!isFileProcessed) await new Promise(resolve => setTimeout(resolve, 2000))
        else fileRetreive = f.status || ''
    }

    if (fileRetreive === 'processed') {
      openai.fineTuning.jobs.create({
        training_file: file.id,
        model: 'gpt-3.5-turbo'
      })
      .then(fineTuning => {
        console.log(fineTuning)
      })
      .catch(err => {
        toast({
          variant: 'destructive',
          title: "An error has occurred...",
          description: err.message
        })
      })
    } else {
      console.log(fileRetreive)
    }
  }

  useEffect(() => {
    if (JSONL) setStep(2)
  }, [JSONL])

  return (
    <main className="relative px-4 py-10 min-h-screen w-screen overflow-hidden">
      <Home setStep={setStep} step={step} setApiKey={setApiKey} apiKey={apiKey} />
      <Dataset setStep={setStep} setJSONL={setJSONL} setJSON={setJSON} step={step} />
      <FineTuning step={step} json={JSON} train={train} />
      <p className="absolute text-sm text-muted-foreground bottom-2 left-1/2 -translate-x-1/2">Made with the ❤️ by <a className="underline" href="http://" target="_blank" rel="noopener noreferrer">Joris Delorme</a>.</p>
    </main>
  )
}
