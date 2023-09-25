// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //Product.#list.length + 1
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProdut = new Product(...data)

    this.#list.push(newProdut)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    // фільтруємо щоб вилучити той з яким порівнюємо
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    // sort and mix
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    // return first 3 elements
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43V31) AMD Ryzen 5 3600`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 Гб / HDD 1 TБ + SSD 480 ГБ`,
  [
    { id: 1, text: 'Готовий  до відправки' },
    { id: 2, text: 'Топ продаж' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ProLine Business (B112p19) Intel Core i5 9400F`,
  `Intel Core i5 9400F (2.9 - 4.1 ГГц) / RAM 8 Гб / HDD 1 TБ / Intel UHD Graphics 630`,
  [{ id: 2, text: 'Топ продаж' }],
  20000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Proline Workstation (W67p03) Intel Xeon E-2226G`,
  `Intel Xeon E-2226G (3.4 - 4.7 ГГц) / RAM 16 Гб / SSD 512 ГБ / nVidia Quadro P620`,
  [{ id: 1, text: 'Готовий  до відправки' }],
  40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse() ///.map(({...}) => {...})
  }

  static getById = (id) => {
    return this.#list.find((purchase) => purchase.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}
// Добавимо пару покупок для данних
Purchase.add(
  {
    firstname: 'John',
    lastname: 'Doe',
    phone: '1234567890',
    email: 'john@example.com',
    totalPrice: 2500,
    productPrice: 400,
    deliveryPrice: 100,
    amount: 2,
  },
  Product.getById(1),
)

Purchase.add(
  {
    firstname: 'John',
    lastname: 'Doe',
    phone: '1234567890',
    email: 'john@example.com',
    totalPrice: 1500,
    productPrice: 400,
    deliveryPrice: 100,
    amount: 1,
  },
  Product.getById(2),
)

console.log(Purchase.getList())

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALES25', 0.75)

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
})

//
// ================================================================

router.get('/', function (req, res) {
  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/test-path',
    },
  })
})

// ================================================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такої кількості товару нема в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

// ================================================================

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body
  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній кількості',
        link: '/purchase-list',
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Заповнить обов'язкові поля`,
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/purchase-list', function (req, res) {
  const orderList = Purchase.getList().map((purchase) => {
    return {
      id: purchase.id,
      productTitle: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: purchase.bonus,
    }
  })
  //console.log(orderList)

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: orderList,
    },
  })
})

// ================================================================
router.get('/purchase-details', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-details', {
    style: 'purchase-details',
    data: {
      purchase: Purchase.getById(id),
    },
  })
})
// ================================================================

router.get('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const purchaseItem = Purchase.getById(id)
  console.log(
    'purchaseItem from get',
    purchaseItem,
    purchaseItem.firstname,
  )

  // if (!purchaseItem) {
  //   return res.render('alert', {
  //     style: 'alert',
  //     data: {
  //       message: 'Помилка',
  //       info: 'Заказ не знайдено',
  //       link: '/purchase-list',
  //     },
  //   })
  // }

  res.render('purchase-update', {
    style: 'purchase-update',

    data: {
      id: purchaseItem.id,
      firstname: purchaseItem.firstname,
      lastname: purchaseItem.lastname,
      email: purchaseItem.email,
      phone: purchaseItem.phone,
    },
  })

  let { firstname, lastname, email, phone } = req.body

  // if (!firstname || !lastname || !email || !phone) {
  //   return res.render('alert', {
  //     style: 'alert',
  //     data: {
  //       message: `Заповнить обов'язкові поля`,
  //       info: 'Некоректні дані',
  //       link: '/purchase-list',
  //     },
  //   })
  // }

  // ↙️ cюди вводимо назву файлу з сontainer
  // res.render('alert', {
  //   // вказуємо назву папки контейнера, в якій знаходяться наші стилі
  //   style: 'alert',

  //   data: {
  //     message: 'Успішно',
  //     info: 'Замовлення створено',
  //     link: `/purchase-list`,
  //   },
  // })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const purchaseItem = Purchase.getById(id)
  console.log(
    'purchaseItem from POST',
    purchaseItem,
    purchaseItem.id,
  )

  if (!purchaseItem) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Заказ не знайдено',
        link: '/purchase-list',
      },
    })
  }

  res.render('purchase-update', {
    style: 'purchase-update',

    data: {
      id,
      firstname: purchaseItem.firstname,
      lastname: purchaseItem.lastname,
      email: purchaseItem.email,
      phone: purchaseItem.phone,
    },
  })

  // let { firstname, lastname, email, phone } = req.body
  // console.log(firstname, lastname, email, phone)
  // if (!firstname || !lastname || !email || !phone) {
  //   return res.render('alert', {
  //     style: 'alert',
  //     data: {
  //       message: `Заповнить обов'язкові поля`,
  //       info: 'Некоректні дані',
  //       link: '/purchase-list',
  //     },
  //   })
  // } else {
  //   Purchase.updateById(id)
  // }

  // ↙️ cюди вводимо назву файлу з сontainer
  // res.render('alert', {
  //   // вказуємо назву папки контейнера, в якій знаходяться наші стилі
  //   style: 'alert',

  //   data: {
  //     message: 'Успішно',
  //     info: 'Замовлення створено',
  //     link: `/purchase-list`,
  //   },
  // })
  // ↑↑ сюди вводимо JSON дані
})

// ===============================================================

router.post('/purchase-update-submit', function (req, res) {
  const id = Number(req.query.id)

  let { firstname, lastname, phone, email } = req.body

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Заповнить обов'язкові поля`,
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  } else {
    Purchase.updateById(id, {
      firstname,
      lastname,
      phone,
      email,
    })
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      message: 'Успішно',
      info: 'Дані оновлені',
      link: `/purchase-list`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
