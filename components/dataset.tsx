'use client'

import FileInput from "@/components/ui/file-input";
import { useEffect } from "react";
import * as XLSX from 'xlsx'
import { Back } from "./back";
import { IMessages } from "@/types/globals";
import { toast } from "@/components/ui/use-toast";
import useWindowSize from "@/hooks/useWindowSize";

export function Dataset({ setJSONL, setJSON, step, setStep }: { setJSONL: React.Dispatch<React.SetStateAction<string>>, setJSON: React.Dispatch<React.SetStateAction<IMessages[]>>, step: number, setStep: React.Dispatch<React.SetStateAction<number>> }) {

  const handleFileUpload = (file: File | null) => {
    if (!file) return

    const fileExtension = file.name.split(".")[1]
    const allowedExtensions = ["xls", "xlsx"]

    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        variant: 'destructive',
        title: 'Your dataset need to be in xls or xlsx format.'
      })
      return
    }

    if ((file.size / 1024 / 1024) > 100) {
      toast({
        variant: 'destructive',
        title: 'Your file is too big make sure that it is less than 100MB.'
      })
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const data = e.target!.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][]
      console.log(dataParse)
    
      if (dataParse.length < 10) {
        toast({
          variant: 'destructive',
          title: 'Your table need to have at least 10 rows.',
          description: 'See the Openai dataset format below.'
        })
        return
      }

      for (let index = 0; index < dataParse.length; index++) {
        if (dataParse[index].length !== 3) {
          toast({
            variant: 'destructive',
            title: 'Your table need to have at least 3 columns.',
            description: 'See the Openai dataset format below.'
          })
          return
        } 
      }

      const jsonData = convertToJSON(dataParse as [])
      setJSON(jsonData)
      convertToJsonL(jsonData)
    }

    reader.readAsBinaryString(file)
  }

  const convertToJSON = (data: []) => {
    const res: IMessages[] = []
    data.forEach(row => {
      res.push({
        messages: [
          { role: 'system', content: row[0] },
          { role: 'user', content: row[1] },
          { role: 'assistant', content: row[2] },
        ]
      })
    })
    return res
  }

  const convertToJsonL = (data: IMessages[]) => {
    let jsonlStr = ''
    data.forEach((item) => {
      jsonlStr += JSON.stringify(item) + '\n'
    })
    setJSONL(jsonlStr)
  }
  useEffect(() => {
    console.log(step)
  }, [step])

  const { width } = useWindowSize()

  return (
    <div
      style={{ transform: step > 1 ? `translate(-${width}px, -50%)` : step === 1 ? `translate(-50%, -50%)` : `translate(${width}px, -50%)` }}
      className="absolute top-1/2 left-1/2 grid gap-4 transition-all duration-500 ease-run">
      <Back setStep={() => setStep(0)} />
      <FileInput onFileChange={file => handleFileUpload(file)} />
    </div>
  )
}