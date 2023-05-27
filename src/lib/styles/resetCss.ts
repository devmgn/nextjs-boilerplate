import { css } from '@emotion/react';

const FONT_FAMILY = {
  SANS_SERIF: 'system-ui, -apple-system, sans-serif',
  SERIF: 'serif',
  MONOSPACE: 'monospace, monospace',
} as const;

const resetCss = css`
  /**
  Main root
   */
  *:where(:not(html, iframe, canvas, img, svg, video, audio, svg *, symbol *)) {
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

  :where(:root) {
    font-family: ${FONT_FAMILY.SANS_SERIF};
    line-height: 1;
    overflow-wrap: break-word;
    text-rendering: optimizeSpeed;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-size-adjust: 100%;
  }

  /**
  Text content
   */
  :where(ol, ul, menu) {
    list-style-type: none;
  }

  :where(pre) {
    font-family: ${FONT_FAMILY.MONOSPACE};
  }

  /**
  Inline text semantics
   */
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

  /**
  Image and multimedia
   */
  :where(img) {
    max-inline-size: 100%;
    max-block-size: 100%;
  }

  :where(audio, img, video) {
    vertical-align: middle;
  }

  /**
  Embedded content
   */
  :where(iframe) {
    vertical-align: middle;
  }

  /**
  SVG and MathML
   */
  :where(svg) {
    vertical-align: middle;
    &:not([fill]) {
      fill: currentColor;
    }
  }

  /**
  Table content
   */
  :where(table) {
    table-layout: fixed;
    border-collapse: collapse;
  }

  /**
  Forms
   */
  :where(button, [type='button'], [type='submit'], [type='reset']) {
    &:not(:disabled) {
      cursor: pointer;
    }
  }

  :where(input, textarea) {
    -webkit-user-select: auto;
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

  /**
  Others
   */
  :where(:focus-visible) {
    outline: revert;
  }

  :where([hidden]) {
    display: none;
  }

  :where([contenteditable]:not([contenteditable='false'])) {
    -moz-user-modify: read-write;
    -webkit-user-modify: read-write;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    -webkit-user-select: auto;
  }

  :where([draggable='true']) {
    -webkit-user-drag: element;
  }

  /* stylelint-disable-next-line */
  :where(dialog:modal) {
    all: revert;
  }

  :where(
      a[href],
      area,
      button,
      input,
      label[for],
      select,
      summary,
      textarea,
      [tabindex]:not([tabindex*='-'])
    ) {
    touch-action: manipulation;
  }
`;

export default resetCss;
