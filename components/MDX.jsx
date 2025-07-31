import React from 'react'
import TopNav from './TopNav'
import Markdown from 'markdown-to-jsx'

export default function MDX(props) {
  
  const {text} = props;
  const md = `# This is a header 1
## This is a header 

hello world


[click me](https://google.com)`
  return (
    <section className='mdx-container'>
      <TopNav {...props}/>
      <article>
      <Markdown> 
        {text || 'Hop in the editor to start your journey'}
      </Markdown>
      </article>
    </section>
  )
}
