Vue.component('fst-column', {
    props: {
        cards: Array,
        max: Number
    },
    template: `
    <div>
        <h2>First Column</h2>
    </div>
    `
})
Vue.component('scnd-column', {
    template: `
    <div>
        <h2>Second Column</h2>
    </div>
    `
})
Vue.component('thd-column', {
    template: `
    <div>
        <h2>Third Column</h2>
    </div>
    `
})
Vue.component('card', {
    template: `
    <div></div>
    `
})
let app = new Vue({
    el: '#app',
    data: {
        fstMax: 3;
        scndMax: 5;
        fstColumnCards: [],
        scndColumnCards: [],
        thdColumnCards: []
    }
})