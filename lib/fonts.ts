import localFont from 'next/font/local'

export const ppEditorialNew = localFont({
  src: [
    {
      path: '../node_modules/next/font/local/fonts/PPEditorialNew-Ultralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPEditorialNew-UltralightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPEditorialNew-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPEditorialNew-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPEditorialNew-Ultrabold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPEditorialNew-UltraboldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-pp-editorial-new',
  display: 'swap',
})

export const ppMori = localFont({
  src: [
    {
      path: '../node_modules/next/font/local/fonts/PPMori-Extralight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPMori-ExtralightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPMori-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPMori-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPMori-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../node_modules/next/font/local/fonts/PPMori-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-pp-mori',
  display: 'swap',
})
