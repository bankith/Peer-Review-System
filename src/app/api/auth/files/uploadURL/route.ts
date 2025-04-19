import { NextRequest, NextResponse } from "next/server";
import { ResponseFactory } from "@/utils/ResponseFactory";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { headers } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetUploadURLDto } from "@/dtos/Files/GetUploadURLDto";
import { UploadURLDto } from "@/dtos/Files/UploadURLDto";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const authorization = (await headers()).get('authorization')      
    var jwt = verifyToken(authorization!);
    if(jwt == null){
      return NextResponse.json(ResponseFactory.error("Unauthorize access", 'Unauthorize'), {status: 401});
    }

    const body = await req.json();
    const dto = plainToInstance(GetUploadURLDto, body);  

    const errors = await validate(dto);
    if (errors.length > 0) {
        return NextResponse.json(ResponseFactory.error(errors.toString(), 'fail'), {status: 400});
    }    

    const ext = path.extname(dto.fileName);
    const newFileName = `${uuidv4()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: newFileName,
      ContentType: dto.fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    var res = new UploadURLDto();
    res.uploadUrl = signedUrl;
    res.finalFileUrl = "https://peerr-review-system-chula.s3.ap-southeast-7.amazonaws.com/" + newFileName;

    return NextResponse.json(ResponseFactory.success(res),{status: 201 });
    
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return NextResponse.json(
        ResponseFactory.error(error.message, "INTERNAL_ERROR"),
        { status: 500 }
      );
    }
    console.error("Unknown Error:", error);
    return NextResponse.json(
      ResponseFactory.error("An unexpected error occurred", "UNKNOWN_ERROR"),
      { status: 500 }
    );
  }
}
