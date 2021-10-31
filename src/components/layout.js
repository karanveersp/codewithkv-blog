import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import "../styles/global.css"
import { ThemeToggler } from "gatsby-plugin-dark-mode"
import ThemeIcon from "../../content/assets/themeIcon.svg"

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
        <Link className="navLink" to="/about">
            About
          </Link>
        <Link className="navLink" to="/projects">
            Projects
        </Link>
        <Link className="navLink" to="/tags">
          Tags
        </Link>

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
              <ThemeIcon />
            </button>
          )}
        </ThemeToggler>

      </div>
      <header style={{ margin: "auto" }}>{header}</header>
      <main>{children}</main>
      <br/>
      <br/>
      <hr></hr>
      <div className="center">
        <footer><small>© {author} {new Date().getFullYear()}. 
        Powered by&nbsp;
        <a href="http://gatsbyjs.org" target="_blank"
          rel="noreferrer">Gatsby.js</a></small></footer>
      </div>
    </div>
  )
}

export default Layout
