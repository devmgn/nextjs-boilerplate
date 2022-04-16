import { createGlobalStyle } from 'styled-components';
import { FONT_FAMILY } from '@/components/foundation/constants';

const GlobalStyle = createGlobalStyle`
  // ==========================================================================
  // Main root
  // ==========================================================================

  *:where(:not(iframe, canvas, img, svg, video):not(svg *, symbol *)) {
    all: unset;
    display: revert;
  }

  *,
  ::before,
  ::after {
    box-sizing: border-box;
    background-repeat: no-repeat;
  }

  ::before,
  ::after {
    text-decoration: inherit;
    vertical-align: inherit;
  }

  // 1. Remove the grey highlight on links in iOS
  // 2. Improving font rendering in macOS
  // 3. Prevent adjustments of font size after orientation changes in iOS
  :root {
    font-family: ${FONT_FAMILY.SANS_SERIF};
    line-height: 1;
    overflow-wrap: break-word;
    text-rendering: optimizespeed;
    -webkit-tap-highlight-color: transparent; // 1
    -webkit-font-smoothing: antialiased; // 2
    -moz-osx-font-smoothing: grayscale; // 2
    -webkit-text-size-adjust: 100%; // 3
  }

  // ==========================================================================
  // Text content
  // ==========================================================================

  ol,
  ul,
  menu {
    list-style: none;
  }

  pre {
    font-family: ${FONT_FAMILY.MONOSPACE};
  }

  // ==========================================================================
  // Inline text semantics
  // ==========================================================================

  a {
    cursor: revert;
  }

  code,
  kbd,
  samp {
    font-family: ${FONT_FAMILY.MONOSPACE};
  }

  q {
    &::before,
    &::after {
      content: unset;
    }
  }

  // ==========================================================================
  // Image and multimedia
  // ==========================================================================

  audio,
  img,
  video {
    vertical-align: middle;
  }

  // ==========================================================================
  // Embedded content
  // ==========================================================================

  iframe {
    vertical-align: middle;
  }

  // ==========================================================================
  // SVG and MathML
  // ==========================================================================

  // 1. Change the fill color to match the text color in all browsers
  svg {
    vertical-align: middle;
    &:not([fill]) {
      fill: currentcolor; // 1
    }
  }

  // ==========================================================================
  // Table content
  // ==========================================================================

  table {
    table-layout: fixed;
    border-collapse: collapse;
  }

  // ==========================================================================
  // Forms
  // ==========================================================================

  button,
  [type='button'],
  [type='submit'],
  [type='reset'] {
    &:not(:disabled) {
      cursor: pointer;
    }
  }

  textarea {
    white-space: revert;
  }

  label[for] {
    cursor: pointer;
  }

  ::placeholder {
    color: unset;
  }

  :where([hidden]) {
    display: none;
  }

  :where([contenteditable]) {
    -moz-user-modify: read-write;
    -webkit-user-modify: read-write;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
  }

  :where([draggable='true']) {
    -webkit-user-drag: element;
  }
`;

export default GlobalStyle;
