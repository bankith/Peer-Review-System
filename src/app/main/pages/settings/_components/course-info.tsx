import {
  CallIcon,
  EmailIcon,
  PencilSquareIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Course, CourseTermEnum } from "@/entities/Course";
import { UserRoleEnum } from "@/entities/User";
import { UserModel } from "@/models/UserModel";
import Image from "next/image";
import Link from "next/link";

interface CourseInfoProps {
  course: Course;
}

export function CourseInfoForm({course}: CourseInfoProps) {

  var page = "";
  if(UserModel.instance.role == UserRoleEnum.instructor){
    page = "/main-teacher";
  }else if(UserModel.instance.role == UserRoleEnum.student){
    page = "/main-student";
  }

  return (
    
    <div className="rounded-[10px] p-4 mr-4 border border-stroke inline-block hover:shadow-2">
      <form>
        <Link href={page + "/course/" + course.id + "/peer-review-summary"}>
          <div className="mb-5.5 flex gap-5.5">
            <div className="flex-col">
              <Image
              src={"/images/course/c1.jpg"}            
              className="rounded-lg mb-4"
              width={250}
              height={30}
              quality={100}              
              alt={course.courseName}
            />
          
            <p className="text-xs">
              <b>
                {course.courseName}                  
              </b>
            </p>
            </div>
        </div>
        </Link>
      </form>    
    </div>
  );
}
