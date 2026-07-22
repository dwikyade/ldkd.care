import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5FEF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#5B5FEF] text-white shadow-[0_12px_28px_-18px_rgba(91,95,239,0.8)] hover:-translate-y-0.5 hover:bg-[#494DDB] hover:shadow-[0_18px_34px_-20px_rgba(91,95,239,0.9)]",
        destructive: "bg-[#F43F5E] text-white shadow-[0_12px_28px_-18px_rgba(244,63,94,0.8)] hover:-translate-y-0.5 hover:bg-rose-600",
        outline: "border border-[#E8ECF3] bg-white text-[#172033] shadow-[0_10px_24px_-20px_rgba(23,32,51,0.45)] hover:-translate-y-0.5 hover:border-[#DCE2EF] hover:bg-[#F8FAFC] hover:text-[#5B5FEF]",
        secondary: "bg-[#38BDF8] text-white shadow-[0_12px_28px_-18px_rgba(56,189,248,0.8)] hover:-translate-y-0.5 hover:bg-sky-500",
        ghost: "text-[#667085] hover:bg-[#F3F7FC] hover:text-[#172033]",
        link: "text-[#5B5FEF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-[8px] px-3",
        lg: "h-[52px] min-h-[52px] rounded-xl px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
