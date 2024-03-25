import express from 'express'
import { httpGet, httpPost, httpPut } from './core/httpHandler.js'
import {pool} from './initializers/databasePoolInitializer.js'

const app = express()
const port = process.env.PORT || 3000;
const gitlabBaseUrl = "https://gitlab.com/api/v4/projects/8300723"
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//--------------------------------------------------------------------
// INITIALIZATION
//--------------------------------------------------------------------
app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
})

//--------------------------------------------------------------------
// MIDDLEWARES
//--------------------------------------------------------------------
app.use(express.json())


//--------------------------------------------------------------------
// HANDLE SOCKET HANG EXCEPTION
//--------------------------------------------------------------------
app.use(function(req, res, next) {
  req.socket.on("error", function() {

  });
  res.socket.on("error", function() {

  });
  next();
});

//--------------------------------------------------------------------
// MAIN ROUTES
//--------------------------------------------------------------------
app.get('/contents', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  if(req.query.path)
  {
    res.send(await httpGet(gitlabBaseUrl + "/repository/tree?path=" + encodeURIComponent(req.query.path) , customHeader))
  }
  else
  {
    res.send(await httpGet(gitlabBaseUrl + "/repository/tree" , customHeader))
  }
})

app.get('/all', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  if(req.query.path)
  {
    res.send(await httpGet(gitlabBaseUrl + "/repository/tree?path=" + encodeURIComponent(req.query.path) + "&recursive=true" , customHeader))
  }
  else
  {
    res.send(await httpGet(gitlabBaseUrl + "/repository/tree?recursive=true" , customHeader))
  }
})

app.get('/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  res.send(await httpGet(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.query.path) + "/raw" , customHeader))
})

app.get('/blob', async (req, res) => 
{
  res.send({url : "https://gitlab.com/shashankkawle/DOCS/-/raw/master/" + req.query.path})
})

app.post('/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  res.send(await httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master" , body , customHeader))
})

app.put('/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }
  
  res.send(await httpPut(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master" , body , customHeader))
})

app.post('/folder', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : "Welcome to Keynotes",
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  res.send(await httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "%2FReadMe.md?branch=master" , body , customHeader))
})

app.post('/blob', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close" }
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  res.send(await httpPost(gitlabBaseUrl + "/repository/files/_ASSETS%2F" + encodeURIComponent(req.body.filePath) + "?branch=master&encoding=base64", body , customHeader))
})

app.post('/catalog' , async(req ,res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : "Welcome to Keynotes",
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }
  let body2 = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  let output = await httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.name) + "%2FReadMe.md?branch=master" , body , customHeader)
  console.log(output)
  res.send(await httpPost(gitlabBaseUrl + "/repository/files/_DIR_FILES%2F"  + encodeURIComponent(req.body.name) + "%2F" + encodeURIComponent(req.body.fileName) + "?branch=master&encoding=base64", body2 , customHeader))
})


app.get('/gallary' , async(req , res) => 
{
  let data = await pool.query("select	* from article_master order by dateupdated desc")
  return res.status(200).json(data.rows)
})


//--------------------------------------------------------------------
// POST REQUEST MIDDLEWARES
// 1. 404 - NOT FOUND
// 2. 500 - INTERNAL SERVER ERROR
//--------------------------------------------------------------------

// 404 - Not Found
app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});

// 500 - Any server error
app.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
});