const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('options.js')

const token = '5193981904:AAG0id6V28nK2MPClQoNPaLZqZJBU8Bo5Go'

const chats = {}


const bot = new TelegramApi(token, { polling: true })

const startGame = async (chatId) => {

    await bot.sendMessage(chatId, 'Сейчас загадаю число от 0 до 9, твоя задача угадать :)');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'получить информацию' },
        { command: '/game', description: 'Игра Угадай цифру' },
    ])

    bot.on('message', async msq => {
        const text = msq.text;
        const chatId = msq.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, ' ' + 'Добро пожаловать в тестовый телеграм-бот Георгия Антоневича ');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'Тебя зовут' + ' ' + msq.from.first_name + ' ' + msq.from.last_name);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, ' ' + 'Я тебя не понимаю, попробуй еще')
    })

    bot.on('callback_query', async msq => {
        const data = msq.data;
        const chatId = msq.message.chat.id
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, " " + 'Поздравляю ты угадал цифру' + chats[chatId], againOptions)
        } else {
            return bot.sendMessage(chatId, " " + "Ты не угадал, бот загадал цифру" + ' ' + chats[chatId], againOptions)
        }
    })
}

start()

