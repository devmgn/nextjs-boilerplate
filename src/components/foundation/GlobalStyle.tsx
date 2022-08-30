import { createGlobalStyle } from 'styled-components';
import { FONT_FAMILY } from '@/components/foundation/constants';

const GlobalStyle = createGlobalStyle`
  // ==========================================================================
  // Main root
  // ==========================================================================

  *:where(:not(html, iframe, canvas, img, svg, video, svg *, symbol *)) {
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
  // Text content
  // ==========================================================================

  :where(ol, ul, menu) {
    list-style-type: none;
  }

  :where(pre) {
    font-family: ${FONT_FAMILY.MONOSPACE};
  }

  // ==========================================================================
  // Inline text semantics
  // ==========================================================================

  :where(a) {
    cursor: revert;
  }

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

  :where(button, [type="button"], [type="submit"], [type="reset"]) {
    &:not(:disabled) {
      cursor: pointer;
    }
  }

  :where(textarea) {
    white-space: revert;
    resize: vertical;
  }

  :where(label[for]) {
    cursor: pointer;
  }

  ::placeholder {
    color: unset;
  }

  // ==========================================================================
  // Others
  // ==========================================================================

  :where([hidden]) {
    display: none;
  }

  :where([contenteditable]) {
    -moz-user-modify: read-write;
    -webkit-user-modify: read-write;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
  }

  :where([draggable="true"]) {
    -webkit-user-drag: element;
  }

  :where([tabindex]:not([tabindex*="-"])) {
    cursor: pointer;
  }

  :where(a[href], area, button, input, label[for], select, summary, textarea, [tabindex]:not([tabindex*="-"])) {
    touch-action: manipulation;
  }
`;

export default GlobalStyle;
