import { CheckIcon, XIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId } from "react";

type PropsType = {
  withIcon?: "check" | "x";
  withBg?: boolean;
  label: string;
  name?: string;
  minimal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  radius?: "default" | "md";
  value?: string | number;
  checked?: boolean; // เพิ่ม checked
};

export function CheckboxTeacher({
  withIcon,
  label,
  name,
  withBg,
  minimal,
  onChange,
  radius,
  value,
  checked, // destructure checked
}: PropsType) {
  const id = useId();

  return (
    <div className="mt-2">
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none items-center",
          !minimal && "text-body-sm font-medium"
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            onChange={onChange}
            name={name}
            id={id}
            value={value}
            checked={checked} // ใช้ checked ที่ส่งมาจาก props
            className="peer sr-only"
          />

          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded border border-dark-5 peer-checked:border-primary dark:border-dark-6 peer-checked:[&>*]:block",
              withBg
                ? "peer-checked:bg-primary [&>*]:text-white"
                : "peer-checked:bg-gray-2 dark:peer-checked:bg-transparent",
              minimal && "mr-3 border-stroke dark:border-dark-3",
              radius === "md" && "rounded-md"
            )}
          >
            {!withIcon && (
              <span className="hidden size-2.5 rounded-sm bg-primary" />
            )}

            {withIcon === "check" && (
              <CheckIcon className="hidden text-primary" />
            )}

            {withIcon === "x" && <XIcon className="hidden text-primary" />}
          </div>
        </div>
        <span className="text-dark">{label}</span>
      </label>
    </div>
  );
}
