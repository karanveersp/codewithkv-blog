import Typography from "typography"
import Irving from "typography-theme-irving"
import "../styles/global.css"

Irving.headerFontFamily = ["Ubuntu"]
Irving.googleFonts = [
  {
    name: 'Ubuntu',
    styles: [
      '500'
    ]
  }
]
// Styles that have to do with light/dark theme variables
Irving.overrideStyles = () => ({
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

const typography = new Typography(Irving)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export const rhythm = typography.rhythm
export const scale = typography.scale
export default typography
