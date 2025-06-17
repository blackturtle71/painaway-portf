import * as yup from 'yup'

const loginSchema = message => yup.object().shape({
  username: yup.string().required(message),
  password: yup.string().required(message),
})

// hide text and add params of function for text-errors
const hardSignUpSchema = () => yup.object().shape({
  login: yup
    .string()
    .trim()
    .required('Логин обязателен')
    .matches(
      /^\w{2,16}$/,
      'Логин должен содержать от 2 до 16 символов, только буквы, цифры и нижнее подчеркивание',
    ),
  email: yup
    .string()
  //  .required()
    .email('Неверный формат электронной почты'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=]).{8,}$/,
      'Пароль должен содержать минимум 8 символов, включая одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
    ),
  passwordConfirmation: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf(
      [yup.ref('password'), null],
      'Пароли должны совпадать',
    ),
})

const easySignUpSchema = (nameMessage, passwordMessage, required, equal) => yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(3, nameMessage)
    .max(20, nameMessage)
    .required(required),
  password: yup
    .string()
    .trim()
    .min(6, passwordMessage)
    .required(required),
  passwordConfirmation: yup
    .string()
    .trim()
    .required(required)
    .oneOf(
      [yup.ref('password'), null],
      equal,
    ),
})

export {
  loginSchema,
  easySignUpSchema,
  hardSignUpSchema,
}
