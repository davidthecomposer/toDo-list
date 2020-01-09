/* jshint esversion: 6 */
const toDoContainer = document.querySelector('.todo-container');
class Task {

    constructor() {
        this.currentDate = new Date(Date.now());
        this.alarmTimer;
        this.alarmSound = new Audio('audio/buzz1.mp3');
        this.taskSuper =
            `
            <div class="task-container">
            <div class="circle"></div>
            <input type="text" value='' class="input">
            <div class="options">
                <div class="info"></div>
                <div class="alarm"></div>
                <div class="delete"></div>
            </div>
            </div>
            <div class="task-extras">
            <textarea name="info" id="info" class = "info-pane"cols="30" rows="10"></textarea>
            <div class="alarm-options">
            <input type="date" value='${this.currentDate.toISOString().substring(0,10)}' class="date">
            <input type="time" value="00:00" class="time">
            <div class="alarm-row-toggle"></div>
            </div>
            </div>
     `;
    }

    handleCircle(event) {
        let filledCircle = `url('images/filled-circle.svg') no-repeat`;
        let emptyCircle = `url('images/empty-circle.svg') no-repeat`;
        if (event.target.style.background.includes('empty') || event.target.style.background === '') {
            event.target.style.background = filledCircle;
            event.target.parentElement.children[1].style.opacity = '0.2';
            event.target.parentElement.children[2].style.opacity = '0.2';


        } else {
            event.target.style.background = emptyCircle;
            event.target.parentElement.children[1].style.opacity = '1';
            event.target.parentElement.children[2].style.opacity = '1';
        }

    }

    handleInfo(event) {
        let inactiveInfo = `url('images/info.svg') no-repeat`;
        let activeInfo = `url('images/info-active.svg') no-repeat`;
        let taskExtras = event.target.parentElement.parentElement.parentElement.querySelector('.task-extras');
        let infoPane = taskExtras.querySelector('.info-pane');
        let taskContainer = event.target.parentElement.parentElement;
        taskExtras.classList.remove('alarm-slide');
        taskExtras.classList.remove('alarm-hide');

        if (event.target.style.background.includes('active')) {
            taskExtras.classList.remove('pane-slide');
            taskExtras.classList.add('pane-hide');
            event.target.style.background = inactiveInfo;
            setTimeout(() => {
                taskExtras.style.display = 'none';
                infoPane.style.display = 'none';
                taskContainer.style.marginBottom = '1rem';
            }, 125);
        } else {
            taskExtras.classList.remove('pane-hide');
            taskExtras.classList.add('pane-slide');
            event.target.style.background = activeInfo;
            taskExtras.style.display = 'flex';
            infoPane.style.display = 'flex';
            taskContainer.style.marginBottom = '0';
            infoPane.focus();
        }
    }

    initAlarm(thisAlarm) {
        this.unhandleCheckTime();
        console.log('working');
        thisAlarm.classList.add('alarm-animation');
        this.alarmSound.loop = true;
        this.alarmSound.play();
    }


    handleCheckTime(inputDate, inputTime, thisAlarm) {


        this.alarmTimer = setInterval(() => {
            let todaysDate = new Date();
            let minutes = todaysDate.getMinutes() < 10 ? `0${todaysDate.getMinutes()}` : todaysDate.getMinutes();
            let hours = todaysDate.getHours() < 10 ? `0${todaysDate.getHours()}` : todaysDate.getHours();
            let bigTime = todaysDate.toISOString().substring(0, 10);
            let currentDateAndTime = `${bigTime} ${hours}:${minutes}`;
            let alarmDateAndTime = `${inputDate.value} ${inputTime.value}`;

            if (currentDateAndTime === alarmDateAndTime) {
                this.initAlarm(thisAlarm);
            }
        }, 1000);
    }

    unhandleCheckTime() {
        clearInterval(this.alarmTimer);
    }

    toggleAlarm(event, thisAlarm) {
        let alarmToggleOff = `url('images/alarm-row-off.svg') no-repeat`;
        let alarmToggleOn = `url('images/alarm-row-on.svg') no-repeat`;
        let inputDate = event.target.previousElementSibling.previousElementSibling;
        let inputTime = event.target.previousElementSibling;


        if (event.target.style.background.includes('on')) {
            event.target.style.background = alarmToggleOff;
            inputDate.disabled = true;
            inputTime.disabled = true;
            this.unhandleCheckTime();
            if (this.alarmSound.currentTime) {
                this.alarmSound.pause();
                thisAlarm.classList.remove('alarm-animation');
            }
        } else {
            event.target.style.background = alarmToggleOn;
            inputDate.disabled = false;
            inputTime.disabled = false;
            this.handleCheckTime(inputDate, inputTime, thisAlarm);

        }
    }



    handleAlarm(event) {
        let inactiveAlarm = `url('images/alarm-off.svg') no-repeat`;
        let activeAlarm = `url('images/alarm-on.svg') no-repeat`;
        let taskContainer = event.target.parentElement.parentElement;
        let taskExtras = event.target.parentElement.parentElement.parentElement.querySelector('.task-extras');
        let alarmOptions = taskExtras.querySelector('.alarm-options');
        let toggleTheAlarm = event.target.parentElement.parentElement.nextElementSibling.querySelector('.alarm-row-toggle');
        taskExtras.classList.remove('pane-slide');
        taskExtras.classList.remove('pane-hide');

        if (toggleTheAlarm.style.background.includes('off')) {
            if (event.target.style.background.includes('on')) {
                event.target.style.background = inactiveAlarm;
                taskExtras.classList.remove('alarm-slide');
                taskExtras.classList.add('alarm-hide');
                setTimeout(() => {
                    taskExtras.style.display = 'none';
                    alarmOptions.style.display = 'none';
                    taskContainer.style.marginBottom = '1rem';
                }, 150);

            } else {
                event.target.style.background = activeAlarm;
                taskExtras.classList.remove('alarm-hide');
                taskExtras.classList.add('alarm-slide');
                taskExtras.style.display = 'flex';
                alarmOptions.style.display = 'flex';
                taskContainer.style.marginBottom = '0';
            }
        } else {

            if (alarmOptions.style.display === 'none') {
                taskExtras.classList.remove('alarm-hide');
                taskExtras.classList.add('alarm-slide');
                alarmOptions.style.display = 'flex';
                taskContainer.style.marginBottom = '0';
            } else {
                taskExtras.classList.remove('alarm-slide');
                taskExtras.classList.add('alarm-hide');
                setTimeout(() => {
                    alarmOptions.style.display = 'none';
                    taskContainer.style.marginBottom = '1rem';
                }, 150);
            }
        }
    }



    handleDelete(event) {
        const taskSupers = document.querySelectorAll('.task-super');
        if (taskSupers.length > 1) {
            let thisTask = event.target.parentElement.parentElement.parentElement;
            thisTask.remove();
        }

    }
    useEnter(event) {
        if (event.keyCode === 13) {
            event.target.blur();
            event.target.parentElement.parentElement.nextElementSibling.children[0].children[1].focus();
        }
    }

    appendRow() {
        const taskSupers = document.querySelectorAll('.task-super');
        let newDiv = document.createElement('div');
        newDiv.classList.add('task-super');
        newDiv.innerHTML = this.taskSuper;
        toDoContainer.appendChild(newDiv);
        newDiv.classList.add(`${taskSupers.length}`);
        let thisCircle = newDiv.querySelector('.circle');
        let thisInfo = newDiv.querySelector('.info');
        let thisAlarm = newDiv.querySelector('.alarm');
        let thisDelete = newDiv.querySelector('.delete');
        let thisInput = newDiv.querySelector('.input');
        let thisAlarmToggle = newDiv.querySelector('.alarm-row-toggle');
        let inputDate = newDiv.querySelector('.date');
        let inputTime = newDiv.querySelector('.time');
        thisCircle.addEventListener('click', this.handleCircle);
        thisInfo.addEventListener('click', this.handleInfo);
        thisAlarm.addEventListener('click', this.handleAlarm);
        thisDelete.addEventListener('click', this.handleDelete);
        thisInput.addEventListener('keydown', this.useEnter);
        thisInput.addEventListener('blur', this.handleNewRow);
        thisAlarmToggle.onclick = () => this.toggleAlarm(event, thisAlarm);
        thisInput.focus();
        inputDate.disabled = true;
        inputTime.disabled = true;
        thisAlarmToggle.style.background = `url(images/alarm-row-off.svg) no-repeat`;
    }

    handleNewRow(event) {
        const taskSupers = document.querySelectorAll('.task-super');
        let taskSuper = event.target.parentElement.parentElement;
        if ([...taskSupers].indexOf(taskSuper) === taskSupers.length - 1 && event.target.value !== '') {
            let newTaskName = `task${taskSupers.length}`;
            this[newTaskName] = new Task();
            this[newTaskName].appendRow();
        }
    }
}

let task = new Task();
task.appendRow();







// option to save data to page object and then use option thing to quickly fill in data.will need Icon. 
