import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Discord from 'next-auth/providers/discord';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { getIpDetails } from '@feature/visitor/lib/actions/ipapi';

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [

    CredentialsProvider({
      name: 'Visitor',
      credentials: {
        ip: { label: 'IP address', type: 'text' },
      },
      async authorize(credentials) {
        // TODO: verify credentials against your user store and return a User, or null
        return null;
      },
    }),
  ],
});
