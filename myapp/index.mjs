import express from 'express'
import { httpGet, httpPost, httpPut } from './httpHandler.js'

const app = express()
const port = 3000
const gitlabBaseUrl = "https://gitlab.com/api/v4/projects/8300723"
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
})

app.use(express.json())

//--------------------------------------------------------------------
// HANDLE SOCKET HJANG EXCEPTION
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
    "commit_message" : req.body.commitMessage
  }

  res.send(await httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master" , body , customHeader))
})

app.put('/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage
  }
  
  res.send(await httpPut(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master" , body , customHeader))
})

app.post('/folder', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : "Welcome to Keynotes",
    "commit_message" : req.body.commitMessage
  }

  res.send(await httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "%2FReadMe.md?branch=master" , body , customHeader))
})

app.post('/blob', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close" }
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage
  }

  res.send(await httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master&encoding=base64", body , customHeader))
})