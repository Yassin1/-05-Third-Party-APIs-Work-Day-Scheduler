
let timeblocks = {



};

let selectedTimeBlock = null;

function getCurrentDate() {
    return new Date();
}

function getFormattedDate() {
    let dateObj = getCurrentDate();

    let date = dateObj.getDate();
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;


    return {
        date: date,
        year: year,
        month: month
    }

}

function getCurrentTime() {
    let dateObj = getCurrentDate();

    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();

    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        ampm: ampm
    }
}


function setBlockColors() {

    let blocks = $('.timeblock .time');

    let timeObj = getCurrentTime();

    let currentBlockFound = false;

    $(blocks).each(function (index, element) {
        let time = $(element).text();

        let arr = time.toString().split(':');
        let arr2 = time.toString().split(' ');

        let hour = arr[0];
        let ampm = arr2[1];

        if ((hour.toString() == timeObj.hours.toString() || hour.toString() == '0' + timeObj.hours.toString()) && timeObj.ampm == ampm) {

            $(element).closest('td').addClass('bg-green');
            currentBlockFound = true;

        }
        else if (currentBlockFound == false) {
            $(element).closest('td').addClass('bg-red');

        }
        else {
            $(element).closest('td').addClass('bg-blue');
        }
    });

}


function setTimeBlockEvents() {
    let blocks = $('.timeblock td');
    $(blocks).each(function (index, element) {

        element.addEventListener('click', function () {
            $('#event-modal').modal('show');
            selectedTimeBlock = element;
        });

    });
}


function saveEventToLocalStorage(eventName, time) {


    let oldData = localStorage.getItem("scheduler");

    if (oldData == false || oldData == null || oldData == '' || oldData == undefined) {
        oldData = {};
    }
    else {
        oldData = JSON.parse(oldData);
    }

    let dateObj = getFormattedDate();

    let dateStr = dateObj.month + '-' + dateObj.date + '-' + dateObj.year;


    let eventBlock = {
        date: dateStr,
        eventName: eventName,
        time: time
    };

    if (oldData[dateStr] == undefined) {
        oldData[dateStr] = {};
    }

    oldData[dateStr][time] = eventBlock;

    oldData = JSON.stringify(oldData);

    localStorage.setItem('scheduler', oldData);


}

function setEventsFromLocalStorage() {

    let oldData = localStorage.getItem("scheduler");

    if (oldData == false || oldData == null || oldData == '' || oldData == undefined) { }
    else {
        oldData = JSON.parse(oldData);

        let keys = Object.keys(oldData);
        let values = Object.values(oldData);

        let currentDateObj = getFormattedDate();



        keys.forEach(function (date, index) {

            let data = values[index];

            if (currentDateObj.month + '-' + currentDateObj.date + '-' + currentDateObj.year == date) {

                let keys2 = Object.keys(data);
                let values2 = Object.values(data);

                keys2.forEach(function (timeBlock, index2) {

                    let data2 = values2[index2];

                    let blocks = $('.timeblock .time');


                    $(blocks).each(function (index, element) {
                        let time = $(element).text();



                        if (time == timeBlock) {
                            $(element).closest('td').find('.event').html(data2.eventName);
                        }

                    });

                });


            }


        });


    }

}


function init() {
    $('#currentDay').html(getCurrentDate());
    setBlockColors();
    setTimeBlockEvents();
    setEventsFromLocalStorage();
}


$('#save-event').on('click', function () {

    let eventName = $('#event-name').val();
    $(selectedTimeBlock).find('.event').html(eventName);
    $('#event-modal').modal('hide');
    $('#event-name').val('');

    let time = $(selectedTimeBlock).find('.time').text();

    saveEventToLocalStorage(eventName, time);

});


/*== Init ==*/
init();