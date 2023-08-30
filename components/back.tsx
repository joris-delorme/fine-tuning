import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function Back({setStep}: {setStep: () => void}) {
    return <Button className="w-fit pr-6" variant='ghost' onClick={setStep}><ChevronLeft size={18} /> Retour</Button>
}