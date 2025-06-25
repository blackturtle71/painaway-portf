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
  birthDay: yup
    .number()
    .typeError(messages.birthType)
    .min(1, messages.birthDay)
    .max(31, messages.birthDay)
    .required(messages.required),
  birthMonth: yup
    .number()
    .typeError(messages.birthError)
    .min(1, messages.birthMonth)
    .max(12, messages.birthMonth)
    .required(messages.required),
  birthYear: yup
    .number()
    .typeError(messages.birthError)
    .min(1900, messages.birthDay)
    .max(new Date().getFullYear())
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
