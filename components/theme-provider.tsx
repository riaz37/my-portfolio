'use client';

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      theme={{
        container: {
          center: true,
          padding: "2rem",
          screens: {
            "2xl": "1400px",
          },
        },
        extend: {
          colors: {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            primary: {
              DEFAULT: "hsl(var(--primary))",
              foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
              DEFAULT: "hsl(var(--secondary))",
              foreground: "hsl(var(--secondary-foreground))",
            },
            destructive: {
              DEFAULT: "hsl(var(--destructive))",
              foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
              DEFAULT: "hsl(var(--muted))",
              foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
              DEFAULT: "hsl(var(--accent))",
              foreground: "hsl(var(--accent-foreground))",
            },
            card: {
              DEFAULT: "hsl(var(--card))",
              foreground: "hsl(var(--card-foreground))",
            },
          },
          borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
          },
          keyframes: {
            "accordion-down": {
              from: { height: "0" },
              to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
              from: { height: "var(--radix-accordion-content-height)" },
              to: { height: "0" },
            },
          },
          animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
          },
        },
      }}
      {...props}
    >
      <style jsx global>{`
        :root {
          /* Base colors */
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;

          /* Card and popover */
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 222.2 84% 4.9%;

          /* Primary - Vibrant purple */
          --primary: 266 100% 50%;
          --primary-foreground: 210 40% 98%;

          /* Secondary - Soft gray */
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;

          /* Muted - Subtle gray */
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;

          /* Accent - Soft purple */
          --accent: 266 100% 96%;
          --accent-foreground: 266 100% 40%;

          /* Destructive - Warning red */
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;

          /* Borders and inputs */
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 266 100% 50%;

          /* Radii */
          --radius: 0.5rem;
        }

        .dark {
          /* Base colors */
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;

          /* Card and popover */
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;

          /* Primary - Vibrant purple */
          --primary: 266 100% 60%;
          --primary-foreground: 210 40% 98%;

          /* Secondary - Dark gray */
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;

          /* Muted - Dark gray */
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;

          /* Accent - Deep purple */
          --accent: 266 100% 30%;
          --accent-foreground: 210 40% 98%;

          /* Destructive - Dark red */
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;

          /* Borders and inputs */
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 266 100% 60%;
        }
      `}</style>
      {children}
    </NextThemesProvider>
  );
}
