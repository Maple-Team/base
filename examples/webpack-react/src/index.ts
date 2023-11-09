// @ts-expect-error: xx
window.module_federationUrl = 'http://localhost:3002'

// Use dynamic import here to allow webpack to interface with module federation code
import('./bootstrap')
