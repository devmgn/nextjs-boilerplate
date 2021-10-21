import * as styled from 'styled-components';
import { FONT_FAMILY, MIN_DEVICE_WIDTH } from './constants';

const GlobalStyle = styled.createGlobalStyle`
  // ==========================================================================
  // Main root
  // ==========================================================================

  *:where(:not(iframe, canvas, img, svg, video):not(svg *)) {
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
  :where(:root) {
    font-family: ${FONT_FAMILY.SANS_SERIF};
    line-height: 1;
    overflow-wrap: break-word;
    text-rendering: optimizeSpeed;
    -webkit-tap-highlight-color: transparent; // 1
    -webkit-font-smoothing: antialiased; // 2
    -moz-osx-font-smoothing: grayscale; // 2
    -webkit-text-size-adjust: 100%; // 3
  }

  // ==========================================================================
  // Sectioning root
  // ==========================================================================

  :where(body) {
    min-width: ${MIN_DEVICE_WIDTH};
  }

  // ==========================================================================
  // Text content
  // ==========================================================================

  :where(ol, ul) {
    list-style-type: none;
  }

  :where(pre) {
    font-family: ${FONT_FAMILY.MONOSPACE};
  }

  // ==========================================================================
  // Inline text semantics
  // ==========================================================================

  :where(code, kbd, samp) {
    font-family: ${FONT_FAMILY.MONOSPACE};
  }

  :where(q) {
    &::before,
    &::after {
      content: unset;
    }
  }

  // ==========================================================================
  // Image and multimedia
  // ==========================================================================

  :where(audio, img, video) {
    vertical-align: middle;
  }

  // ==========================================================================
  // Embedded content
  // ==========================================================================

  :where(iframe) {
    vertical-align: middle;
  }

  // ==========================================================================
  // SVG and MathML
  // ==========================================================================

  // 1. Change the fill color to match the text color in all browsers
  :where(svg) {
    vertical-align: middle;
    &:not([fill]) {
      fill: currentColor; // 1
    }
  }

  // ==========================================================================
  // Table content
  // ==========================================================================

  :where(table) {
    table-layout: fixed;
    border-collapse: collapse;
  }

  // ==========================================================================
  // Forms
  // ==========================================================================

  :where(button, [type='button'], [type='submit'], [type='reset']) {
    &:not(:disabled) {
      cursor: pointer;
    }
  }

  :where(input, textarea) {
    &::placeholder {
      color: unset;
    }
  }

  :where(textarea) {
    white-space: revert;
  }

  :where(label[for]) {
    cursor: pointer;
  }
`;

export default GlobalStyle;
