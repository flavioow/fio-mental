// types/next-auth.d.ts
import { DefaultSession, NextAuth } from "next-auth"

declare module "next-auth" {
    // Torne role opcional aqui para não conflitar com o AdapterUser
    interface User {
        id?: string
        role?: string
    }

    interface Session {
        user: DefaultSession["user"] & {
            id?: string
            role?: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
    }
}
