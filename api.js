module.exports = async function call() {
    const response = await fetch('https://node1.gpplugins.com:2083/api/guild/member/416924727224041473', {
        method: 'GET',
    });
    //const myJson = await response.json();
    const text = await response.text();

    //console.log(myJson);
    return text;
}