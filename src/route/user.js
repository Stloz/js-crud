// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

//todo ============================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      // if (email) {
      //   user.email = email
      // }
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

//todo ============================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

//todo ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створний',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Пошта оновлена' : 'Сталася помилка',
  })
})

//todo ================================================================

//! JS CRUD No2. PRODUCT (create product CRUD)=========================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.description = description
    this.price = price
    this.id = Math.trunc(Math.random() * 100000)
    this.createDate = new Date().toISOString()
  }

  static getList() {
    return this.#list
  }

  static add(product) {
    if (product) {
      this.#list.push(product)
      return true
    }
    return false
  }

  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }

  static updateById(id, data) {
    const product = this.getById(id)

    if (product) {
      if (data.name) {
        product.name = data.name
      }
      if (data.price) {
        product.price = data.price
      }
      if (data.description) {
        product.description = data.description
      }

      return true
    }
    return false
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// 1. Cтворити get endpoint з PATH /product-create який повертиає container/product-create
router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
    info: '',
  })
})

// ================================================================

// 2. Cтворити POST endpoint з PATH /product-create який отримує в req.body дані для оновлення product

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  result = false

  result = Product.add(product)

  res.render('success-alert', {
    style: 'success-alert',
    title: 'Створення товару.',
    alert: result
      ? 'Товар створено успішно!'
      : 'Не вдалося створити товар.',
  })
})

// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  res.render('product-edit', {
    style: 'product-edit',
    name: product.name,
    price: product.price,
    description: product.description,
    ID: id,
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, id, description } = req.body

  Product.getById(id)

  const data = {
    name: name,
    price: price,
    description: description,
  }

  let result = false

  result = Product.updateById(Number(id), data)

  res.render('success-alert', {
    style: 'success-alert',
    href: '/product-list',
    title: 'Редагування товару',
    alert: result
      ? 'Дані товару успішно оновлено! '
      : 'Не вдалося оновити дані товару!',
  })
})

// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query
  let result = false

  result = Product.deleteById(Number(id))

  res.render('success-alert', {
    style: 'success-alert',
    title: 'Видалення товару',
    alert: result
      ? 'Товар успішно видалено!'
      : `Не вдалося видалити товар! `,
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
