import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const SingleTagTemplate = ({ data, pageContext, location }) => {
  console.log(pageContext)
  const { posts, tag } = pageContext
  return (
      <div>
    <Layout location={location}>
      <div>
        <article>
          <header>
            <h1 className="postTitle">Posts about {tag}</h1>
          </header>
          <p className="postBody">
            <ul>
              {posts.map((post, index) => {
                return (
                  <li key={index}>
                    <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                  </li>
                )
              })}
            </ul>
          </p>
          <hr/>
        </article>
      </div>
    </Layout>
    <SEO
        title={`${tag} posts`}
        description={`All posts for ${tag}`}
      />
    </div>
  )
}

export default SingleTagTemplate
