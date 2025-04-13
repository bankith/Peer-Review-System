
import SigninWithOtp from "@/components/Auth/SigninWithOtp";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {


  return (
    <>
      
      <div className="flex flex-col gap-9">
          <SigninWithOtp />
      </div>

      
    </>
  );
}
