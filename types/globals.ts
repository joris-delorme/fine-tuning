import { LucideProps } from "lucide-react"
import dynamicIconImports from 'lucide-react/dynamicIconImports';

export interface IconProps extends LucideProps {
    name: keyof typeof dynamicIconImports
}

export interface IFeature {
    name: string
    icon: keyof typeof dynamicIconImports
    link: string
}

export declare type ISteps = 'home' | 'dataset' | 'fine-tuning' | 'end'

export interface IMessages {
    messages: {
      role: 'assistant' | 'user' | 'system',
      content: string
    }[]
}