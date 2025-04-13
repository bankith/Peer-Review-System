import { Course, CourseTermEnum } from "@/entities/Course";

export default class GroupedCourse {
    academicYear: string;
    term: CourseTermEnum;
    courses: Course[];

    constructor(academicYear: string, term: CourseTermEnum, courses: Course[]) {
        this.academicYear = academicYear;
        this.term = term;
        this.courses = courses;
    }

    getKey(): string {
        return `${this.academicYear}-${this.term}`;
    }
}
