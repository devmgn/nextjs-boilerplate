import createShouldForwardProp from '../createShouldForwardProp';

describe('createShouldForwardProp', () => {
  describe('propが定義されている属性値', () => {
    test('propがcolor、forwardPropが異なる値のとき、trueとなること', () => {
      expect(createShouldForwardProp('width')('color')).toBe(true);
      expect(createShouldForwardProp('onmouseup')('accentHeight')).toBe(true);
    });

    test('propがcolor、forwardPropが同じ値のとき、falseとなること', () => {
      expect(createShouldForwardProp('color')('color')).toBe(false);
      expect(createShouldForwardProp(['accentHeight', 'writingMode'])('accentHeight')).toBe(false);
    });
  });

  describe('propが定義されていない属性値', () => {
    test('propがcolor、forwardPropが異なる値のとき、falseとなること', () => {
      expect(createShouldForwardProp('customProp')('customAttribute')).toBe(false);
      expect(createShouldForwardProp(['customProp'])('customAttribute')).toBe(false);
    });

    test('propがcolor、forwardPropが同じ値のとき、falseとなること', () => {
      expect(createShouldForwardProp('customAttribute')('customAttribute')).toBe(false);
      expect(
        createShouldForwardProp(['customAttribute', 'customAttribute2'])('customAttribute')
      ).toBe(false);
    });
  });
});
