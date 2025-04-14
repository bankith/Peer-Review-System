import jwt from 'jsonwebtoken';
import "@/envConfig"
import { User } from '@/entities/User';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers'
import { UserDto } from '@/dtos/User/UserDto';

export function verifyToken(auth: string) {
    try {        
        const token = auth.split(' ')[1]; // Assumes "Bearer [token]"
        if (!token) return null;        
        var user = jwt.verify(token, process.env.JWT_SECRET!) as UserDto        
        if(!user.isPassOTP){
            return null;
        }
        return user;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

export function verifyTokenForOTP(auth: string) {
    try {        
        const token = auth.split(' ')[1]; // Assumes "Bearer [token]"
        if (!token) return null;        
        return jwt.verify(token, process.env.JWT_SECRET!) as UserDto;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}
