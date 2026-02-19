Vue.component('fst-column', {
    props: {
        cards: {
            type: Array,
            required: true
        },
      max: {
        type: Number,
        required: true
      },
      disableControls: Boolean
    },
    template: `
    <div>
        <h2>New tasks</h2>
        <div>
            <p v-if="!cards.length" class="noCards">There are no cards yet.</p>
            <ul>
              <li v-for="(card, cIndex) in cards" :key="Date.now()" class="cardName">
                <p><strong>{{ card.name }}</strong></p>
                <ul>
                  <li v-for="(option, oIndex) in card.options" :key="oIndex">
                    <label>
                      <input type="checkbox"
                             v-model="card.checkedOptions[oIndex]"
                             @change="checkCard(cIndex)"
                             :disabled="disableControls">
                      {{ option }}
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
           </div> <card v-if="cards.length < 3 && !disableControls"@card-submitted="addCard"></card>
       </div>

    </div>
    `,
    methods: {
        addCard(cardItem) {
            let checkedOptions = [];
            for (let i = 0; i < cardItem.options.length; i++) {
                checkedOptions.push(false);
            }
            let newCard = {
                name: cardItem.name,
                options: cardItem.options,
                checkedOptions: checkedOptions
            };
            this.cards.push(newCard)
            this.$emit('update-cards', this.cards);
        },
        checkCard(cardIndex) {
            let card = this.cards[cardIndex];
            let checkedCount = 0;
            for (let i = 0; i < card.checkedOptions.length; i++) {
                if (card.checkedOptions[i] === true) {
                    checkedCount++;
                }
            }
            if (checkedCount > card.options.length / 2) {
                this.$emit('move-card-to-second', card);
                this.cards.splice(cardIndex, 1);
            }
            this.$emit('update-cards', this.cards);
        }
    }
})
Vue.component('scnd-column', {
    props: {
        cards: {
          type: Array,
          required: true
        }
    },
    template: `
    <div>
        <h2>Tasks in progress</h2>
        <div v-if="!cards.length" class="noCards">There are no cards yet.</div>
        <ul>
          <li v-for="(card, cIndex) in cards" :key="Date.now()" class="cardName">
            <b>{{ card.name }}</b>
            <ul>
              <li v-for="(option, oIndex) in card.options" :key="oIndex">
                <label>
                  <input type="checkbox" v-model="cards[cIndex].checkedOptions[oIndex]"
                   @change="handleChange(card, cIndex)"/>
                  {{ option }}
                </label>
              </li>
            </ul>
          </li>
        </ul>
    </div>
    `,
    methods: {
        handleChange(card, index) {
          this.$emit('card-checked', card, index);
          this.saveData();
        }
  }
})
Vue.component('thd-column', {
    props: {
        cards: {
          type: Array,
          required: true
        }
    },
    template: `
    <div>
        <h2>Completed tasks</h2>
        <div v-if="!cards.length" class="noCards">There are no cards yet.</div>
          <ul>
            <li v-for="(card, index) in cards" :key="Date.now()" class="cardName">
              <b>{{ card.name }}</b>
              <ul>
                <li v-for="option in card.options">{{ option }}</li>
              </ul>
              {{ card.finishedAt }}
            </li>
          </ul>
    </div>
    `
})
Vue.component('card', {
    template: `
    <form @submit.prevent="onSubmit">
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
          <label for="item">List item:</label>
          <input id="item" v-model="newItem" placeholder="List item" />
          <button @click.prevent="addItem" :disabled="listItems.length >= 5">Add list item</button>
        </div>
         <ul>
          <li v-for="(item, index) in listItems" :key="index">{{ item }}</li>
        </ul>
         <p>
           <input type="submit" value="Submit" class="submit">
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
                this.errors.push("Please enter at least 3 items.");
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
            this.saveData();
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
    },
    computed: {
    fstColumnDisabled() {
      return this.scndColumnCards.length >= 5;
    }
    },
    mounted() {
        const savedFirst = localStorage.getItem('fstColumnCards');
        const savedSecond = localStorage.getItem('scndColumnCards');
        const savedThird = localStorage.getItem('thdColumnCards');
        if (savedFirst) this.fstColumnCards = JSON.parse(savedFirst);
        if (savedSecond) this.scndColumnCards = JSON.parse(savedSecond);
        if (savedThird) this.thdColumnCards = JSON.parse(savedThird);
    },
    methods: {
    saveData() {
        localStorage.setItem('fstColumnCards', JSON.stringify(this.fstColumnCards));
        localStorage.setItem('scndColumnCards', JSON.stringify(this.scndColumnCards));
        localStorage.setItem('thdColumnCards', JSON.stringify(this.thdColumnCards));
    },
    clearAllData() {
        localStorage.removeItem('fstColumnCards');
        localStorage.removeItem('scndColumnCards');
        localStorage.removeItem('thdColumnCards');
        this.fstColumnCards = [];
        this.scndColumnCards = [];
        this.thdColumnCards = [];
    },
    moveCardToSecond(card) {
    if (this.scndColumnCards.length >= 5) {
        return;
    }
      this.scndColumnCards.push(card);
    this.saveData();
    },
    checkCardInSecond(card, index) {
      let allChecked = true;
      for (let i = 0; i < card.checkedOptions.length; i++) {
        if (!card.checkedOptions[i]) {
          allChecked = false;
          break;
        }
      }
      if (allChecked) {
        card.finishedAt = new Date().toLocaleString();
        this.thdColumnCards.push(card);
        this.scndColumnCards.splice(index, 1);
      }
      this.saveData();
    }
  }
})




