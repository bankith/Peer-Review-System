import { cn } from "@/lib/utils";
import { useId } from "react";

type PropsType = {
  variant?: "dot" | "circle";
  label: string;
  label2?: string;
  name?: string;
  value?: string;
  minimal?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TeacherRadioInput({
  label,
  label2,
  variant = "dot",
  name,
  value,
  minimal,
  checked,
  disabled,
  onChange,
}: PropsType) {
  const id = useId();

  return (
    <div className="mt-2">
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white",
          disabled && "cursor-not-allowed opacity-50" // เพิ่มสไตล์เมื่อ disabled
        )}
      >
        <div className="relative">
          <input
            type="radio"
            name={name}
            id={id}
            className="peer sr-only"
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded-full border peer-checked:[&>*]:block",
              {
                "peer-checked:border-6": variant === "circle",
                "border-dark-5 peer-checked:bg-gray-3 dark:border-dark-6 dark:peer-checked:bg-dark-2":
                  variant === "dot",
                "border-gray-500 dark:border-dark-4": disabled, // เปลี่ยนสีเมื่อ disabled
              },
              minimal && "border-stroke dark:border-dark-3"
            )}
          >
            <span
              className={cn(
                "hidden size-2.5 rounded-full bg-primary",
                variant === "circle" && "bg-transparent",
                disabled && "bg-gray-500 dark:bg-dark-4" // เปลี่ยนสีของจุดเมื่อ disabled
              )}
            />
          </div>
        </div>
        <span>{label}</span>
        <span className="text-xs text-gray-500 ml-2">{label2}</span>
      </label>
    </div>
  );
}
