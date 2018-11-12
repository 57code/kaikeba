const hbs = require('hbs');//导入hbs库，扩展handlebars
const helpers = require('handlebars-helpers');//helpers库
const moment = require('moment');
const path = require('path'); // 处理路径相关

// 注册partial目录
console.log(path.join(__dirname, '../views/partials'));
hbs.registerPartials(path.join(__dirname, '../views/partials'))


// 只导入一部分,并且和我们的handlbars实例挂钩
helpers({handlebars: hbs.handlebars})

// 注册帮助方法
hbs.registerHelper('addOne', function (num) {
    return ++num;
})
hbs.registerHelper('date', function (date, format) {
    const m = moment(date);
    if (m) {
        return m.format(format)
    } else {
        return ''
    }
})
// 传参方式二：hash
hbs.registerHelper('link', function (options) {
    const {text, href, style} = options.hash;
    return new hbs.SafeString(`<a href="${href}" style="${style}">${hbs.Utils.escapeExpression(text)}</a>`);
})

// 注册扩展代码块helper
const blocks = {};//代码块缓存对象
hbs.registerHelper('extend', function (name, context) {
    // context 是上下文，保存有用方法和数据，最后一个参数永远是context
    let block = blocks[name]; // block用来存放代码块
    if (!block) {
        block = blocks[name] = [];
    }
    // 变异指令中代码块并放入block
    block.push(context.fn(this));
    // 与context.fn()配对还有一个方法
    // context.inverse()
})

hbs.registerHelper('block', function (name) {
    const val = (blocks[name] || []).join('\n')
    blocks[name] = [];//清空缓存
    return val;
})

// 动态partial
hbs.registerHelper('whichPartial', function (name) {
    return name;
})


// 获取时间一部分
hbs.registerHelper('partOfDate', function (str, part, index) {
    const date = new Date(str);
    if (part == 'd') {
        return date.getDate();
    } else if(part == 'M') {
        return ''+(date.getMonth() + 1)
    } else if(part == 'h') {
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h.toString();
        return h[index];
    } else if(part == 'm') {
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m.toString();
        return m[index];
    } else {
        return ''
    }
})












