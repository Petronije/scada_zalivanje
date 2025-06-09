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
let pump2Tatus = 0;
let pump3Status = 0;
let sovStatus = 0;

const pumpStart = function (pump, pumpToggle, pipe) {
  pumpToggle.querySelector(".toggle-off").classList.remove("visible");
  pumpToggle.querySelector(".toggle-on").classList.add("visible");

  const pumpElements = pump.querySelectorAll(".pump");
  pumpElements.forEach((el) => {
    el.classList.remove("stop");
  });
  pipe.forEach((el) => {
    el.classList.remove("pipe-stop");
  });
};

const pumpStop = function (pump, pumpToggle, pipe) {
  pumpToggle.querySelector(".toggle-off").classList.add("visible");
  pumpToggle.querySelector(".toggle-on").classList.remove("visible");

  const pumpElements = pump.querySelectorAll(".pump");
  pumpElements.forEach((el) => {
    el.classList.add("stop");
  });
  pipe.forEach((el) => {
    el.classList.add("pipe-stop");
  });
};

const startPump = function () {
  controlPanel.addEventListener("click", function (e) {
    const clicked = e.target;
    if (clicked.closest(".btn1")) {
      if (sovStatus === 1) {
        pump01Toggle.querySelector(".toggle-off").classList.toggle("visible");
        pump01Toggle.querySelector(".toggle-on").classList.toggle("visible");
        const pumpElements = pump01.querySelectorAll(".pump");
        pumpElements.forEach((el) => {
          el.classList.toggle("stop");
          if (el.closest("stop")) {
            pump1Status = 0;
          } else {
            pump1Status = 1;
          }
        });
        pipe01.forEach((el) => {
          el.classList.toggle("pipe-stop");
        });
      }
    }
    if (clicked.closest(".btn2")) {
      pump02Toggle.querySelector(".toggle-off").classList.toggle("visible");
      pump02Toggle.querySelector(".toggle-on").classList.toggle("visible");
      const pumpElements = pump02.querySelectorAll(".pump");
      pumpElements.forEach((el) => {
        el.classList.toggle("stop");
      });
      pipe02.forEach((el) => {
        el.classList.toggle("pipe-stop");
      });
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
      sovToggle.querySelector(".toggle-off").classList.toggle("visible");
      sovToggle.querySelector(".toggle-on").classList.toggle("visible");
      const sovElements = solenoid.querySelectorAll(".sov-01");
      sovElements.forEach((el) => {
        el.classList.toggle("stop");
        if (el.closest(".stop")) {
          sovStatus = 0;
        } else {
          sovStatus = 1;
        }
      });
      if (pump1Status === 1) {
        pipeOuter.forEach((el) => {
          el.classList.toggle("pipe-stop");
        });
      }
    }
  });
};

startPump();
