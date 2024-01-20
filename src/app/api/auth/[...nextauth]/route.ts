export const runtime = "edge";
import NextAuth from 'next-auth';
import { options } from '@/app/options';

const handler = NextAuth(options);
export const GET = handler.handlers.GET;
export const POST = handler.handlers.POST;
