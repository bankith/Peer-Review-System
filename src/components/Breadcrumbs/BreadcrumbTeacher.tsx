import Link from "next/link";

interface BreadcrumbTeacherProps {
  pageMain: string;
  pageMainLink: string;
  pageName: string;
  subMainPage?: string;
  subMainPageLink?: string;
}

const BreadcrumbTeacher = ({
  pageMain,
  pageMainLink,
  pageName,
  subMainPage,
  subMainPageLink,
}: BreadcrumbTeacherProps) => {
  return (
    <nav className="flex mb-5" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li>
          <div className="flex items-center">
            {pageMainLink ? (
              <Link
                href={pageMainLink}
                className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
              >
                {pageMain}
              </Link>
            ) : (
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                {pageMain}
              </span>
            )}
          </div>
        </li>
        {subMainPage && (
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              {subMainPageLink ? (
                <Link
                  href={subMainPageLink}
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {subMainPage}
                </Link>
              ) : (
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                  {subMainPage}
                </span>
              )}
            </div>
          </li>
        )}
        <li aria-current="page">
          <div className="flex items-center">
            <svg
              className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
              {pageName}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default BreadcrumbTeacher;
