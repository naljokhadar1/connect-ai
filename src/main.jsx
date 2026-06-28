/* Connect AI — Vite entry point */

// CSS
import '../project/css/app.css'
import '../project/css/job-creation.css'
import '../project/css/candidate-profile.css'

// Data files — these are IIFEs that assign to window.DATA, window.t, etc.
import '../project/js/i18n.js'
import '../project/js/data.js'
import '../project/js/data-workflows.js'
import '../project/js/data-templates.js'
import '../project/js/job-creation-data.js'
import '../project/js/candidate-profile-data.js'
import '../project/js/assessment-preview-data.js'
import '../project/js/data-assessments.js'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

// The original prototype used React as a CDN global; expose it for all component files
window.React = React

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
