/*
Задание 3.
1. Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат.
2. Добавить в чат механизм отправки гео-локации
При клике на кнопку «Гео-локация» необходимо отправить данные серверу и 
в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. 
Сообщение, которое отправит обратно эхо-сервер, не выводить.
*/
const uri = "wss://echo-ws-service.herokuapp.com";

let websocket;

function pageLoaded() {
    const btnSend = document.querySelector('.btn_send');
    const input = document.querySelector("input");
    const chatOutput = document.querySelector('.chat_output');
    const infoOutput = document.querySelector(".info_output");

    const btnGeo = document.querySelector('.btn_geo');

    websocket = new WebSocket(uri);

    websocket.onopen = () => {
        infoOutput.innerText = 'Соединение установлено';
    }

    websocket.onmessage = (event) => {
        writeToChat(event.data, true);
    }

    websocket.onerror = () => {
        infoOutput.innerText = 'При передаче данных произошла ошибка';
    }

    function sendMessage() {
        if (!input.value) return;
        websocket.send(input.value);
        writeToChat(input.value, false);
        input.value = "";
    }

    function writeToChat(message, isRecieved) {
        let messageHTML = `<div class="${isRecieved ? "recieved" : "sent"}">${message}</div>`;
        chatOutput.innerHTML += messageHTML;
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    btnSend.addEventListener('click', sendMessage);

    const error = () => {
        infoOutput.innerText = 'Невозможно получить ваше местоположение';
    }

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let mapLink = `<a class="geolink" target="_blank" href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}">Гео-локация</a>`;
        showGeoData(mapLink);
    }

    function showGeoData(link) {
        chatOutput.innerHTML += link;
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    setInterval(() => {
        if (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING) {
            infoOutput.innerText = 'Соединение установлено';
        } else {
            infoOutput.innerText = 'Связь с сервером потеряна.';
            websocket = new WebSocket(uri);
        }
    }, 8000)

    btnGeo.addEventListener('click', () => {
        mapLink = '';

        if (!navigator.geolocation) {
            infoOutput.innerHTML = '<div>Geolocation не поддерживается вашим браузером</div>';
        } else {
            infoOutput.innerHTML = '<div>Определение местоположения…</div>';
            let options = {
                enableHighAccuracy: true,
                timeout: 3000,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    });
}

document.addEventListener("DOMContentLoaded", pageLoaded);

