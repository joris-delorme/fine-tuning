'use client'
import { Dataset } from "@/components/dataset"
import { FineTuning } from "@/components/fine-tuning"
import { Dashboard } from "@/components/dashboard"
import { IMessages } from "@/types/globals"
import { useEffect, useState } from "react"
import OpenAI from "openai";
import { JSONLToUploadable } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { SlideEffect } from "@/components/slide-effect"
import { Back } from "@/components/back"

export default function Home() {
  const [JSONL, setJSONL] = useState('')
  const [JSON, setJSON] = useState<IMessages[]>([])
  const [step, setStep] = useState(0)
  const [apiKey, setApiKey] = useState('')


  const train = async () => {
    if (!apiKey) return
    const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true })
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
          setJSON([])
          setJSONL('')
          setStep(0)
        })
        .catch(err => {
          toast({
            variant: 'destructive',
            title: "An error has occurred...",
            description: err.message
          })
          setJSON([])
          setJSONL('')
          setStep(0)
        })
    } else {
      console.log(fileRetreive)
    }
  }

  useEffect(() => {
    if (JSONL) setStep(2)
  }, [JSONL])

  const getDir = (s: number, n: number): number => {
    if (s < n) return 1
    else return -1
  }

  return (
    <main className="px-4 py-20 flex flex-col justify-center items-center min-h-screen w-screen overflow-hidden">

      <SlideEffect show={step === 0} defaultSlide={0}>
        <Dashboard setStep={setStep} setApiKey={setApiKey} apiKey={apiKey} />
      </SlideEffect>

      <SlideEffect show={step === 1} direction={getDir(step, 1)} className="absolute top-1/2 left-1/2">
        <div className="-translate-y-1/2 -translate-x-1/2 grid gap-4">
          <Back setStep={() => setStep(0)} />
          <Dataset setJSONL={setJSONL} setJSON={setJSON} />
        </div>
      </SlideEffect>

      <SlideEffect show={step === 2} direction={getDir(step, 2)} className="absolute top-1/2 left-1/2">
        <div className="-translate-y-1/2 -translate-x-1/2 grid gap-4 transition-all">
          <Back setStep={() => {
              setJSON([])
              setJSONL('')
              setStep(1)
            }} />
          <FineTuning json={JSON} train={train} />
        </div>
      </SlideEffect>

      <p className="footer tall absolute bottom-2">Made with the ❤️ by <a className="underline" href="https://jorisdelorme.fr" target="_blank" rel="noopener noreferrer">Joris</a>.</p>
    </main>
  )
}
