"use strict";

const controlPanel = document.querySelector(".control-panel");

const pump01 = document.querySelector(".pump-ga-01");
const pump02 = document.querySelector(".pump-ga-02");
const pump03 = document.querySelector(".pump-ga-03");
const solenoid = document.querySelector(".sov");

const pipeOuter = document.querySelectorAll(".pipe-outer");
const pipe01 = document.querySelectorAll(".pipe-ga-01");
const pipe02 = document.querySelectorAll(".pipe-ga-02");
const pipe03 = document.querySelectorAll(".pipe-ga-03");

const pump01Toggle = document.querySelector(".pump1-toggle");
const pump02Toggle = document.querySelector(".pump2-toggle");
const pump03Toggle = document.querySelector(".pump3-toggle");
const sovToggle = document.querySelector(".sov-toggle");

const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const btn3 = document.querySelector(".btn3");
const btnSov = document.querySelector(".btn-sov");

let pump1Status = 0;
let pump2Status = 0;
let pump3Status = 0;
let sovStatus = 0;

const pumpStart = function (pump, pumpToggle, pipe) {
  // Control panel toggle
  pumpToggle.querySelector(".toggle-off").classList.remove("visible");
  pumpToggle.querySelector(".toggle-on").classList.add("visible");

  // SCADA pump ON
  const pumpElements = pump.querySelectorAll(".pump");
  pumpElements.forEach((el) => {
    el.classList.remove("stop");
  });

  // Pipe start
  pipe.forEach((el) => {
    el.classList.remove("pipe-stop");
  });
};

const pumpStop = function (pump, pumpToggle, pipe) {
  // Control panel toggle
  pumpToggle.querySelector(".toggle-off").classList.add("visible");
  pumpToggle.querySelector(".toggle-on").classList.remove("visible");

  // SCADA pump OFF
  const pumpElements = pump.querySelectorAll(".pump");
  pumpElements.forEach((el) => {
    el.classList.add("stop");
  });

  // Pipe stop
  pipe.forEach((el) => {
    el.classList.add("pipe-stop");
  });
};

const sovStart = function () {
  // Control panel toggle
  sovToggle.querySelector(".toggle-off").classList.remove("visible");
  sovToggle.querySelector(".toggle-on").classList.add("visible");

  // SCADA sov ON
  const sovElements = solenoid.querySelectorAll(".sov-01");
  sovElements.forEach((el) => {
    el.classList.remove("stop");
  });
};

const sovStop = function () {
  // Control panel toggle
  sovToggle.querySelector(".toggle-off").classList.add("visible");
  sovToggle.querySelector(".toggle-on").classList.remove("visible");

  // SCADA sov OFF
  const sovElements = solenoid.querySelectorAll(".sov-01");
  sovElements.forEach((el) => {
    el.classList.add("stop");
  });
};

// Outer pipe start
const outerPipeStart = function () {
  pipeOuter.forEach((el) => {
    el.classList.remove("pipe-stop");
  });
};

// Outer pipe stop
const outerPipeStop = function () {
  pipeOuter.forEach((el) => {
    el.classList.add("pipe-stop");
  });
};

const subscribeMQTT = function () {
  const client = mqtt.connect("ws://localhost:9001");
  client.on("connect", function () {
    console.log("MQTT povezan");

    // pretplata na test temu
    client.subscribe("esp32/test", function (err) {
      if (!err) {
        console.log("✅ Uspesna pretplata na temu esp32/test");
      }
    });
  });

  // print poruke po pristigloj poruci
  client.on("message", function (topic, message) {
    console.log(`📩 Poruka pristigla sa teme ${topic} : ${message.toString()}`);
  });
};

// Main function
const startProcess = function () {
  controlPanel.addEventListener("click", function (e) {
    const clicked = e.target;

    if (clicked.closest(".btn1")) {
      if (sovStatus === 1) {
        if (pump1Status === 0) {
          pumpStart(pump01, pump01Toggle, pipe01);
          pump1Status = 1;
          outerPipeStart();
        } else if (pump1Status === 1) {
          pumpStop(pump01, pump01Toggle, pipe01);
          pump1Status = 0;
          outerPipeStop();
        }
      }
    }

    if (clicked.closest(".btn2")) {
      if (pump2Status === 0) {
        pumpStart(pump02, pump02Toggle, pipe02);
        pump2Status = 1;
      } else if (pump2Status === 1) {
        pumpStop(pump02, pump02Toggle, pipe02);
        pump2Status = 0;
      }
    }

    if (clicked.closest(".btn3")) {
      if (pump3Status === 0) {
        pumpStart(pump03, pump03Toggle, pipe03);
        pump3Status = 1;
      } else if (pump3Status === 1) {
        pumpStop(pump03, pump03Toggle, pipe03);
        pump3Status = 0;
      }
    }

    if (clicked.closest(".btn-sov")) {
      if (sovStatus === 0) {
        sovStart();
        sovStatus = 1;
      } else if (sovStatus === 1) {
        sovStop();
        sovStatus = 0;
        pumpStop(pump01, pump01Toggle, pipe01);
        pump1Status = 0;
        outerPipeStop();
      }
    }
  });
};

startProcess();
// subscribeMQTT();
