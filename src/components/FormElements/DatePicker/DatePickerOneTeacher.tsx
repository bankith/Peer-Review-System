"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";

type PropsType = {
  title?: string;
  value?: Date | null;
  onChange?: (date: Date) => void;
};

const DatePickerOneTeacher = ({ title, value, onChange }: PropsType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Init flatpickr
    flatpickr(inputRef.current!, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j, Y",
      defaultDate: value || undefined, // ใช้ค่า value เป็นค่าเริ่มต้น
      onChange: (selectedDates) => {
        if (onChange && selectedDates.length > 0) {
          onChange(selectedDates[0]); // ส่งค่าที่เลือกกลับไปยัง parent component
        }
      },
    });
  }, [value, onChange]);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {title}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="mm/dd/yyyy"
          data-class="flatpickr-right"
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOneTeacher;
