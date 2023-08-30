'use client'
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
import { Bot, ExternalLink, Eye, EyeOff, Lock, Trash2, Unlock, UploadCloud } from "lucide-react"
import { apiKeyRegex, cn } from "@/lib/utils"
import OpenAI from "openai";
import { toast } from "./ui/use-toast"
import Loader from "./ui/loader"
import useWindowSize from "@/hooks/useWindowSize"
import { Skeleton } from "./ui/skeleton"

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

const FileRow = ({ file, isLast, deleteFile }: { file: IOpenaiFile, isLast: boolean, deleteFile: (fileID: string) => Promise<void> }) => {

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
                <Button variant='ghost' size='icon' onClick={() => handler()}>{isLoading ? <Loader /> : <Trash2 className="text-destructive hover:text-destructive" size={18} />}</Button>
            </div>
            {isLast && <Separator />}
        </>
    )
}

const FineTuningModelRow = ({ model, isLast, deleteModel }: { model: IOpenaiFineTuning, isLast: boolean, deleteModel: (fileID: string) => Promise<void> }) => {

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
                <Button variant='ghost' size='icon' asChild>
                    <a href={`https://platform.openai.com/playground?model=${model.fine_tuned_model}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={18} />
                    </a>
                </Button>
            </div>
            {isLast && <Separator />}
        </>
    )
}

export function Dashboard({ setStep, setApiKey, apiKey }: { setStep: React.Dispatch<React.SetStateAction<number>>, setApiKey: React.Dispatch<React.SetStateAction<string>>, apiKey: string }) {

    const [showKey, setShowKey] = useState(false)
    const [lockKey, setLockKey] = useState(false)
    const [fineTuningModel, setFineTuningModel] = useState<IOpenaiFineTuning[]>([])
    const [files, setFiles] = useState<IOpenaiFile[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const openai = useMemo(() => {
        setIsLoading(true)
        if (apiKeyRegex.test(apiKey)) return new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true })
        else {
            setFiles([])
            setFineTuningModel([])
            setIsLoading(false)
        }
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
            const filesResponse = (await openai.files.list()).data
            const FTModelResponse = (await openai.fineTuning.jobs.list()).data
            setIsLoading(false)
            setFiles(filesResponse)
            setFineTuningModel(FTModelResponse)
        }
        if (openai) displayInfo()
    }, [openai])

    const { width } = useWindowSize()

    return (
        <Card className="p-6 w-full max-w-[800px]">
            <div className="flex">
                <div className="grid gap-2">
                    <a className="flex gap-1 items-center" href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">
                        <Label htmlFor="apiKey">Your OpenAI API Key</Label>
                        <ExternalLink size={16} />
                    </a>
                    <div className="flex gap-2">
                        <Input disabled={lockKey} className={cn(!apiKeyRegex.test(apiKey) && apiKey ? 'border-destructive outline-destructive text-destructive' : "", "sm:w-[400px] max-w-[400px] w-full")} placeholder="sk-pRr1aftTM41RZMIacvj1..." type={showKey ? "text" : "password"} name="apiKey" id="apiKey" onChange={e => setApiKey(e.target.value)} />
                        <Button variant="outline" size='icon' onClick={() => setShowKey(old => !old)}>{showKey ? <Eye size={18} /> : <EyeOff size={18} />}</Button>
                        <Button variant="outline" size='icon' onClick={() => setLockKey(old => !old)}>{lockKey ? <Lock size={18} /> : <Unlock size={18} />}</Button>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-4 items-start justify-center flex-col sm:flex-row">
                <div className="grid gap-4 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Openai&apos;s files</CardTitle>
                            <CardDescription>All your files stored by Openai are here.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {
                                (!apiKeyRegex.test(apiKey) || isLoading) &&
                                <>
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                </>
                            }
                            {
                                files.length
                                    ?
                                    files.map((file, key) => <FileRow key={key} file={file} isLast={files.length - 1 !== key} deleteFile={deleteFile} />)
                                    : (apiKeyRegex.test(apiKey) && !isLoading) &&
                                    <div className='flex w-full flex-col items-center group justify-center rounded-md border border-dashed py-4 px-8 text-center'>
                                        <div className="mx-auto flex flex-col items-center justify-center text-center">
                                            <h2 className="text-xl font-semibold">No Files</h2>
                                            <p className="text-center text-sm font-normal leading-6 text-muted-foreground">
                                                Start by fine tuning gpt-3-turbo.
                                            </p>
                                        </div>
                                    </div>
                            }
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Let&apos;s fine tuning your next AI.</CardTitle>
                            <CardDescription>All your fine-tuning model are here.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {
                                (!apiKeyRegex.test(apiKey) || isLoading) &&
                                <>
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                </>
                            }
                            {
                                fineTuningModel.length
                                    ?
                                    fineTuningModel.map((model, key) => <FineTuningModelRow key={key} model={model} isLast={fineTuningModel.length - 1 !== key} deleteModel={cancelModel} />)
                                    : (apiKeyRegex.test(apiKey) && !isLoading) &&
                                    <div className='flex w-full flex-col items-center group justify-center rounded-md border border-dashed py-4 px-8 text-center'>
                                        <div className="mx-auto flex flex-col items-center justify-center text-center">
                                            <h2 className="text-xl font-semibold">No fine-tuning model</h2>
                                            <p className="text-center text-sm font-normal leading-6 text-muted-foreground">
                                                Start by fine tuning gpt-3-turbo.
                                            </p>
                                        </div>
                                    </div>
                            }
                        </CardContent>
                    </Card>
                </div>
                <Card className="sm:max-w-[350px] w-full">
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
    )
}