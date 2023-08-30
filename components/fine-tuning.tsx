import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import tokenizer from 'gpt-tokenizer'
import { useEffect, useState } from "react"
import { IMessages } from "@/types/globals"
import { BadgeDollarSign, Rocket } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { roundNumber } from "@/lib/utils"

export function FineTuning({ step, train, json }: { step: number, json: IMessages[], train: (apiKey: string) => void }) {
    const [tokens, setTokens] = useState(0)
    const [apiKey, setApiKey] = useState('')

    useEffect(() => {
        let res = 0
        json.forEach((message) => {
            res += tokenizer.encodeChat(message.messages, 'gpt-3.5-turbo').length
        })
        setTokens(roundNumber(res, 4))
    }, [json])
    return (
        <div
            style={{ transform: step > 2 ? `translate(-${window.innerWidth}px, -50%)` : step === 2 ? `translate(-50%, -50%)` : `translate(${window.innerWidth}px, -50%)` }}
            className="absolute top-1/2 left-1/2 grid gap-4 transition-all duration-500 ease-run">
            <Card>
                <CardHeader>
                    <CardTitle>Final part, train your model !</CardTitle>
                    <CardDescription>We will fine tuning chat-GPT-3-turbo.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex gap-2">
                        <BadgeDollarSign />
                        <p>This action will cost you {(tokens/1000)*0.0080}$ of API usage.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="API_key">Your OpenAI API key</Label>
                        <Input className="w-[400px]" placeholder="sk-sjkndvclqnsbdofpks" type="text" name="API_key" id="API_key" onChange={e => setApiKey(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button className="flex gap-1 group" onClick={() => train(apiKey)}>Train <Rocket className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-all fill-background" size={16} /></Button>
                </CardFooter>
            </Card>
        </div>
    )
}