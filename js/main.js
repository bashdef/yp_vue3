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
            editable: false
        }
    },
    methods: {
        createCard() {
            let date = new Date()
            this.date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
            if(this.title && this.date && this.description && this.deadline){
                let card = {
                    date: this.date,
                    title: this.title,
                    description: this.description,
                    deadline: this.deadline,
                    id: this.id,
                    editable: this.editable
                }
                eventBus.$emit('create-card', card)
                this.date = null
                this.title = null
                this.description = null
                this.deadline = null
                this.id += 1
            }
        }
    }
})

Vue.component('cols', {
    template: `
    <div class="row">
        <create></create>
        <div class="col text-center">
            <p>Запланированные задачи</p>
            <div v-for="card in col1" class="border border-dark">
                <p>Заголовок: {{card.title}}</p>
                <p>Описание: {{card.description}}</p>
                <p>Дата создания: {{card.date}}</p>
                <p>Дэдлайн: {{card.deadline}}</p>
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
        <div class="col text-center">
            <p>Задачи в работе</p>
        </div>
        <div class="col text-center">
            <p>Тестирование</p>
        </div>
        <div class="col text-center">
            <p>Выполненные задачи</p>
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
            newDeadline: null
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
            this.newDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
            if(this.newTitle && this.newDescription && this.newDeadline && this.newDate) {
                card.title = this.newTitle
                card.description = this.newDescription
                card.date = this.newDate
                card.deadline = this.newDeadline
                card.editable = false
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