import createTransition from '../createTransition';

const testPatterns: [
  properties: Parameters<typeof createTransition>[0],
  options: Parameters<typeof createTransition>[1],
  transition: ReturnType<typeof createTransition>,
][] = [
  // optionsがundefinedのとき
  [['color'], undefined, 'color 300ms ease-in-out'],
  [
    ['background-color', 'font-size', 'display'],
    undefined,
    'background-color 300ms ease-in-out,font-size 300ms ease-in-out,display 300ms ease-in-out',
  ],
  // optionsがdurationのみのとき
  [['color'], { duration: 1000 }, 'color 1000ms ease-in-out'],
  [['color'], { duration: '0.5s' }, 'color 0.5s ease-in-out'],
  // durationにTRANSITION_DURATIONSのキーを指定したとき
  [['color'], { duration: 'standard' }, 'color 300ms ease-in-out'],
  [['color'], { duration: 'complex' }, 'color 375ms ease-in-out'],
  // optionsがeasingのみのとき
  [['color'], { easing: 'linear' }, 'color 300ms linear'],
  [['color'], { easing: 'steps(3,jump-start)' }, 'color 300ms steps(3,jump-start)'],
  // optionsにキーを指定した時
  [['color'], { easing: 'easeInOutQuint' }, 'color 300ms cubic-bezier(0.83, 0, 0.17, 1)'],
  [['color'], { easing: 'easeInOutBack' }, 'color 300ms cubic-bezier(0.68, -0.6, 0.32, 1.6)'],
  // optionsがdelayのみのとき
  [['color'], { delay: 1000 }, 'color 300ms ease-in-out 1000ms'],
  [['color'], { delay: '0.5s' }, 'color 300ms ease-in-out 0.5s'],
  // delayにTRANSITION_DURATIONSのキーを指定したとき
  [['color'], { delay: 'standard' }, 'color 300ms ease-in-out 300ms'],
  [['color'], { delay: 'complex' }, 'color 300ms ease-in-out 375ms'],
  // optionsに複数指定した時
  [['color'], { duration: 1000, easing: 'ease', delay: 1000 }, 'color 1000ms ease 1000ms'],
  [
    ['color', 'font-size'],
    { duration: 1000, easing: 'ease', delay: 1000 },
    'color 1000ms ease 1000ms,font-size 1000ms ease 1000ms',
  ],
];

describe('createTransition', () => {
  test.each(testPatterns)(
    'propertiesが%s、optionsが%jのとき、%sとなること',
    (properties, options, expected) => {
      expect(createTransition(properties, options)).toBe(expected);
    },
  );
});
