const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const gulpSequence = require('gulp-sequence')
const sass = require('gulp-sass')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const minifyCss = require('gulp-clean-css')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const clean = require('gulp-clean')
const browserSync = require("browser-sync").create();

let buildUrl = './dist/build'

const IS_HTTPS = process.env.IS_HTTPS || 'FALSE'

/*---------------------------------------------dev------------------------------------------------------------------*/
gulp.task('nodemon', function() {
    return nodemon({
        script: 'build/server.js',
        restartable:'rs',
        execMap: { js: 'node' },
        verbose: true,
        ignore: ['build/*.js', 'dist/*.js', 
            'src/assets/**',
            'nodemon.json', '.git', 'node_modules/**/node_modules', 
            'gulpfile.js'
        ],
        env: {
            NODE_ENV: 'development'
        },
        ext: 'js json html'
    })
})

// 自动刷新页面太慢
// gulp.task('server', ["nodemon"], function() {
//     var files = [
//         'src/**/*.html',
//     ];
//     browserSync.init(files, {
//         proxy: 'http://localhost:18080',
//         browser: 'chrome',
//         notify: true,
//         port: 8080
//     });

//     gulp.watch(files).on("change", browserSync.reload); 
// });


gulp.task('sass', function() {
    return gulp.src(['./src/assets/sass/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/assets/css'));
});

gulp.task('watch', function() {
    return gulp.watch('./src/assets/sass/*.scss', ['sass']);
});

gulp.task('default', ['nodemon', 'sass','watch']);

/*---------------------------------------------------------- build ---------------------------------------------------*/
// 清除文件
gulp.task('clean:dist', function() {
    return gulp.src(['./dist', './dist/test/'], {
            read: false
        })
        .pipe(clean());
});

//复制所有文件
gulp.task('copy-all', () => {
    return gulp.src(["./src/**"])
        .pipe(gulp.dest(buildUrl))
});

// 编译前端js
gulp.task('babel', () => {
    return gulp.src([buildUrl+'/assets/js/*.js'])
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
        }))
        .pipe(gulp.dest(buildUrl+ "/assets/js"));
});

// babel 编译后端js
gulp.task('babel:server:gen', () => {
    return gulp.src(buildUrl+'/*.js')
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
            "plugins": ["transform-runtime"]
        }))
        .pipe(gulp.dest(buildUrl));
});
gulp.task('babel:server:con', () => {
    return gulp.src(buildUrl+'/controllers/*.js')
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
            "plugins": ["transform-runtime"]
        }))
        .pipe(gulp.dest(buildUrl+'/controllers'));
});
gulp.task('babel:server:con:back', () => {
    return gulp.src(buildUrl+'/controllers/back/*.js')
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
            "plugins": ["transform-runtime"]
        }))
        .pipe(gulp.dest(buildUrl+'/controllers/back'));
});
gulp.task('babel:server:con:front', () => {
    return gulp.src(buildUrl+'/controllers/front/*.js')
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
            "plugins": ["transform-runtime"]
        }))
        .pipe(gulp.dest(buildUrl+'/controllers/front'));
});
gulp.task('babel:server:routers', () => {
    return gulp.src(buildUrl+'/routes/*.js')
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
            "plugins": ["transform-runtime"]
        }))
        .pipe(gulp.dest(buildUrl+'/routes'));
});
gulp.task('babel:server:tool', () => {
    return gulp.src(buildUrl+'/tool/*.js')
        .pipe(babel({
            "presets": ["es2015", "stage-2"],
            "plugins": ["transform-runtime"]
        }))
        .pipe(gulp.dest(buildUrl+'/tool'));
});


// concat 前端js js
gulp.task("concat:js", function() {
    return gulp.src([
            buildUrl + '/assets/js/PopLayer.js',
            buildUrl + '/assets/js/config.js',
            buildUrl + '/assets/js/util.js',
            buildUrl + '/assets/js/md5.js',
            buildUrl + '/assets/js/common.js'
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(buildUrl + '/assets/js'));
})

// 压缩所有前端js
gulp.task('js:minify', function() {
    return gulp.src([buildUrl+'/assets/js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(buildUrl+'/assets/js/'));
});

// 压缩前端所有css
gulp.task('css:minify', function() {
    return gulp.src([buildUrl+'/assets/css/*.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest(buildUrl+'/assets/css/'));
});

//replace
let originurl = 'http://pm.seosiwei.com'
if(IS_HTTPS=='TRUE') originurl = 'https://pm.seosiwei.com'

gulp.task('replace:config', function() {
    return gulp.src([buildUrl + '/config.js'])
        .pipe(replace(/ORIGIN(.+)?ORIGIN/, `'ORIGIN':'${originurl}'`))
        .pipe(replace('172.16.50.158', 'localhost'))
        .pipe(replace(/PASSWORD(.+)?123456'/, "PASSWORD:'root'"))
        .pipe(replace('use(KoaLogger())', ""))
        .pipe(gulp.dest(buildUrl));
});
gulp.task('replace:webgetdatas', function() {
    return gulp.src([buildUrl + '/assets/js/web_get_datas.js'])
        .pipe(replace('http://127.0.0.1:18088', originurl))
        .pipe(gulp.dest(buildUrl+'/assets/js/'));
});

// 压缩html
gulp.task('html:minify', function() {
    return gulp.src(buildUrl + '/view/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(buildUrl + '/view'));
});

//replace template.html
gulp.task('replace:template', function() {
    let reg = /<!--replace:main\.js-->.+endreplace-->/m;
    return gulp.src([buildUrl + '/view/template.html'])
        .pipe(replace(reg, '<script src="/js/main.js"></script>'))
        .pipe(gulp.dest(buildUrl + '/view'));
});
 
// 还原 vue-component.js  和 vue-filters.js
gulp.task('vue:back', function() {
    return gulp.src(['./src/assets/js/vue-components.js','./src/assets/js/vue-filters.js'])
        .pipe(gulp.dest(buildUrl + '/assets/js/'));
});


gulp.task('build', gulpSequence(
    'clean:dist', 'copy-all','babel', 'concat:js','replace:config','replace:webgetdatas',['js:minify', 'css:minify'], 
    ['babel:server:gen','babel:server:con','babel:server:routers','babel:server:tool','babel:server:con:back','babel:server:con:front'],
    'vue:back'
));


