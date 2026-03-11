import React, { ReactNode } from "react";
// import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import ReactQueryProvider from "../lib/providers/react-query-provider";
import { ThemeProvider } from "../components/theme-provider";


interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    // <SessionProvider>
      <ReactQueryProvider>
        <ThemeProvider  attribute="class" defaultTheme="dark" enableSystem={true} storageKey="theme-mode">
          <Toaster position="bottom-right" />
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
    // </SessionProvider>
  );
};

export default Providers;
