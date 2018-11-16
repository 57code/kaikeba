module.exports = (sequelize, Types) => {
    const OpenCourse = sequelize.define('OpenCourse', {
        name: Types.STRING(50),
        description: Types.STRING(100),
        time: Types.DATE,
        count: Types.INTEGER,
    })
    OpenCourse.sync();
    return OpenCourse;
}