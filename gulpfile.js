const { src, dest, watch, series, parallel } = require('gulp');
//CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
//Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
function css(done) {
  //Compilar sass
  //Pasos: 1 - identificar archivo
  //Paso 2: Compilarla
  //Paso 3: Guardar el .css
  src('src/scss/app.scss') /*Identificar */
    .pipe(sourcemaps.init())
    .pipe(sass()) /*Compilarlo */
    .pipe(
      postcss([autoprefixer(), cssnano()])
    ) /*Convierte codigo css en una versión compactible para ciertos navegadores */
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css')); /*Guardar el css */

  done();
}

function imagenes(done) {
  src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest('build/img'));
  done();
}

function versionwebp() {
  const opciones = {
    quality: 50,
  };
  return src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'));
}

function versionavif() {
  const opciones = {
    quality: 50,
  };
  return src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'));
}

function dev() {
  watch(
    'src/scss/**/*.scss',
    css
  ); /*Revisa todos los archivos .scss en una locación */
  /*watch observara si existen cambios en alguna función
  , toma dos valores 1- El archivo que tiene que estar observando y 2 la función que tiene que ejecutar */
  watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionwebp = versionwebp;
exports.versionavif = versionavif;
exports.default = series(
  imagenes,
  versionwebp,
  versionavif,
  css,
  dev
); /*Tareas por default */

//Series - Completando la primer tarea continua con las restantes
//Parallel - Todas inician al mismo tiempo
