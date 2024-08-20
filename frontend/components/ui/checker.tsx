"use client"

import { Checkbox } from "@/components/ui/checkbox"

type CheckerProps = {
    label: string,
    value : string, 
    name : string,
    onChange: (e: React.FormEvent<HTMLButtonElement>)=>void,
    
}

const Checker: React.FC<CheckerProps> = ({label, value, name, onChange}) => {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" onChange={(e)=>onChange(e)} value={value} /> 
            <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
        </div>
    )
}

export default Checker