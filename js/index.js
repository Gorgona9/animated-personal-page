import Path from './components/Path.js';
import Circle from './components/CircleObject.js';
import AnimatedText from './components/AnimatedText.js';
import { animations as an, SVG_DOC } from './helpers/Helpers.js';
import Carousel from './components/Carousel.js';

const ROOT_SVG_ID = 'animated-path';
const CIRCLE_OBJECTS_GROUP_CLASS = 'circles-group';
const CURVE_CONTROL = () => window.innerWidth / 9.6;

// Review CSS transition speeds
let timeControl = {
    introDelay: 3000,
    animatedTextSpeed: 500,
    animatedTextDelay: 7000,
    carouselSpeed: 1000,
    carouselSwipeDelay: 7000,
    fisrtMaskIn: 1000,
    secondMaskIn: 500,
    pathRenderIn: 2000,
    circlesRenderIn: 4000,
    circlesInterval: 7000,
    circlesFadeSpeed: 1500,
}
let animationFunctions = [];

// Animated Text
let textList = [
    {
        text:   ['Astghik',        'Trdatyan\'s'],
        in:     [an.SLIDE_DOWN, an.SLIDE_UP],
        out:    [an.SLIDE_DOWN, an.SLIDE_UP],
    },
    {
        text:   ['coolest',      'portfolio',      'ever'],
        in:     [an.SLIDE_RIGHT, an.SLIDE_DOWN,  an.SLIDE_LEFT],
        out:    [an.SLIDE_RIGHT, an.FADE_OUT,    an.SLIDE_LEFT],
    },
    {
        text:   ['tech',         'stack'],
        in:     [an.FADE_IN,       an.FADE_IN],
        out:    [an.SLIDE_RIGHT,   an.SLIDE_LEFT],
    },
    {
        text:   ['7 years',         'experience'],
        in:     [an.FADE_IN,       an.FADE_IN],
        out:    [an.SLIDE_RIGHT,   an.SLIDE_LEFT],
    },
]
let animatedTextContainer = document.getElementsByClassName('animated-text')[0];
let animatedText = new AnimatedText(animatedTextContainer, textList, {
    transitionSpeed: timeControl.animatedTextSpeed,
    swipeDelay: timeControl.animatedTextDelay
});
setTimeout(() => animationFunctions.push(animatedText.play()), timeControl.introDelay);

// Carousel
const images = [
    {src: 'images/carousel/js.png', alt: 'JS'},
    {src: 'images/carousel/frameworks.png', alt: 'frameworks'},
    {src: 'images/carousel/java.png', alt: 'Java'},
    {src: 'images/carousel/spring.png', alt: 'Spring'},
    {src: 'images/carousel/php.png', alt: 'PHP'},
    {src: 'images/carousel/laravel.png', alt: 'Laravel'},
    {src: 'images/carousel/psql.png', alt: 'PostgreSQL'},
    {src: 'images/carousel/mysql.png', alt: 'MySQL'},
];
let carouselDiv = document.getElementById('carousel-div');
let carousel = new Carousel(carouselDiv, images, {
    swipeDelay: timeControl.carouselSwipeDelay,
    transitionSpeed: timeControl.carouselSpeed
});
setTimeout(() => carousel.play(), timeControl.introDelay);

// Path Object
let pathPointsPercents = [ [-2.5, 40], [22.5, 80], [50, 70], [70, 85], [100, 30] ];
let pathPointsPercentsTight = [ [-2.5, 50], [32.5, 80], [65, 80], [100, 50] ];
let path = new Path(ROOT_SVG_ID, pathPointsPercents, {
    control: CURVE_CONTROL(),
    color: '#c9b2a3'
});
path.render()

// Circle Objects
let circles = [
    { iconCode: '&#10031;', path: path, description: {title: 'KinoKond.am', text: 'Project'} },
    { iconCode: '&#10031;', path: path, description: {title: 'loadit.app', text: 'Project'} },
    { iconCode: '&#xf09b;', path: path, description: {title: 'Github', text: 'Latest Projects'} },
    { iconCode: '&#xf08c;', path: path, description: {title: 'LinkedIn', text: ' My Experience'} },
    { iconCode: '&#xf2c6;', path: path, description: {title: 'Telegram', text: 'Contact'} },
];
let circlesGroup = document.createElementNS(SVG_DOC, 'g');
circlesGroup.setAttribute('class', CIRCLE_OBJECTS_GROUP_CLASS);
document.getElementById(ROOT_SVG_ID).appendChild(circlesGroup);
let circleObjects = [];
circles.map((circle, index) => {
    let circleObject = new Circle(circlesGroup, {
        ...circle,
        positionIndex: index,
        fadeSpeed: timeControl.circlesFadeSpeed,
        clickHandler: () => console.log('Circle Clicked')
    });
    circleObject.render();
    circleObjects.push(circleObject);
})



// Initial Animations
setTimeout(() => {
    document.getElementById('animated-path').style.maskPosition = '0px 0px, 0px 300px';
    document.getElementById('animated-path').style.webkitMaskPosition = '0px 0px, 0px 300px';
    setTimeout(() => {
        document.getElementById('animated-path').style.maskPosition = 'top';
        document.getElementById('animated-path').style.webkitMaskPosition = 'top';
    }, timeControl.secondMaskIn)
}, timeControl.fisrtMaskIn);

// Path
setTimeout(() => {
    path.getPathElement().style.clipPath = 'circle(200% at left)';
}, timeControl.pathRenderIn);

// Circles
setTimeout(() => {
    circlesGroup.style.opacity = 1;
}, timeControl.circlesRenderIn);

// Loop Animations
window.circleStep = 1;
setTimeout(() => animationFunctions.push(
    setInterval(() => {
        circleObjects.map(circle => circle.updatePosition(window.circleStep));
    }, timeControl.circlesInterval)
), timeControl.introDelay);

// Carousel
setTimeout(() => {
    animationFunctions.push(carousel.playFunction)
}, 50)

// Listeners
window.addEventListener('resize', () => {
    let control = CURVE_CONTROL();
    window.innerWidth > 768
    ? path.updatePointPercents(pathPointsPercents)
    : path.updatePointPercents(pathPointsPercentsTight)
    path.updateControl(control);
    path.render();
    path.getPathElement().style.clipPath = 'circle(200% at left)';
    circleObjects.map(circleObject => circleObject.updatePosition());
});
