module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define(
        'user', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER, // тип данных INTEGER
                autoIncrement: true, // включение автоматической нумерации
                primaryKey: true, // поле является первичным ключом
                allowNull: false // настройка allowNull со значением false запрещает запись в поле значений NULL (для поля с настройкой автоинкремента можно не указывать)
            },
            name: {
                type: Sequelize.STRING(50), // тип данных STRING (в MySQL — VARCHAR)
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['Пользователь', 'Администратор'],
                allowNull: false
            },
            password:{
                type: Sequelize.STRING(200),
                allowNull: false
            }
        });

    // Определяем связи таблицы user с другими таблицами
    User.associate = (models) => {
        // Определение связи один-ко-многим с таблицей statement. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны модели statement): в файле statement.model.js
        User.hasMany(models.rule, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return User;
};