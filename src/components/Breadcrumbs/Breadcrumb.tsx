import { UserRoleEnum } from "@/entities/User";
import { UserModel } from "@/models/UserModel";
import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
  isDisplayNav?: boolean;
}

const Breadcrumb = ({ pageName, isDisplayNav = true }: BreadcrumbProps) => {

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName}
      </h2>

      {isDisplayNav ?
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href={""}>
              My Courses /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
      : null}
    </div>
  );
};

export default Breadcrumb;
