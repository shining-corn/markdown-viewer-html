# Markdown Viewer HTML

## Example

https://shining-corn.github.io/markdown-viewer-html/

## Quick Start Guide

1. Put [index.html](./dist/index.html) and [mdvh.js](./dist/mdvh.js) on your web server.
2. Create `index.md` and put it on your web server.
3. Access `index.html` with a browser.

## Markdown Format

see [markdown-it](https://github.com/markdown-it/markdown-it)

## Extended Format
### Table of Contents

- example
  
  ```
  [[toc]]
  ```

### alerts

see [markdown-it-alerts](https://github.com/nunof07/markdown-it-alerts#readme)

- example
  
  ```
  ::: warning
  Hello world! [Link](#).
  :::
  ```

### footnote

see [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)

- example

  ```
  Here is a footnote reference,[^1] and another.[^longnote]

  [^1]: Here is the footnote.
  
  [^longnote]: Here's one with multiple blocks.
  
      Subsequent paragraphs are indented to show that they
  belong to the previous footnote.
  ```

### mermaid

see [mermaid.js](https://mermaid-js.github.io/mermaid/#/)

- example

  ````
  ```mermaid
  graph LR
      A-->B;
      B-->C1;
      B-->C2;
      C1-->D;
      C2-->D;
  ```
  ````

### math

see [markdown-it-math](https://github.com/runarberg/markdown-it-math)

- example
  
  ```
  $$$
  P(A | B) = (P(B | A)P(A)) / P(B)
  $$$
  ```

### video

see [markdown-it-block-embed](https://github.com/rotorz/markdown-it-block-embed)

- example
  
  ```
  @[youtube](lJIrF4YjHfQ)
  ```

## Dependencies

- markdown-it
- markdown-it-anchor
- markdown-it-table-of-contents
- markdown-it-footnote
- md-it-mermaid
- mermaid
- [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)
- markdown-it-alerts
- bootstrap
- markdown-it-math
- markdown-it-block-embed

# How to Build

```sh
npm install
npm run build
```

## License

MIT License
