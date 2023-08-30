import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function DatasetFormat() {
    return (
        <Dialog>
            <DialogTrigger className="underline">format</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Format your dataset</DialogTitle>
                    <DialogDescription>
                        Your dataset need to have at least of 10 rows and have exactly 3 columns ! See the exemple below ( don&apos;t include the first row ):
                    </DialogDescription>
                </DialogHeader>
                <div className="">
                    <table className="table-auto border-collapse border">
                        <thead>
                            <tr>
                                { ['System', 'User', 'Assistant'].map((role, key) => <th key={key} className="text-left border p-4 bg-secondary/50">{role}</th>) }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [
                                    ["You are an assistant that occasionally misspells words", "Tell me a story.", "One day a student went to schoool."],
                                    ["You are an assistant that occasionally misspells words", "Tell me a story.", "One day a student went to schoool."],
                                    ["You are an assistant that occasionally misspells words", "Tell me a story.", "One day a student went to schoool."],
                                    ["...", "...", "..."]
                                ].map((messages, key) => <tr className="border p-4" key={key}>
                                    {
                                        messages.map((message, key) => <td className="border p-4" key={key}>{message}</td>)
                                    }
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                <p className="mt-2">For more information see my article <a className="underline" href="http://appple.com" target="_blank" rel="noopener noreferrer">to learn how to build a fine-tuning model using this tools</a>.</p>
            </DialogContent>
        </Dialog>
    )
}