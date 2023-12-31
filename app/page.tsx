'use client'
import { Dataset } from "@/components/dataset"
import { FineTuning } from "@/components/fine-tuning"
import { Dashboard } from "@/components/dashboard"
import { IMessages } from "@/types/globals"
import { useEffect, useLayoutEffect, useState } from "react"
import OpenAI from "openai";
import { JSONLToUploadable } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { SlideEffect } from "@/components/slide-effect"
import { Back } from "@/components/back"
import { Waiting } from "@/components/waiting"
import { Newsletter } from "@/components/newsletter"

interface IOpenaiFile {
  id: string,
  object: string,
  bytes: number,
  created_at: number,
  filename: string,
  purpose: string,
  status?: string | undefined
}

export default function Home() {
  const [JSONL, setJSONL] = useState('')
  const [JSON, setJSON] = useState<IMessages[]>([])
  const [step, setStep] = useState(0)
  const [apiKey, setApiKey] = useState('')
  const [isTraining, setTraining] = useState(false)
  const [showNewsletter, setShowNewsLetter] = useState(false)


  const train = async () => {
    if (!apiKey) {
      toast({
        variant: 'destructive',
        title: "Please set an API Key !",
      })
      setJSON([])
      setJSONL('')
      setStep(0)
      setTraining(false)
      return
    }

    setTraining(true)

    const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true })
    const file = await openai.files.create({
      file: JSONLToUploadable(JSONL),
      purpose: 'fine-tune'
    })

    let isFileProcessed = false
    let fileRetreive: IOpenaiFile | null = null


    while (!isFileProcessed) {
      const f = await openai.files.retrieve(file.id)
      isFileProcessed = ['processed', 'error', 'deleting', 'deleted'].includes(f.status || '')
      console.log(f.status)
      if (!isFileProcessed) await new Promise(resolve => setTimeout(resolve, 2000))
      else fileRetreive = f
    }

    if (fileRetreive && fileRetreive.status === 'processed') {
      openai.fineTuning.jobs.create({
        training_file: file.id,
        model: 'gpt-3.5-turbo'
      })
        .then(_ => {
          setStep(3)
          setShowNewsLetter(true)
        })
        .catch(err => {
          toast({
            variant: 'destructive',
            title: "An error has occurred...",
            description: err.message
          })
          setStep(0)
        })
        .finally(() => {
          setJSON([])
          setJSONL('')
          setTraining(false)
        })
    } else {
      toast({
        variant: 'destructive',
        title: "An error has occurred...",
        description: `File status ${fileRetreive?.status}`
      })
      setJSON([])
      setJSONL('')
      setStep(0)
      setTraining(false)
    }
    /*
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTraining(false)
    */
  }

  useEffect(() => {
    if (JSONL) setStep(2)
  }, [JSONL])

  const getDir = (s: number, n: number): number => {
    if (s < n) return 1
    else return -1
  }

  useLayoutEffect(() => {
    const icon = document.querySelector("link[rel='icon']") as HTMLLinkElement
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => icon.href = e.matches ? "/light/favicon.ico" : "/favicon.ico")
    icon.href = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "/light/favicon.ico" : "/favicon.ico"
  }, [])

  return (
    <main className="px-4 relative py-20 flex flex-col justify-center items-center min-h-screen w-screen overflow-hidden">

      <div className="absolute top-0 left-0 h-screen w-screen">
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
            <FineTuning json={JSON} train={train} isTraining={isTraining} />
          </div>
        </SlideEffect>

        <SlideEffect show={step === 3} direction={getDir(step, 3)} className="absolute top-1/2 left-1/2">
          <div className="-translate-y-1/2 -translate-x-1/2 grid gap-4 transition-all">
            <Waiting setStep={setStep} />
          </div>
        </SlideEffect>
      </div>

      <SlideEffect show={step === 0} defaultSlide={0} className="relative z-90">
        <Dashboard setStep={setStep} setApiKey={setApiKey} apiKey={apiKey} isTraining={isTraining} />
      </SlideEffect>

      <Newsletter show={showNewsletter} />
      <p className="footer tall absolute bottom-2">Made with the ❤️ by <a className="underline" href="https://jorisdelorme.fr" target="_blank" rel="noopener noreferrer">Joris</a>.</p>
    </main>
  )
}
