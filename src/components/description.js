/**
 * Description component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Description = () => {
  const data = useStaticQuery(graphql`
    query DescriptionQuery {
      site {
        siteMetadata {
          description
        }
      }
    }
  `)

  const { description } = data.site.siteMetadata
  return (
    <div className="description">
      <p>
        {description}
      </p>
    </div>
  )
}

export default Description
