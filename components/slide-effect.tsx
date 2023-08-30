import useWindowSize from "@/hooks/useWindowSize"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export function SlideEffect({ children, show, direction=-1, className, defaultSlide=10000 }: { children: React.ReactNode, show: boolean, direction?: number, className?: string, defaultSlide?: number }) {

    const ref = useRef<HTMLDivElement | null>(null)
    const [slide, setSLide] = useState(defaultSlide)
    const { width } = useWindowSize()

    useEffect(() => {        
        if (ref.current) {
            if (show) setSLide(0)
            else setSLide(width/2 + ref.current?.getBoundingClientRect().width/2 + 100)
        }        
    }, [show, width])

    return (
        <div ref={ref} style={{ transform: `translateX(${slide*direction}px)` }} className={cn(className, "transition-all ease-run duration-500")}>
            {children}
        </div>
    )
}