import type { MDXComponents } from 'mdx/types'
import Digression from 'app/components/blog/Digression'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Digression,
  }
}