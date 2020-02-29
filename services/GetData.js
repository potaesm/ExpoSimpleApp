export const GetData = async (collection) => {
    const URL = `https://asia-east2-simplecloudfirestoreapi.cloudfunctions.net/api?collection=${collection}`;
    try {
        let dataArray = [];
        const response = await fetch(URL, { method: 'GET', headers: new Headers({ 'Content-Type': 'application/json' }) });
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
