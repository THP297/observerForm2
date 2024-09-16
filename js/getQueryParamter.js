
let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let urlParamSup = params.get('sup');
let urlParamUsername= params.get('username');


console.log(urlParamSup)