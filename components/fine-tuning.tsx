'use client'
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
import { roundNumber } from "@/lib/utils"

export function FineTuning({ train, json }: { json: IMessages[], train: () => void }) {
    const [tokens, setTokens] = useState(0)

    useEffect(() => {
        let res = 0
        json.forEach((message) => {
            res += tokenizer.encodeChat(message.messages, 'gpt-3.5-turbo').length
        })
        setTokens(res)
    }, [json])
    
    return (
            <Card>
                <CardHeader>
                    <CardTitle>Final part, train your model !</CardTitle>
                    <CardDescription>We will fine tuning chat-GPT-3-turbo.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex gap-2">
                        <BadgeDollarSign />
                        <p>This action will cost you {roundNumber((tokens/1000)*0.0080, 4)}$ of API usage.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button className="flex gap-1 group" onClick={() => train()}>Train <Rocket className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-all fill-background" size={16} /></Button>
                </CardFooter>
            </Card>
    )
}