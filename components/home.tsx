import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { featuresConfig } from "@/config/features"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "./ui/separator"
import { useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, Lock, Trash2, Unlock } from "lucide-react"
import { apiKeyRegex, cn } from "@/lib/utils"
import OpenAI from "openai";
import { toast } from "./ui/use-toast"
import Loader from "./ui/loader"

interface IOpenaiFile {
    id: string,
    object: string,
    bytes: number,
    created_at: number,
    filename: string,
    purpose: string,
    status?: string | undefined
}

interface IOpenaiFineTuning {
    object: string,
    id: string,
    model: string,
    created_at: number,
    finished_at?: number,
    fine_tuned_model: string | null,
    organization_id: string,
    result_files: IOpenaiFile[],
    status: string,
    validation_file: string | null,
    training_file: string,
    hyperparameters: {
        n_epochs?: number | "auto",
    },
    trained_tokens: number
}

const FileRow = ({file, isLast, deleteFile}: {file: IOpenaiFile, isLast: boolean, deleteFile: (fileID: string) => Promise<void>}) => {

    const [isLoading, setIsLoading] = useState(false)

    const handler = async () => {
        setIsLoading(true)
        deleteFile(file.id)
        .catch(err => {
            toast({
                variant: 'destructive',
                title: 'An error has occurred',
                description: err.message
            })
        })
        .finally(() => setIsLoading(false))
    }

    return (
        <>
            <div className="flex gap-2 items-center justify-between">
                <p className="text-sm">{file.filename}</p>
                <Button variant='ghost' className="text-destructive hover:text-destructive" onClick={() => handler()}>{isLoading ? <Loader /> : <Trash2 size={18} />}</Button>
            </div>
            {isLast && <Separator />}
        </>
    )
}

const FineTuningModelRow = ({model, isLast, deleteModel}: {model: IOpenaiFineTuning, isLast: boolean, deleteModel: (fileID: string) => Promise<void>}) => {

    const [isLoading, setIsLoading] = useState(false)

    const handler = async () => {
        setIsLoading(true)
        deleteModel(model.id)
        .catch(err => {
            toast({
                variant: 'destructive',
                title: 'An error has occurred',
                description: err.message
            })
        })
        .finally(() => setIsLoading(false))
    }

    return (
        <>
            <div className="flex gap-2 items-center justify-between">
                <div className="grid gap-2">
                    <p className="text-sm">{model.fine_tuned_model}</p>
                </div>
                <Button variant='ghost' onClick={() => handler()}>{isLoading ? <Loader /> : <Trash2 className="text-destructive hover:text-destructive" size={18} />}</Button>
            </div>
            {isLast && <Separator />}
        </>
    )
}

export function Home({ step, setStep, setApiKey, apiKey }: { step: number, setStep: React.Dispatch<React.SetStateAction<number>>, setApiKey: React.Dispatch<React.SetStateAction<string>>, apiKey: string }) {

    const [showKey, setShowKey] = useState(false)
    const [lockKey, setLockKey] = useState(false)
    const [fineTuningModel, setFineTuningModel] = useState<IOpenaiFineTuning[]>([])
    const [files, setFiles] = useState<IOpenaiFile[]>([])

    const openai = useMemo(() => {
        if (apiKeyRegex.test(apiKey)) return new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true })
    }, [apiKey])

    const deleteFile = async (fileID: string) => {
        if (!openai) return
        await openai.files.del(fileID)
        setFiles(old => old.filter(f => f.id !== fileID))
    }

    const cancelModel = async (modelID: string) => {
        if (!openai) return
        await openai.fineTuning.jobs.cancel(modelID)
        setFineTuningModel(old => old.filter(m => m.id !== modelID))
    }

    useEffect(() => {
        if (apiKeyRegex.test(apiKey)) setLockKey(true)
    }, [apiKey])

    useEffect(() => {
        const displayInfo = async () => {
            if (!openai) return
            console.log(openai);

            setFiles((await openai.files.list()).data)
            setFineTuningModel((await openai.fineTuning.jobs.list()).data)
        }
        if (openai) displayInfo()
    }, [openai])

    return (
        <div
            style={{ transform: step > 0 ? `translate(-${window.innerWidth}px, -50%)` : `translate(-50%, -50%)` }}
            className="absolute top-1/2 left-1/2 grid gap-4 transition-all duration-500 ease-run">
            <Card className="p-6">
                <div className="flex">
                    <div className="grid gap-2">
                        <Label htmlFor="API_key">Your OpenAI API key</Label>
                        <div className="flex gap-2">
                            <Input disabled={lockKey} className={cn(!apiKeyRegex.test(apiKey) && apiKey ? 'border-destructive outline-destructive text-destructive' : "", "w-[400px]")} placeholder="sk-sjkndvclqnsbdofpks" type={showKey ? "text" : "password"} name="API_key" id="API_key" onChange={e => setApiKey(e.target.value)} />
                            <Button variant="outline" onClick={() => setShowKey(old => !old)}>{showKey ? <Eye size={18} /> : <EyeOff size={18} />}</Button>
                            <Button variant="outline" onClick={() => setLockKey(old => !old)}>{lockKey ? <Lock size={18} /> : <Unlock size={18} />}</Button>
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-4 items-start justify-start">
                    <div className="grid gap-4">
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>Your Openai&apos;s files</CardTitle>
                                <CardDescription>This tools help you to create a fine tuning your future GPT model.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                {
                                    files.map((file, key) => <FileRow key={key} file={file} isLast={files.length - 1 !== key} deleteFile={deleteFile} />)
                                }
                            </CardContent>
                        </Card>
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>Let&apos;s fine tuning your next AI.</CardTitle>
                                <CardDescription>This tools help you to create a fine tuning your future GPT model.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                {
                                    fineTuningModel.map((model, key) => <FineTuningModelRow key={key} model={model} isLast={fineTuningModel.length - 1 !== key} deleteModel={cancelModel} />)
                                }
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Let&apos;s fine tuning your next AI.</CardTitle>
                            <CardDescription>This tools help you to create a fine tuning your future GPT model.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {
                                featuresConfig.map((feature, key) => <div key={key} className="flex gap-2">
                                    <Icon name={feature.icon} />
                                    <p>{feature.name}</p>
                                </div>)
                            }
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button disabled={!apiKeyRegex.test(apiKey)} onClick={() => setStep(1)}>Start</Button>
                        </CardFooter>
                    </Card>
                </div>
            </Card>
        </div>
    )
}