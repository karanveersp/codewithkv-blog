import Typography from "typography"
import Parnassus from "typography-theme-parnassus"
import "../styles/global.css"

Parnassus.headerFontFamily = ["Ubuntu"]
Parnassus.bodyFontFamily = ["Rubik"]
Parnassus.baseFontSize = "18px"
Parnassus.googleFonts = [
  {
    name: 'Ubuntu',
    styles: [
      '500'
    ]
  },
  {
    "name": "Rubik",
    styles: [
      '400'
    ]
  }
]
// Styles that have to do with light/dark theme variables
Parnassus.overrideStyles = () => ({
  hr: {
    background: "var(--hr)",
  },
  a: {
    color: "var(--textLink)",
  },
  "h1,h2,h3": {
    color: "var(--textTitle)",
  },
  blockquote: {
    borderColor: "var(--textNormal)",
    borderLeft: "3px solid var(--textNormal)",
    paddingLeft: "15px"
  },
})

const typography = new Typography(Parnassus)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export const rhythm = typography.rhythm
export const scale = typography.scale
export default typography
