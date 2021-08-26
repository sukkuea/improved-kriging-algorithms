const initialState = {
    name: 'JOHN',
    surname: 'DO',
    parent: {
        mother: {
            name: 'Marry'
        }
    },
    brother: [{ id: 1, name: 'tong' }, { id: 2, name: 'kratai' }]
}
//array

export default (state = initialState, action) => {

    switch (action.type) {
        default:
            return state
    }
}