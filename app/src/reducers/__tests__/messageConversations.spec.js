import messageReducer, { initialState } from '../messageReducer';
import actions from '../../constants/actions';

describe('message conversation reducer', () => {
    it('should return the default state', () => {
        const actualState = messageReducer(undefined, {});

        expect(actualState).toEqual(initialState);
    });
});
