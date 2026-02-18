Vue.component('fst-column', {
    props: {
        cards: [],
        max: Number
    },
    template: `
    <div>
        <h2>First Column</h2>
        <div>
            <h2>Cards</h2>
            <p v-if="!cards.length">There are no cards yet.</p>
            <ul>
              <li v-for="card in cards">
              <p>{{ card.name }}</p>
              </li>
            </ul>
           </div> <card @card-submitted="addCard"></card>
       </div>

    </div>
    `,
    methods: {
        addCard(cardItem) {
            this.cards.push(cardItem)
        }

    }
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
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
         <p>
           <label for="name">Name:</label>
           <input id="name" v-model="name" placeholder="Name">
           <label for="itemCount">Number of options:</label>
         </p>
         <p>
           <label for="options">Options:</label>
           <input id="options" v-model="options" placeholder="Options">
         </p>
         <p>
           <input type="submit" value="Submit"> 
         </p>
    </form>
    `,
    data() {
        return {
            name: null,
            options: [3, 4, 5],
            itemCount: 3,
            newItem: null,
            listItems: [],
            errors: []
        }
    },

    methods:{
        addItem() {
            if (this.newItem && this.listItems.length < this.itemCount) {
                this.listItems.push(this.newItem);
                this.newItem = null;
            }
        },
        onSubmit() {
            if(this.name) {
                let cardItem = {
                    name: this.name,
                    options: this.options
                }
                this.$emit('card-submitted', cardItem)
                this.name = null;
                this.listItems = [];
                this.itemCount = 3;
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(this.listItems.length === 0) {
                    this.errors.push("One option required.")
                }
            }
        }
    }

})
let app = new Vue({
    el: '#app',
    data: {
        fstMax: 3,
        scndMax: 5,
        fstColumnCards: [],
        scndColumnCards: [],
        thdColumnCards: []
    }
})

