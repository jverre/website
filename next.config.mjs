import createMDX from '@next/mdx'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

const configDir = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  turbopack: {
    root: configDir,
    rules: {
      '*.mdx': {
        loaders: [{
          loader: '@next/mdx/mdx-js-loader',
          options: {
            providerImportSource: 'next-mdx-import-source-file',
            remarkPlugins: [
              ['remark-frontmatter'],
              ['remark-mdx-frontmatter', { name: 'metadata' }],
              ['remark-gfm']
            ],
            rehypePlugins: [],
          },
        }],
        as: '*.tsx',
      },
    },
    resolveAlias: {
      'next-mdx-import-source-file': '@vercel/turbopack-next/mdx-import-source',
    },
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'metadata' }],
      remarkGfm
    ],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
