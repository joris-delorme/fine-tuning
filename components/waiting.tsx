import { Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function Waiting({ setStep }: { setStep: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <Card className="grid gap-2 max-w-xl w-[90vw] text-center p-8">
            <Bot size={50} className="mx-auto mb-4" />
            <h2 className="sm:text-3xl text-2xl font-bold">OpenAI currently training your model</h2>
            <p className="text-muted-foreground text-sm">This action can take several minutes. I had the idea to make a mini game in the meantime, come back in a few days to test it ;)</p>
            <Button className="mt-6 w-fit mx-auto" onClick={() => setStep(0)}>Wait at the dashboard</Button>
        </Card>
    )
}