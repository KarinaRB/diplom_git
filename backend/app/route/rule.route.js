module.exports = (app) => {
    const rule = require('../controller/rule.controller');

    // Получение всех заявлений
    app.get('/api/rules', rule.findAll);

    // Получение заявлений пользователя
    app.get('/api/rulesForUser/userId=:user_id', rule.findRulesForUser);
        
    // Добавление 
    app.post('/api/addRule',  rule.create);

    // Обновление данных пользователя по id
    app.post('/api/updateRule/:id', rule.update);

    // Удаление данных пользователя по id
    app.post('/api/deleteRule/:id', rule.delete);

    // Получение пользователя по id
    app.get('/api/rule/:id', rule.findById);   
}