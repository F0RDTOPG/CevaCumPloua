function loadJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', 'myjson.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}
const inputbox = document.querySelector('input');

loadJSON(function (data) {
  

  inputbox.addEventListener('input', function (e) {
    let result = [];
    let input = inputbox.value;

    if (typeof data === 'object' && data !== null) {
      result = Object.values(data).flatMap((cities) =>
        cities.filter((city) =>
          city.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      console.error('Data is not an object:', data);
    }
    console.log(result);
    display(result);
  });
});
  
const resultbox = document.querySelector('.result-box');

function display(result) {
  const limitedResult = result.slice(0, 5);

  const content = limitedResult.map((item) => {
    return `<li onclick=selectInput(this) >${item}</li>`;
  });

  resultbox.innerHTML = `<ul>${content.join('')}</ul>`;
}
function selectInput(list) {
  const resultList = list.querySelectorAll('li');
  const resultArray = Array.from(resultList).map((li) => li.textContent);
  display(resultArray);
  inputbox.value = list.textContent; 
}
  