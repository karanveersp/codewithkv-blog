import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import SEO from "../components/seo"
const About = props => {
  console.log(props)
  return (
    <div>
      <Layout location={props.location}>
        <h2 className="postTitle">About</h2>
        <p className="postBody">
          Hello and welcome to my blog!
          <br />
          My name is Karanveer, but you can call me KV.
          <br />
          I'm a developer enthusiastic about web, desktop and blockchains apps as well as functional programming.
          <br />
          This blog is my effort to explore, organize and share my ideas about code.
          <br />
          You can contact me using <a href="mailto: karanveer(at)codewithkv.com">
            karanveer(at)codewithkv.com
          </a>
          .
        </p>
        <div className="centerAndBotMargin">
          <a
            href={props.data.site.siteMetadata.social.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
          &nbsp;&bull;&nbsp;
          <a
            href={props.data.site.siteMetadata.social.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            instagram
          </a>
          &nbsp;&bull;&nbsp;
          <a
            href="https://wisdominart.com"
            target="_blank"
            rel="noreferrer"
          >
            art blog
          </a>
        </div>
      </Layout>
      <SEO title="About" description="About KV" />
    </div>
  )
}

export const pageQuery = graphql`
  query AboutSummary {
    site {
      siteMetadata {
        social {
          githubUrl,
          instagramUrl
        }
      }
    }
  }
`

export default About
