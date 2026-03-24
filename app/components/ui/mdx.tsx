import Link from 'next/link'
import Image from 'next/image'
import { highlight } from 'sugar-high'
import React from 'react'
import Digression from '../blog/Digression'
import References from '../blog/References'
import Collapsible from './Collapsible'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return (
    <figure className="article-figure">
      <div className="article-figure-frame">
        <Image alt={props.alt} className="article-figure-image" {...props} />
      </div>
      {props.alt ? <figcaption className="article-figure-caption">{props.alt}</figcaption> : null}
    </figure>
  )
}

function MarkdownImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const rawAlt = props.alt || ''
  const cleanedAlt = rawAlt.replace(/\s*::wide\s*$/i, '').trim()
  const rawTitle = typeof props.title === 'string' ? props.title.trim().toLowerCase() : ''
  const isWide = rawTitle === 'wide' || /::wide\s*$/i.test(rawAlt)

  return (
    <figure className={`article-figure ${isWide ? 'article-figure-wide' : ''}`}>
      <div className="article-figure-frame">
        <img
          {...props}
          alt={cleanedAlt}
          className="article-figure-image"
        />
      </div>
      {cleanedAlt ? <figcaption className="article-figure-caption">{cleanedAlt}</figcaption> : null}
    </figure>
  )
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number) {
  return function Heading({ children }: { children: React.ReactNode }) {
    const text = typeof children === 'string' ? children : ''
    const id = slugify(text)
    
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    
    return (
      <Tag id={id}>
        {children}
      </Tag>
    )
  }
}

function hasBlockElement(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child as React.ReactElement).type === MarkdownImage
  )
}

function Paragraph(props: React.HTMLAttributes<HTMLParagraphElement>) {
  if (hasBlockElement(props.children)) {
    return <div className="mdx-p" {...props} />
  }
  return <p {...props} />
}

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: MarkdownImage,
  p: Paragraph,
  a: CustomLink,
  code: Code,
  Table,
  Digression,
  References,
  Collapsible,
}
