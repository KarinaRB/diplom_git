module.exports = (sequelize, Sequelize) => {
    var Rule = sequelize.define(
        'rule', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            name:{
                type: Sequelize.STRING(50),
                allowNull: false
            },
            grammar: {
                type: Sequelize.TEXT, 
                allowNull: false
            },
            startSymbol:{
                type: Sequelize.STRING(1),
                allowNull:false
            },
            endSymbol:{
                type:Sequelize.STRING(1),
                allowNull:false
            }
        });

    // Определяем связи таблицы statement с другими таблицами
    Rule.associate = (models) =>  {
        // Определение связи один-ко-многим с таблицей user. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели user): в файле user.model.js
        Rule.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

    };
    return Rule;
};