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

const easySignUpSchema = messages => yup.object().shape({
  surname: yup
    .string()
    .trim()
    .min(2, messages.minLength)
    .required(messages.required),
  name: yup
    .string()
    .trim()
    .min(2, messages.minLength)
    .required(messages.required),
  patronymic: yup
    .string()
    .trim()
    .min(2, messages.minLength)
    .required(messages.required),
  birthday: yup
    .string()
    .test('is-date', messages.birthType, (value) => {
      if (!value) return false
      const parsed = Date.parse(value)
      return !isNaN(parsed)
    })
    .test('min-date', messages.birthYear, (value) => {
      return new Date(value) >= new Date(1900, 0, 1)
    })
    .test('max-date', messages.birthYear, (value) => {
      return new Date(value) <= new Date()
    })
    .required(messages.required),
  sex: yup
    .string()
    .oneOf(['M', 'F'], messages.genderError)
    .required(messages.required),
  login: yup
    .string()
    .trim()
    .min(3, messages.loginMessage)
    .max(20, messages.loginMessage)
    .required(messages.required),
  email: yup
    .string()
    .trim()
    .email(messages.emailMessage)
    .test('has-domain', messages.emailMessage, (value) => {
      return /^[^@]+@[^@]+\.[^@]+$/.test(value)
    })
    .required(messages.required),
  password: yup
    .string()
    .trim()
    .min(6, messages.passwordMessage)
    .required(messages.required),
  passwordConfirmation: yup
    .string()
    .trim()
    .required(messages.required)
    .oneOf(
      [yup.ref('password'), null],
      messages.passwordConfirmation,
    ),
})

export {
  loginSchema,
  easySignUpSchema,
  hardSignUpSchema,
}
