module.exports = (sequelize, Types) => {
    const OpenCourse = sequelize.define('OpenCourse', {
        name: Types.STRING(50),
        description: Types.STRING(100),
        time: Types.DATE,
        count: Types.INTEGER,
    }, {
        tableName: 'open_course', // 自己命名表名
        timestamps: false, // 禁止seq自动添加createdAt，updatedAt
    })
    OpenCourse.sync();
    return OpenCourse;
}