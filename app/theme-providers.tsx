'use client'

import { ThemeProvider } from 'next-themes'
// import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import siteMetadata from '@/data/siteMetadata'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {/* <MUIThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}> */}
        {children}
      {/* </MUIThemeProvider> */}
    </ThemeProvider>
  )
}
