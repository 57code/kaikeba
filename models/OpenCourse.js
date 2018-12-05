module.exports = (sequelize, Types) => {
    const OpenCourse = sequelize.define('Open_Course', {
        name: Types.STRING(50),
        description: Types.STRING(100),
        time: Types.DATE,
        count: Types.INTEGER,
    });
    OpenCourse.sync();
    return OpenCourse;
}