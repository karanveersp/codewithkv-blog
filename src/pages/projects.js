import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import SEO from "../components/seo"
const Projects = props => {
  console.log(props)
  return (
    <div>
      <Layout location={props.location}>
        <h2 className="postTitle">Projects</h2> <br />
        <p></p>
        <ul>
          <li>
            <div>
              <span>
                <a href="https://github.com/karanveersp/CypherFS">CypherFS</a>
              </span>
              <p>
                An F# CLI app to AES encrypt/decrypt text data.
                <br />
                Useful for storing passwords, and secrets, which can be backed
                up and shared securely.
              </p>
            </div>
          </li>

          <li>
            <div>
              <span>
                <a href="https://github.com/karanveersp/Capstone">
                  Cryptocurrency Price Forecaster
                </a>
              </span>
              <p>
                A desktop app to analyze and forecast cryptocurrency prices
                using machine learning.
                <br />
                Built with C#, ML.NET and Avalonia.
              </p>
            </div>
          </li>

          <li>
            <div>
              <span>
                <a href="https://github.com/karanveersp/simple-file-logger">
                  Simple File Logger
                </a>
              </span>
              <p>
                A Python library providing an easy to use class for logging to
                files with opinionated defaults that can be customized.
              </p>
            </div>
          </li>
        </ul>
        <div className="centerAndBotMargin">
          <a
            href={props.data.site.siteMetadata.social.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </div>
      </Layout>
      <SEO title="About" description="About KV" />
    </div>
  )
}

export const pageQuery = graphql`
  query Projects {
    site {
      siteMetadata {
        social {
          githubUrl
          instagramUrl
        }
      }
    }
  }
`

export default Projects
