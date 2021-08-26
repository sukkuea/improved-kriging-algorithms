export default (nodeRange = [], semiVariant = []) => {
    let result = []
    for (let i = 0; i < nodeRange.length; i++) {
        result = [
            ...result,
            [nodeRange[0][i], semiVariant[0][i]]
        ]
    }
    return result
}