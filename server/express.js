import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import mediaRoutes from './routes/media.routes'

// modules for server side rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import StaticRouter from 'react-router-dom/StaticRouter'

import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from 'material-ui/styles'
import { red, brown } from 'material-ui/colors'
//end

//For SSR with data
import { matchRoutes } from 'react-router-config'
import routes from './../client/routeConfig'
import 'isomorphic-fetch'
//end

//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
devBundle.compile(app)

//For SSR with data
const loadBranchData = (location) => {
  const branch = matchRoutes(routes, location)
  const promises = branch.map(({ route, match }) => {
    return route.loadData
      ? route.loadData(branch[0].match.params)
      : Promise.resolve(null)
  })
  return Promise.all(promises)
}

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', mediaRoutes)

app.get('*', (req, res) => {
   const sheetsRegistry = new SheetsRegistry()
   const theme = createMuiTheme({
      palette: {
      primary: {
        light: '#f05545',
        main: '#b71c1c',
        dark: '#7f0000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#fbfffc',
        main: '#c8e6c9',
        dark: '#97b498',
        contrastText: '#37474f',
      },
        openTitle: red['500'],
        protectedTitle: brown['300'],
        type: 'light'
      },
    })
   const generateClassName = createGenerateClassName()
   const context = {}
   loadBranchData(req.url).then(data => {
       const markup = ReactDOMServer.renderToString(
         <StaticRouter location={req.url} context={context}>
             <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                  <MainRouter data={data}/>
                </MuiThemeProvider>
             </JssProvider>
          </StaticRouter>
        )
       if (context.url) {
        return res.redirect(303, context.url)
       }
       const css = sheetsRegistry.toString()
       res.status(200).send(Template({
          markup: markup,
          css: css
       }))
   }).catch(err => {
      res.status(500).send({"error": "Could not load React view with data"})
  })
})

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }
})

export default app
