import React from "react"
import { Link, graphql } from "gatsby"

import Description from "../components/description"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Layout location={location}>
      <SEO title="All posts" />
      <Description />
      <br/>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
             
              <ul style={{margin: 0}}>
                <li style={{ display: "inline", marginRight: "1rem"}}>
                <small>{node.frontmatter.date}</small>
                </li>
              {node.frontmatter.tags?.map(tag => {
                return (
                  <li key={tag} style={{ display: "inline", marginRight: "1rem"}}>
                  <small>
                  <Link to={"/tags/" + tag}>
                    {tag}
                  </Link>
                  </small>
                  </li>
                )
              })}
              </ul>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
