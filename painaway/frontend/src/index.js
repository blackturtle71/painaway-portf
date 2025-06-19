import './styles'

import ReactDOM from 'react-dom/client'
import initApp from './main'

const mountNode = document.getElementById('root')
const root = ReactDOM.createRoot(mountNode)

root.render(initApp())
