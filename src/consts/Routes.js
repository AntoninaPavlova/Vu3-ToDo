// Здесь я бы сделал следующим образом
// Сделал бы отдельную папку в routes
// /src/consts/routes
// И туда бы добавил код ниже.
// Также думаю что тут лучше использовать именнованный экспорт, а не дефолтный
// Так как по всему приложению ты используешь вот такой импорт
//  import {something} from "some-module"; // именованный

// а не import something from "someModule" // дефолтный

const Routes = {
  START: {
    name: 'Start',
    path: '/',
    meta: {
      title: 'Start',
    },
  },
};

export default Routes;