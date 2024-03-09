interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}
export const Button = ({
    children,
    className,
    onClick,
    disabled,
}: ButtonProps) => {
    const buttonClasses = `${className} h-8 border-[1px] text-sm ${
        disabled && "opacity-50"
    }`;

    return (
        <button
            className={`${buttonClasses}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
