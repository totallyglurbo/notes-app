Vue.component('fst-column', {
    props: {
      max: {
        type: Number,
        required: true
      },
      disableControls: Boolean
    },
    template: `
    <div>
        <h2>First Column</h2>
        <div>
            <h2>Cards</h2>
            <p v-if="!cards.length">There are no cards yet.</p>
            <ul>
              <li v-for="(card, cIndex) in cards" :key="cIndex">
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
    data() {
      return {
        cards: []
      }
    },
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
        <h2>Second Column</h2>
        <div v-if="!cards.length">No cards yet.</div>
        <ul>
          <li v-for="(card, cIndex) in cards" :key="cIndex">
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
        <h2>Third Column</h2>
        <div v-if="!cards.length">No cards yet.</div>
          <ul>
            <li v-for="(card, index) in cards" :key="index">
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
    },
    computed: {
    fstColumnDisabled() {
      return this.scndColumnCards.length >= 5;
    }
    },
    methods: {
    moveCardToSecond(card) {
    if (this.scndColumnCards.length >= 5) {
        return;
    }
      this.scndColumnCards.push(card);
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
    }
  }
})

