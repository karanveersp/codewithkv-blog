import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import SEO from "../components/seo"
const Projects = props => {
  console.log(props)
  return (
    <div>
      <Layout location={props.location}>
        <h2 className="postTitle">Projects</h2> <br/>
        <ul>
          <li>
            <div>
              <span><a href="https://github.com/karanveersp/CSEncryption">Cypher CLI</a></span>
              <p>
                A .NET Core CLI app to AES encrypt/decrypt plain text strings or files. <br/>
                Useful for storing secrets to share securely.
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
