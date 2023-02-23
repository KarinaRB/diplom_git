var db = require('../config/db.config.js');
var Rule = db.rule;
var User = db.user;
var globalFunctions = require('../config/global.functions.js');

// Получение всех заявлений
exports.findAll = (req, res) => {
    Rule.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

// Получение заявлений пользователя
exports.findRulesForUser = (req, res) => {
    Rule.findAll({
        include: [
            {
                model: User,
                required: true, // INNER JOIN
                where: { // это условие можно написать не для User, а для Statement, тогда сравнение будет с полем user_id и не в этом блоке, а в where для Statement
                    id: req.params.user_id
                }
            }
        ]
    })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

// Добавление 
exports.create = (req, res) => {
    Rule.create({
        user_id: req.body.user_id,
        name :req.body.name,
        grammar: req.body.grammar,
        startSymbol: req.body.startSymbol,
        endSymbol: req.body.endSymbol
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

// Обновление данных по id
exports.update = (req, res) => {
    Rule.update({
            user_id: req.body.user_id,
            grammar: req.body.grammar,
            startSymbol: req.body.startSymbol,
            endSymbol: req.body.endSymbol
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

// Удаление  по id
exports.delete = (req, res) => {
    Rule.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};

// Получение данных по id
exports.findById = (req, res) => {
    Rule.findByPk(req.params.id)
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};