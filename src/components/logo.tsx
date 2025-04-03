import darkLogo from "@/assets/logos/dark.svg";
import logo from "@/assets/logos/logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-12 max-w-[10.847rem]">
      <Image
        src={logo}
        width={30}
        height={30}
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
