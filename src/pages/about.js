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
        <p className="postBody">{props.data.site.siteMetadata.summary}</p>
      </Layout>
      <SEO title="About" description="About KV" />
    </div>
  )
}

export const pageQuery = graphql`
  query AboutSummary {
    site {
      siteMetadata {
        summary
      }
    }
  }
`

export default About
