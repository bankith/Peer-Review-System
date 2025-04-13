// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from '@/entities/User';
import { InstructorProfile } from '@/entities/InstructorProfile';
import { StudentProfile } from '@/entities/StudentProfile';
import { StudentGroup } from '@/entities/StudentGroup';
import { Course } from '@/entities/Course';
import { Assignment } from '@/entities/Assignment';
import { AssignmentSubmission } from '@/entities/AssignmentSubmission';
import { PeerReview } from '@/entities/PeerReview';
import { PeerReviewSubmission } from '@/entities/PeerReviewSubmission';
import { PeerReviewComment } from '@/entities/PeerReviewComment';
import { AssignmentGrading } from '@/entities/AssignmentGrading';
import { PeerReviewGrading } from '@/entities/PeerReviewGrading';
import '@/envConfig.ts'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CourseEnrollment } from './entities/CourseEnrollment';
import { CourseInstructor } from './entities/CourseInstructor';
import { GroupMember } from './entities/GroupMember';
import { Otp } from './entities/Otp';

export const AppDataSource = new DataSource({
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": "PeerReviewSystem",
    "synchronize": true,
    "logging": false,
    namingStrategy: new SnakeNamingStrategy(),
    "entities": [      
      User,
      InstructorProfile,
      StudentProfile,
      Course,      
      CourseEnrollment,
      CourseInstructor,
      StudentGroup, 
      GroupMember,           
      Assignment,
      AssignmentSubmission,
      AssignmentGrading,
      PeerReview,
      PeerReviewSubmission,
      PeerReviewComment,
      PeerReviewGrading,
      Otp
      // "@/entities/*.ts"
    ]
  }
);

export async function initializeDataSource() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize().catch(err => console.error("Error during Data Source initialization", err));
    }
}
