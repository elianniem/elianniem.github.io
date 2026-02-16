function getCounterValue() {
  const counterSpan = document.getElementById("counter");
  return parseInt(counterSpan.textContent, 10) || 0;
}

function setCounterValue(value) {
  document.getElementById("counter").textContent = value;
}

function tickUp() {
  const current = getCounterValue();
  setCounterValue(current + 1);
}

function tickDown() {
  const current = getCounterValue();
  setCounterValue(current - 1);
}

function runForLoop() {
  const n = getCounterValue();
  const out = [];

  for (let i = 0; i <= n; i++) {
    out.push(i);
  }

  document.getElementById("forLoopResult").textContent = out.join(" ");
}

function showOddNumbers() {
  const n = getCounterValue();
  const out = [];

  for (let i = 1; i <= n; i++) {
    if (i % 2 === 1) out.push(i);
  }

  document.getElementById("oddNumberResult").textContent = out.join(" ");
}

function addMultiplesToArray() {
  const n = getCounterValue();
  const arr = [];

  for (let i = Math.floor(n / 5) * 5; i >= 5; i -= 5) {
    arr.push(i);
  }

  console.log(arr);
}

function printCarObject() {
  const car = {
    cType: document.getElementById("carType").value,
    cMPG: document.getElementById("carMPG").value,
    cColor: document.getElementById("carColor").value,
  };

  console.log(car);
}

function loadCar(which) {
  let carObj;

  if (which === 1) carObj = carObject1;
  else if (which === 2) carObj = carObject2;
  else if (which === 3) carObj = carObject3;
  else return;

  document.getElementById("carType").value = carObj.cType;
  document.getElementById("carMPG").value = carObj.cMPG;
  document.getElementById("carColor").value = carObj.cColor;
}

function changeColor(which) {
  const p = document.getElementById("styleParagraph");

  if (which === 1) p.style.color = "red";
  else if (which === 2) p.style.color = "green";
  else if (which === 3) p.style.color = "blue";
}
