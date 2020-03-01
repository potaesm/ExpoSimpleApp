export const DeleteData = async (collection, id) => {
    const URL = `https://asia-east2-simplecloudfirestoreapi.cloudfunctions.net/api?collection=${collection}&id=${id}`;
    try {
        let dataArray = [];
        const response = await fetch(URL, { method: 'DELETE', headers: new Headers({ 'Content-Type': 'application/json' }) });
        const responseJson = await response.json();
        for (const item of responseJson) {
            await dataArray.push(item);
        }
        return dataArray;
    }
    catch (Error) {
        console.log(Error);
    }
}
