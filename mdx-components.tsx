import type { MDXComponents } from 'mdx/types'
import Digression from 'app/components/blog/Digression'
import References from 'app/components/blog/References'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Digression,
    References,
  }
}