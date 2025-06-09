"use strict";

const controlPanel = document.querySelector('.control-panel')

const pump01 = document.querySelector('.pump-ga-01');
const pump02 = document.querySelector('.pump-ga-02');
const pump03 = document.querySelector('.pump-ga-03');
const solenoid = document.querySelector('.sov');

const pipe02 = document.querySelectorAll('.pipe-ga-02');
const pipe03 = document.querySelectorAll('.pipe-ga-03');

const pump01Toggle = document.querySelector('.pump1-toggle');
const pump02Toggle = document.querySelector('.pump2-toggle');
const pump03Toggle = document.querySelector('.pump3-toggle');
const sovToggle = document.querySelector('.sov-toggle');

const btn1 = document.querySelector('.btn1');
const btn2 = document.querySelector('.btn2');
const btn3 = document.querySelector('.btn3');
const btnSov = document.querySelector('.btn-sov');

let pump1Status = 0;
let pump2Tatus = 0;
let pump3Status = 0;
let sovStatus = 0;

const startPump = function() {
    controlPanel.addEventListener('click', function(e) {
        const clicked = e.target;
        if(clicked.closest('.btn1')) {
            pump01Toggle.querySelector('.toggle-off').classList.toggle('visible');
            pump01Toggle.querySelector('.toggle-on').classList.toggle('visible');
            const pumpElements = pump01.querySelectorAll('.pump');
            pumpElements.forEach(el=>{
                el.classList.toggle('stop');
            });
        };
        if(clicked.closest('.btn2')) {
            pump02Toggle.querySelector('.toggle-off').classList.toggle('visible');
            pump02Toggle.querySelector('.toggle-on').classList.toggle('visible');
            const pumpElements = pump02.querySelectorAll('.pump');
            pumpElements.forEach(el=>{
                el.classList.toggle('stop');
            });
            pipe02.forEach(el => {
                el.classList.toggle('pipe-stop')
            });
        };
        if(clicked.closest('.btn3')) {
            pump03Toggle.querySelector('.toggle-off').classList.toggle('visible');
            pump03Toggle.querySelector('.toggle-on').classList.toggle('visible');
            const pumpElements = pump03.querySelectorAll('.pump');
            pumpElements.forEach(el=>{
                el.classList.toggle('stop');
            });
            pipe03.forEach(el => {
                el.classList.toggle('pipe-stop')
            });

        };

        if(clicked.closest('.btn-sov')) {
            sovToggle.querySelector('.toggle-off').classList.toggle('visible');
            sovToggle.querySelector('.toggle-on').classList.toggle('visible');
            const sovElements = solenoid.querySelectorAll('.sov-01');
            sovElements.forEach(el=>{
                el.classList.toggle('stop');
            });
        };
    });
};

startPump();