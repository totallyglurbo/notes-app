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
              <li v-for="(card, index) in cards" :key="index">
                <p><strong>{{ card.name }}</strong></p>
                <ul>
                  <li v-for="(option, index) in card.options" :key="index">{{ option }}</li>
                </ul>
              </li>
            </ul>
           </div> <card v-if="cards.length < 3"@card-submitted="addCard"></card>
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
         </p>
         <div>
          <input v-model="newItem" placeholder="Введите пункт" />
          <button @click.prevent="addItem" :disabled="listItems.length >= 5">Добавить пункт</button>
        </div>
         <ul>
          <li v-for="(item, index) in listItems" :key="index">{{ item }}</li>
        </ul>
         <p>
           <input type="submit" value="Submit"> 
         </p>
    </form>
    `,
    data() {
        return {
            name: null,
            options: [],
            newItem: null,
            listItems: [],
            errors: []
        }
    },

    methods:{
        addItem() {
            if (this.newItem && this.listItems.length < 5) {
                this.listItems.push(this.newItem);
                this.newItem = null;
            }
        },
        onSubmit() {
            this.errors = [];
            if (!this.name) {
                this.errors.push("Name required.");
            }
            if (this.listItems.length < 3) {
                this.errors.push("Please enter at least 3 options.");
            }
            if (this.errors.length === 0) {
                let cardItem = {
                    name: this.name,
                    options: this.listItems
                };
                this.$emit('card-submitted', cardItem);
                this.name = null;
                this.listItems = [];
                this.newItem = null;
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

