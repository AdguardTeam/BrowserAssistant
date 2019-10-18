const half = x => x / 2;

describe('half', () => {
    it('should return the value divided by 2', () => {
        expect(half(6))
            .toEqual(3);
    });
});
