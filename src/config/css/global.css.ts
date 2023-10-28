import { globalStyle } from '@vanilla-extract/css';
import { theme } from './theme.css';

/**
 * Main root
 */
globalStyle(
  '*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *))',
  {
    all: 'unset',
    display: 'revert',
  },
);

globalStyle('*,::before,::after', {
  boxSizing: 'border-box',
  backgroundRepeat: 'no-repeat',
});

globalStyle(':where(:root)', {
  fontFamily: theme.font.family.sansSerif,
  lineHeight: 1,
  overflowWrap: 'break-word',
  textRendering: 'optimizeSpeed',
  WebkitTapHighlightColor: 'transparent',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textSizeAdjust: '100%',
});

/**
 * Text content
 */
globalStyle(':where(ol, ul, menu)', {
  listStyleType: 'none',
});

globalStyle(':where(pre)', {
  fontFamily: theme.font.family.monospace,
});

/**
 * Inline text semantics
 */
globalStyle(':where(a)', {
  cursor: 'revert',
});

globalStyle(':where(code, kbd, samp)', {
  fontFamily: theme.font.family.monospace,
});

globalStyle(':where(q)::before, :where(q)::after', {
  content: 'unset',
});

/**
 * Image and multimedia
 */
globalStyle(':where(audio, img, video)', {
  verticalAlign: 'middle',
  maxInlineSize: '100%',
  maxBlockSize: '100%',
});

/**
 * Embedded content
 */
globalStyle(':where(iframe)', {
  verticalAlign: 'middle',
});

/**
 * SVG and MathML
 */
globalStyle(':where(svg)', {
  verticalAlign: 'middle',
});

globalStyle(':where(svg:not([fill]))', {
  fill: 'currentColor',
});

/**
 * Table content
 */
globalStyle(':where(table)', {
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
});

/**
 * Forms
 */
globalStyle(
  ':where(button, [type="button"], [type="submit"], [type="reset"], [tabindex]:not([tabindex*="-"])):not(:disabled)',
  {
    cursor: 'pointer',
  },
);

globalStyle(':where([tabindex*="-"])', {
  cursor: 'default',
});

globalStyle(':where(input, textarea)', {
  WebkitUserSelect: 'auto',
});

globalStyle(':where(textarea)', {
  whiteSpace: 'revert',
  resize: 'vertical',
});

globalStyle('::placeholder', {
  color: 'unset',
});

/**
 * Others
 */
globalStyle(':where(:focus-visible)', {
  outline: 'revert',
});

globalStyle(':where([hidden])', {
  display: 'none',
});

globalStyle(':where([contenteditable]:not([contenteditable="false"]))', {
  MozUserModify: 'read-write',
  WebkitUserModify: 'read-write',
  overflowWrap: 'break-word',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  WebkitLineBreak: 'after-white-space',
  WebkitUserSelect: 'auto',
});

globalStyle(':where([draggable="true"])', {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  WebkitUserDrag: 'element',
});

globalStyle('dialog::backdrop', {
  all: 'unset',
});

globalStyle(
  ':where(a[href], area, button, input, label[for], select, summary, textarea, [tabindex]:not([tabindex*="-"]))',
  {
    touchAction: 'manipulation',
  },
);
