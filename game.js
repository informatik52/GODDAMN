const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const dialogBox = document.getElementById('dialogBox');
const dialogText = document.getElementById('dialogText');
const commandInput = document.getElementById('commandInput');
const questBox = document.getElementById('questBox');
const questText = document.getElementById('questText');
const interactButton = document.getElementById('interactButton');
const backgroundMusic = document.getElementById('backgroundMusic');

// Проверка на мобильное устройство
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    setupMobileInterface();
}

// Функция для настройки интерфейса на мобильных устройствах
function setupMobileInterface() {
    document.body.classList.add('mobile-device');

    const controlButtons = document.createElement('div');
    controlButtons.classList.add('control-buttons');

    const directions = ['↑', '↓', '←', '→'];
    const positions = [
        { top: '10px', left: '50%' },
        { top: '70px', left: '50%' },
        { top: '40px', left: '30%' },
        { top: '40px', right: '30%' }
    ];

    directions.forEach((label, index) => {
        const button = createControlButton(label, positions[index]);
        controlButtons.appendChild(button);
        button.addEventListener('touchstart', () => movePlayerMobile(label));
        button.addEventListener('touchend', () => stopPlayerMobile(label));
    });

    document.body.appendChild(controlButtons);

    // Убедимся, что кнопки добавлены в DOM
    console.log('Control buttons added to DOM:', controlButtons);
}

// Функция для создания кнопки управления
function createControlButton(label, position) {
    const button = document.createElement('button');
    button.innerText = label;
    Object.assign(button.style, {
        position: 'absolute',
        width: '40px',
        height: '40px',
        ...position
    });
    return button;
}

// Функция для управления игроком на мобильных устройствах
function movePlayerMobile(direction) {
    switch (direction) {
        case '↑':
            player.velocityY = -player.speed;
            break;
        case '↓':
            player.velocityY = player.speed;
            break;
        case '←':
            player.velocityX = -player.speed;
            break;
        case '→':
            player.velocityX = player.speed;
            break;
    }
}

// Функция для остановки игрока на мобильных устройствах
function stopPlayerMobile(direction) {
    switch (direction) {
        case '↑':
        case '↓':
            player.velocityY = 0;
            break;
        case '←':
        case '→':
            player.velocityX = 0;
            break;
    }
}

// Игровые переменные
let currentLevel = 0;
const levels = ['Школа', 'Кабинет информатики', 'Дом с тортиком', 'РУВД'];
const dialogs = {
    level1: ["Никита: Привет, Артем! Что ты здесь делаешь?"],
    level2: ["Митрофан: Тихо! Кто это тут шуршит?"],
    level3Success: ["Артем: Ура! Я сделал это! Теперь можно отметить 15 день рождения."],
    level3Fail: ["Полицейский: Ты арестован за взлом школьной сети."]
};

const quests = {
    level1: "Поговори с Никитой и узнай пароль от сети.",
    level2: "Взломай компьютер, пока Митрофан не видит.",
    level3Success: "Отпразднуй свой день рождение!",
    level3Fail: "Попытайся выбраться из РУВД."
};

let currentInteraction = null;
let hackAttempts = 0;
const hackHints = ["Подсказка: Начни с 'sudo'", "Подсказка: Используй 'rm -rf'", "Подсказка: Не забудь /*"];

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    image: new Image(),
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    friction: 0.7
};

const nikita = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    image: new Image(),
    speed: 1,
    direction: 1,
    dialogs: [
        "Никита: Здарова Темыч, ты чо здесь делаешь?",
        "Артем: Привет, Никита, просто хочу узнать больше о сети школы.",
        "Никита: О, понятно. Если нужна помощь, дай знать!",
        "*соскользнула рука*",
        "Никита: Кстати, я слышал, что в кабинете информатики есть что-то интересное.",
        "Никита: Ты знаешь, Артем, ты мне всегда нравился... Может, после школы зайдешь ко мне?",
        "Артем: Эээ... ты же ток к Кате и Соне приставал, че ко мне полез? ладно, подумаю."
    ],
    currentDialogIndex: 0
};

const mitrofan = {
    x: 600,
    y: 400,
    width: 50,
    height: 50,
    image: new Image(),
    speed: 1,
    direction: 1,
    dialogs: [
        "Митрофан: Тихо! Кто это тут шуршит?",
        "Артем: Это я, Артем. Просто проверяю компьютеры.",
        "Митрофан: какого хуя",
        "Артем: для баланса вселенной",
        "Митрофан: Ты знаешь, Артем, я всегда подозревал, что ты что-то замышляешь...",
        "Митрофан: ...впрочим, если че, 2 в аттестат"
    ],
    currentDialogIndex: 0
};

const computer = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    image: new Image(),
    hacked: false,
    dialogs: [
        "Артем: Нужно ввести команду для взлома...",
        "Подсказка: Введи команду для взлома.",
        "Подсказка: Используй 'sudo rm -rf /*'"
    ],
    currentDialogIndex: 0
};

const policeman = {
    x: 600,
    y: 400,
    width: 50,
    height: 50,
    image: new Image(),
    dialogs: [
        "Полицейский: Ты арестован за взлом школьной сети.",
        "Артем: Попытаюсь выбраться через дверь...",
        "Полицейский: Стой! Ты никуда не уйдешь!"
    ],
    currentDialogIndex: 0
};

const hiddenEasterEgg = {
    x: 700,
    y: 50,
    width: 30,
    height: 30,
    image: new Image(),
    found: false,
    dialogs: [
        "Артем: Ого! Это же скрытая пасхалка!",
        "Артем: Кажется, я нашел что-то интересное..."
    ],
    currentDialogIndex: 0
};

// Загрузка изображений
function loadImages() {
    player.image.src = 'artem.png';
    nikita.image.src = 'nikita.png';
    mitrofan.image.src = 'mitrofan.png';
    computer.image.src = 'computer.png';
    policeman.image.src = 'policeman.png';
    hiddenEasterEgg.image.src = 'easterEgg.png';

    player.image.onload = () => console.log('Player image loaded');
    nikita.image.onload = () => console.log('Nikita image loaded');
    mitrofan.image.onload = () => console.log('Mitrofan image loaded');
    computer.image.onload = () => console.log('Computer image loaded');
    policeman.image.onload = () => console.log('Policeman image loaded');
    hiddenEasterEgg.image.onload = () => console.log('Easter Egg image loaded');
}

// Функция для рисования объекта
function drawObject(obj) {
    if (obj.image.complete) {
        ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
    } else {
        ctx.fillStyle = obj.color || 'gray';
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}

// Функция для рисования окружения
function drawEnvironment() {
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentLevel === 0) {
        ctx.fillStyle = '#888888';
        ctx.fillRect(50, 50, 100, 50);
        ctx.fillRect(200, 50, 100, 50);
        ctx.fillRect(50, 200, 100, 50);
        ctx.fillRect(200, 200, 100, 50);
        ctx.fillStyle = '#ff5733';
        ctx.fillRect(350, 150, 50, 100);
        ctx.fillStyle = '#33ff57';
        ctx.fillRect(450, 250, 50, 50);
        ctx.fillStyle = '#3357ff';
        ctx.fillRect(550, 350, 50, 50);
        ctx.fillStyle = '#ff57ff';
        ctx.fillRect(650, 450, 50, 50);
        ctx.fillStyle = '#57ff33';
        ctx.fillRect(750, 50, 50, 50);
        drawObject(hiddenEasterEgg);
    } else if (currentLevel === 1) {
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(300, 100, 200, 100);
        ctx.fillStyle = '#33ff57';
        ctx.fillRect(350, 150, 50, 50);
        ctx.fillStyle = '#ff5733';
        ctx.fillRect(450, 250, 50, 50);
        ctx.fillStyle = '#3357ff';
        ctx.fillRect(550, 350, 50, 50);
        ctx.fillStyle = '#ff57ff';
        ctx.fillRect(650, 450, 50, 50);
        ctx.fillStyle = '#57ff33';
        ctx.fillRect(750, 50, 50, 50);
        drawObject(computer);
    } else if (currentLevel === 2) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(350, 250, 100, 100);
        ctx.fillStyle = '#ff5733';
        ctx.fillRect(450, 350, 50, 50);
        ctx.fillStyle = '#33ff57';
        ctx.fillRect(550, 450, 50, 50);
        ctx.fillStyle = '#3357ff';
        ctx.fillRect(650, 50, 50, 50);
        ctx.fillStyle = '#ff57ff';
        ctx.fillRect(750, 150, 50, 50);
        ctx.fillStyle = '#57ff33';
        ctx.fillRect(250, 350, 50, 50);
    } else if (currentLevel === 3) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(350, 250, 100, 100);
        ctx.fillStyle = '#ff5733';
        ctx.fillRect(450, 350, 50, 50);
        ctx.fillStyle = '#33ff57';
        ctx.fillRect(550, 450, 50, 50);
        ctx.fillStyle = '#3357ff';
        ctx.fillRect(650, 50, 50, 50);
        ctx.fillStyle = '#ff57ff';
        ctx.fillRect(750, 150, 50, 50);
        ctx.fillStyle = '#57ff33';
        ctx.fillRect(250, 350, 50, 50);
        drawObject(policeman);
    }
}

// Функция для очистки экрана
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Функция для обновления игры
function update() {
    clearCanvas();
    drawEnvironment();

    // Обновление позиции игрока
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Замедление игрока
    player.velocityX *= player.friction;
    player.velocityY *= player.friction;

    // Проверка на столкновение с границами
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Отрисовка объектов
    drawObject(player);
    if (currentLevel === 0) drawObject(nikita);
    if (currentLevel === 1) drawObject(mitrofan);
    if (currentLevel === 1) drawObject(computer);
    if (currentLevel === 3) drawObject(policeman);

    // Проверка на взаимодействие с объектами
    checkInteractions();

    requestAnimationFrame(update);
}

// Функция для управления игроком
function movePlayer(event) {
    switch (event.key) {
        case 'ArrowUp':
            player.velocityY = -player.speed;
            break;
        case 'ArrowDown':
            player.velocityY = player.speed;
            break;
        case 'ArrowLeft':
            player.velocityX = -player.speed;
            break;
        case 'ArrowRight':
            player.velocityX = player.speed;
            break;
    }
}

// Функция для начала игры
function startGame() {
    menu.style.display = 'none';
    currentLevel = 0;
    questText.innerHTML = quests.level1;
    loadImages();
    backgroundMusic.play(); // Запуск фоновой музыки
    update();
}

// Функция для отображения диалогов
function showDialog(dialog) {
    dialogText.innerHTML = dialog.join('<br><br>');
    dialogBox.style.display = 'block';
    commandInput.style.display = 'none';
    document.getElementById('dialogButton').innerText = 'Продолжить';
}

// Функция для закрытия диалога
function closeDialog() {
    if (currentLevel === 1 && commandInput.style.display !== 'none') {
        checkHackCommand();
        return;
    }

    dialogBox.style.display = 'none';
    if (currentInteraction) {
        if (currentInteraction.currentDialogIndex < currentInteraction.dialogs.length) {
            showDialog([currentInteraction.dialogs[currentInteraction.currentDialogIndex]]);
            currentInteraction.currentDialogIndex++;
        } else {
            currentInteraction = null;
            interactButton.style.display = 'none';
            if (currentLevel === 0) {
                currentLevel = 1;
                questText.innerHTML = quests.level2;
                fadeTransition(() => {
                    showDialog(mitrofan.dialogs);
                });
            }
        }
    }
}

// Функция для проверки взаимодействий
function checkInteractions() {
    const interactions = [
        { level: 0, obj: nikita },
        { level: 1, obj: computer },
        { level: 1, obj: mitrofan },
        { level: 0, obj: hiddenEasterEgg }
    ];

    interactions.forEach(({ level, obj }) => {
        if (currentLevel === level && !currentInteraction) {
            const dx = player.x - obj.x;
            const dy = player.y - obj.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (level === 0 && obj === hiddenEasterEgg ? 50 : 100)) {
                currentInteraction = obj;
                interactButton.style.display = 'block';
            }
        }
    });
}

// Функция для взаимодействия
function interact() {
    if (currentInteraction) {
        showDialog([currentInteraction.dialogs[currentInteraction.currentDialogIndex]]);
        currentInteraction.currentDialogIndex++;
        if (currentInteraction.currentDialogIndex >= currentInteraction.dialogs.length) {
            currentInteraction.currentDialogIndex = currentInteraction.dialogs.length - 1;
            if (currentInteraction === computer) {
                commandInput.style.display = 'block';
                document.getElementById('dialogButton').innerText = 'Ввести команду';
            } else if (currentInteraction === hiddenEasterEgg) {
                hiddenEasterEgg.found = true;
            }
        }
    }
}

// Функция для проверки команды взлома
function checkHackCommand() {
    const command = commandInput.value.trim();
    if (command === 'sudo rm -rf /*') {
        computer.hacked = true;
        showDialog(["Артем: Компьютер взломан!"]);
        setTimeout(() => {
            currentLevel = 2;
            questText.innerHTML = quests.level3Success;
            fadeTransition(() => {
                showDialog(["Артем: Ура! Теперь можно отметить день рождение и съесть торт!"]);
                setTimeout(() => {
                    showEnding(true);
                }, 3000);
            });
        }, 2000);
    } else {
        hackAttempts++;
        if (hackAttempts >= 2) {
            showDialog(["Митрофан: Я видел, что ты делаешь! Щяс Песецкая ментов вызовет!"]);
            setTimeout(() => {
                currentLevel = 3;
                questText.innerHTML = quests.level3Fail;
                fadeTransition(() => {
                    showDialog(["Артем: Блять, я в РУВД... Попытаюсь дать по съебам"]);
                    setTimeout(() => {
                        showEnding(false);
                    }, 3000);
                });
            }, 2000);
        } else {
            showDialog([hackHints[hackAttempts]]);
        }
    }
}

// Функция для отображения концовки
function showEnding(isSuccess) {
    const endingText = isSuccess
        ? "Артем съел торт и отметил свой 15 день рождения"
        : "Артем попытался выйти через дверь, но попал за решетку. Лошара, чо сказать";
    showDialog([endingText]);
    setTimeout(() => {
        fadeToWhite(() => {
            showCredits();
        });
    }, 3000);
}

// Функция для плавного перехода между уровнями
function fadeTransition(callback) {
    const fade = document.createElement('div');
    fade.style.position = 'absolute';
    fade.style.top = 0;
    fade.style.left = 0;
    fade.style.width = '100%';
    fade.style.height = '100%';
    fade.style.background = 'black';
    fade.style.opacity = 0;
    fade.style.transition = 'opacity 2s';
    document.body.appendChild(fade);

    fade.style.opacity = 1;
    setTimeout(() => {
        fade.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(fade);
            callback();
        }, 2000);
    }, 2000);
}

// Функция для затемнения экрана в белый
function fadeToWhite(callback) {
    const fade = document.createElement('div');
    fade.style.position = 'absolute';
    fade.style.top = 0;
    fade.style.left = 0;
    fade.style.width = '100%';
    fade.style.height = '100%';
    fade.style.background = 'white';
    fade.style.opacity = 0;
    fade.style.transition = 'opacity 3s';
    document.body.appendChild(fade);

    fade.style.opacity = 1;
    setTimeout(() => {
        callback();
    }, 3000);
}

// Функция для отображения титров
function showCredits() {
    const credits = [
        "Режиссер: @QuickLED",
        "Сценарист: @QuickLED",
        "Продюсер: @QuickLED",
        "Оператор: @QuickLED",
        "Композитор: @QuickLED",
        "Монтажер: @QuickLED",
        "Звукорежиссер: @QuickLED",
        "Художник по костюмам: @QuickLED",
        "Гример: @QuickLED",
        "Постановщик трюков: @QuickLED",
        "Каскадер: @QuickLED",
        "Ассистент режиссера: @QuickLED",
        "Помощник оператора: @QuickLED",
        "Звукооператор: @QuickLED",
        "Осветитель: @QuickLED",
        "Декоратор: @QuickLED",
        "Реквизитор: @QuickLED",
        "Постановщик света: @QuickLED",
        "Визуальные эффекты: @QuickLED",
        "Специальные эффекты: @QuickLED",
        "Аниматор: @QuickLED",
        "Дизайнер титров: @QuickLED"
    ];

    const creditsContainer = document.createElement('div');
    creditsContainer.style.position = 'absolute';
    creditsContainer.style.top = '100%';
    creditsContainer.style.left = '50%';
    creditsContainer.style.transform = 'translateX(-50%)';
    creditsContainer.style.textAlign = 'center';
    creditsContainer.style.fontSize = '24px';
    creditsContainer.style.color = 'black';
    creditsContainer.style.whiteSpace = 'pre-line';
    creditsContainer.innerHTML = credits.join('\n');
    document.body.appendChild(creditsContainer);

    const duration = 15000; // 15 секунд
    const start = performance.now();

    function animateCredits(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        creditsContainer.style.top = `${100 - progress * 200}%`;

        if (progress < 1) {
            requestAnimationFrame(animateCredits);
        } else {
            document.body.removeChild(creditsContainer);
        }
    }

    requestAnimationFrame(animateCredits);
}

document.addEventListener('keydown', movePlayer);
