import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const AllTagsTemplate = ({ data, pageContext, location }) => {
  // console.log(pageContext)
  // console.log(data)
  const { tags } = pageContext

  return (
    <div>
      <Layout location={location}>
        <div>
          <article>
            <header>
              <h1 className="postTitle">Tags</h1>
            </header>
            <p className="postBody">
              {tags.map((tag, index) => {
                return (
                  <Link className="navLink" key={index} to={`${tag}`}>
                    {tag}
                  </Link>
                )
              })}
            </p>
          </article>
        </div>
      </Layout>
      <SEO
        title={"Tags"}
        description={"All blog tags"}
      />
    </div>
  )
}

export default AllTagsTemplate
