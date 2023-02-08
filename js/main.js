let eventBus = new Vue()

Vue.component('create', {
    template: `
    <div class="col text-center">
        <form @submit.prevent="createCard">
            <div class="mb-3">
                <label for="titleCreating" class="form-label">Заголовок</label>
                <input type="text" v-model="title" class="form-control" id="titleCreating">
            </div>
            <div class="mb-3">
                <label for="descriptionCreating" class="form-label">Описание</label>
                <textarea id="descriptionCreating" class="form-control" v-model="description"></textarea>
            </div>
            <div class="mb-3">
                <label for="deadlineCreating" class="form-label">Дэдлайн</label>
                <input id="deadlineCreating" class="form-control" type="date" v-model="deadline">
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-success" @click="createCard">Создать</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            date: null,
            title: null,
            description: null,
            deadline: null,
            id: 0,
            editable: false,
            editDate: '',
            cardReturn: false,
            reason: null,
            completeCard: false
        }
    },
    methods: {
        createCard() {
            let date = new Date()
            let createDate = date.toISOString().substring(0, 10)
            if(this.title && this.description && this.deadline){
                let card = {
                    date: createDate,
                    title: this.title,
                    description: this.description,
                    deadline: this.deadline,
                    id: this.id,
                    editable: this.editable,
                    cardReturn: this.cardReturn,
                    reason: this.reason,
                    completeCard: this.completeCard
                }
                eventBus.$emit('create-card', card)
                this.date = null
                this.title = null
                this.description = null
                this.deadline = null
                this.id += 1
            }
        }
    },
})

Vue.component('cols', {
    template: `
    <div class="row">
        <create></create>
        <div class="col text-center">
            <p>Запланированные задачи</p>
            <div v-for="card in col1" class="border border-dark" draggable="true" @dragstart="startDrag($event, card)">
                <p>Заголовок: {{card.title}}</p>
                <p>Описание: {{card.description}}</p>
                <p>Дата создания: {{card.date}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p>Дата изменения: {{card.editDate}}</p>
                <button type="submit" class="btn btn-outline-primary" @click="enableEditing(card)">Редактировать</button>
                <button type="submit" class="btn btn-outline-danger" @click="deleteCard(card)">Удалить</button>
                <div v-if="card.editable == true">
                    <form @submit.prevent="saveEdit">
                        <div class="mb-3">
                            <label for="titleCreating" class="form-label">Заголовок</label>
                            <input type="text" v-model="newTitle" class="form-control" id="titleCreating">
                        </div>
                        <div class="mb-3">
                            <label for="descriptionCreating" class="form-label">Описание</label>
                            <textarea id="descriptionCreating" class="form-control" v-model="newDescription"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="deadlineCreating" class="form-label">Дэдлайн</label>
                            <input id="deadlineCreating" class="form-control" type="date" v-model="newDeadline">
                        </div>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success" @click="saveEdit(card)">Подтвердить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col text-center" @drop="[onDrop($event), onDropCol2($event)]" @dragenter.prevent @dragover.prevent>
            <p>Задачи в работе</p>
            <div v-for="card in col2" class="border border-dark" draggable="true" @dragstart="startDrag($event, card)">
                <p>Заголовок: {{card.title}}</p>
                <p>Описание: {{card.description}}</p>
                <p>Дата создания: {{card.date}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p>Дата изменения: {{card.editDate}}</p>
                <p v-if="card.reason != ''">Причина возврата: {{card.reason}}</p>
                <div v-if="card.cardReturn == true">
                    <form @submit.prevent="returnReason">
                        <div class="mb-3">
                            <label for="reasonCreating" class="form-label">Причина возврата</label>
                            <input type="text" v-model="newReason" class="form-control" id="reasonCreating">
                        </div>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success" @click="returnReason(card)">Подтвердить</button>
                        </div>
                    </form>
                </div>
                <button type="submit" class="btn btn-outline-primary" @click="enableEditing(card)">Редактировать</button>
                <div v-if="card.editable == true">
                    <form @submit.prevent="saveEdit">
                        <div class="mb-3">
                            <label for="titleCreating" class="form-label">Заголовок</label>
                            <input type="text" v-model="newTitle" class="form-control" id="titleCreating">
                        </div>
                        <div class="mb-3">
                            <label for="descriptionCreating" class="form-label">Описание</label>
                            <textarea id="descriptionCreating" class="form-control" v-model="newDescription"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="deadlineCreating" class="form-label">Дэдлайн</label>
                            <input id="deadlineCreating" class="form-control" type="date" v-model="newDeadline">
                        </div>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success" @click="saveEdit(card)">Подтвердить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col text-center" @drop="onDropCol3($event)" @dragenter.prevent @dragover.prevent>
            <p>Тестирование</p>
            <div v-for="card in col3" class="border border-dark" draggable="true" @dragstart="startDrag($event, card)">
                <p>Заголовок: {{card.title}}</p>
                <p>Описание: {{card.description}}</p>
                <p>Дата создания: {{card.date}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p>Дата изменения: {{card.editDate}}</p>
                <button type="submit" class="btn btn-outline-primary" @click="enableEditing(card)">Редактировать</button>
                <div v-if="card.editable == true">
                    <form @submit.prevent="saveEdit">
                        <div class="mb-3">
                            <label for="titleCreating" class="form-label">Заголовок</label>
                            <input type="text" v-model="newTitle" class="form-control" id="titleCreating">
                        </div>
                        <div class="mb-3">
                            <label for="descriptionCreating" class="form-label">Описание</label>
                            <textarea id="descriptionCreating" class="form-control" v-model="newDescription"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="deadlineCreating" class="form-label">Дэдлайн</label>
                            <input id="deadlineCreating" class="form-control" type="date" v-model="newDeadline">
                        </div>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success" @click="saveEdit(card)">Подтвердить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col text-center" @drop="onDropCol4($event)" @dragenter.prevent @dragover.prevent>
            <p>Выполненные задачи</p>
            <div v-for="card in col4" class="border" v-bind:class="{'border-success': card.completeCard, 'border-danger': !card.completeCard}">
                <p>Заголовок: {{card.title}}</p>
                <p>Описание: {{card.description}}</p>
                <p>Дата создания: {{card.date}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
                <p>Дата изменения: {{card.editDate}}</p>
                <button type="submit" class="btn btn-outline-primary" @click="enableEditing(card)">Редактировать</button>
                <div v-if="card.editable == true">
                    <form @submit.prevent="saveEdit">
                        <div class="mb-3">
                            <label for="titleCreating" class="form-label">Заголовок</label>
                            <input type="text" v-model="newTitle" class="form-control" id="titleCreating">
                        </div>
                        <div class="mb-3">
                            <label for="descriptionCreating" class="form-label">Описание</label>
                            <textarea id="descriptionCreating" class="form-control" v-model="newDescription"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="deadlineCreating" class="form-label">Дэдлайн</label>
                            <input id="deadlineCreating" class="form-control" type="date" v-model="newDeadline">
                        </div>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-success" @click="saveEdit(card)">Подтвердить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>     
    `,
    data() {
        return {
            col1: [],
            col2: [],
            col3: [],
            col4: [],
            newTitle: null,
            newDescription: null,
            newDate: null,
            newDeadline: null,
            newReason: null
        }
    },
    methods: {
        deleteCard(card) {
            let index = this.col1.findIndex(el => el.id === card.id)
            this.col1.splice(index, 1)
        },
        enableEditing(card) {
            card.editable = !card.editable
        },
        saveEdit(card) {
            let date = new Date()
            this.newDate = date.toISOString().substring(0, 10)
            if(this.newTitle && this.newDescription && this.newDeadline && this.newDate) {
                card.title = this.newTitle
                card.description = this.newDescription
                card.deadline = this.newDeadline
                card.editable = false
                card.editDate = this.newDate
            }
            console.log(card.deadline)
            console.log(card.date)
        },
        startDrag(event, card){
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('cardID', card.id)
        },
        onDrop(event) {
            let cardID = event.dataTransfer.getData('cardID')
            cardID = Number(cardID)
            for(let i in this.col1){
                if(this.col1[i].id === cardID){
                    this.col2.push(this.col1[i])
                }
                let index = this.col1.findIndex(el => el.id === this.col1[i].id)
                this.col1.splice(index, 1)
            }
        },
        onDropCol4(event) {
          let cardID = event.dataTransfer.getData('cardID')
          cardID = Number(cardID)
          for(let i in this.col3){
              let createDate = this.col3[i].date.split('-')
              let deadlineDate = this.col3[i].deadline.split('-')
              if(Number(createDate[2]) >= Number(deadlineDate[2])){
                  if(Number(createDate[1]) >= Number(deadlineDate[1])){
                      if(Number(createDate[0]) >= Number(deadlineDate[0])){
                          this.col3[i].completeCard = false
                      } else {
                          this.col3[i].completeCard = true
                      }
                  } else {
                      this.col3[i].completeCard = true
                  }
              } else {
                  this.col3[i].completeCard = true
              }
              console.log(this.col3[i].completeCard)
              if(this.col3[i].id === cardID){
                  this.col4.push(this.col3[i])
              }
              let index = this.col3.findIndex(el => el.id === this.col3[i].id)
              this.col3.splice(index, 1)
          }
        },
        onDropCol3(event) {
            let cardID = event.dataTransfer.getData('cardID')
            cardID = Number(cardID)
            for(let i in this.col2){
                if(this.col2[i].id === cardID){
                    this.col3.push(this.col2[i])
                }
                let index = this.col1.findIndex(el => el.id === this.col2[i].id)
                this.col2.splice(index, 1)
            }
        },
        onDropCol2(event) {
            let cardID = event.dataTransfer.getData('cardID')
            cardID = Number(cardID)
            for(let i in this.col3){
                if(this.col3[i].id === cardID){
                    this.col3[i].cardReturn = true
                    this.col2.push(this.col3[i])
                }
                let index = this.col3.findIndex(el => el.id === this.col3[i].id)
                this.col3.splice(index, 1)
            }
        },
        returnReason(card){
            if(this.newReason){
                card.reason = this.newReason
                card.cardReturn = false
            }
        }
    },
    mounted() {
        eventBus.$on('create-card', card => {
            this.col1.push(card)
        })
    }
})

let app = new Vue({
    el: "#app",
})