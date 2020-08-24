import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import "../styles/global.css"
import { ThemeToggler } from "gatsby-plugin-dark-mode"

const Layout = ({ location, children }) => {

  const data = useStaticQuery(graphql`
    query AuthorUrlsQuery {
      site {
        siteMetadata {
          title,
          author,
          social {
            githubUrl,
            instagramUrl
          }
        }
      }
    }
  `)
  const { author, title } = data.site.siteMetadata

  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.0),
          marginTop: 0,
          color: "var(--textTitle)",
        }}
      >
        <Link to={`/`}>{title}</Link>
      </h1>
    )
  } else {
    header = (
      <h3>
        <Link to={`/`}>{title}</Link>
      </h3>
    )
  }
  return (

    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(30),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        backgroundColor: "var(--bg)",
        color: "var(--textNormal)",
      }}
    >
      <div style={{ float: "right" }}>
        <ThemeToggler>
          {({ theme, toggleTheme }) => (
            <button className="themeToggler"
              // role="button"
              // styling="link"
              style={{ cursor: "pointer", fontSize: rhythm(1.0) }}
              onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
              onKeyDown={() => toggleTheme(theme === "dark" ? "light" : "dark")}
              tabIndex={0}
            >
              &#9728;
            </button>
          )}
        </ThemeToggler>
      </div>
      <header style={{ margin: "auto" }}>{header}</header>
      <main>{children}</main>
      <hr></hr>
      <div className="center">
        <footer>© {author} {new Date().getFullYear()}</footer>
      </div>
    </div>
  )
}

export default Layout
