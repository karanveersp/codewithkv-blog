const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createTagPages = (createPage, posts) => {
  const allTagsIndexTemplate = path.resolve('./src/templates/all-tags-index.js')
  const singleTagIndexTemplate = path.resolve('./src/templates/single-tag-index.js')
  const postsByTag = []

  posts.forEach(({node}) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!postsByTag[tag]) {
          // initialize tag with empty list
          postsByTag[tag] = []
        }
        postsByTag[tag].push(node)  // populate the list
      })
    }
  })
  const tags = Object.keys(postsByTag)

  // Create the all tags page passing it all
  // the tags
  createPage({
    path: "/tags",
    component: allTagsIndexTemplate,
    context: {
      tags: tags.sort()
    }
  })

  // Create /tags/tag page for each tag
  // passing in the posts for that tag
  tags.forEach(tag => {
    const posts = postsByTag[tag]
    createPage({
      path: `/tags/${tag}`,
      component: singleTagIndexTemplate,
      context: {
        posts,
        tag
      }
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC },
          filter: {frontmatter: { draft:{eq:false}}},
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.allMarkdownRemark.edges
  // Create tag pages.
  createTagPages(createPage, posts)
  
  // Create blog posts pages.
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
