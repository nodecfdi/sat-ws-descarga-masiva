import { Helpers } from '#src/internal/helpers';

describe('helpers', () => {
  test('no spaces contents', () => {
    const source = `
            <root>
                <foo a="1" b="2">foo</foo>

                <bar>
                    <baz>
                        BAZZ
                    </baz>
                </bar>
            </root>
        `;
    const expected = '<root><foo a="1" b="2">foo</foo><bar><baz>BAZZ</baz></bar></root>';
    expect(Helpers.nospaces(source)).toBe(expected);
  });
});
