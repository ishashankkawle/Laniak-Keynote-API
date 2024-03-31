import express from 'express'
import AppInstance from './initializers/appInstanceInitializer.mjs'

const app = express()
const port = process.env.PORT || 3000;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const appInstance = new AppInstance()
const gitlabBaseUrl = appInstance.resources.gitlabBaseUrl;

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
app.get('/docs/contents', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  if(req.query.path)
  {
    res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/tree?path=" + encodeURIComponent(req.query.path) , customHeader))
  }
  else
  {
    res.send(await httpGet(gitlabBaseUrl + "/repository/tree" , customHeader))
  }
})

app.get('/docs/all', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  if(req.query.path)
  {
    res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/tree?path=" + encodeURIComponent(req.query.path) + "&recursive=true" , customHeader))
  }
  else
  {
    res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/tree?recursive=true" , customHeader))
  }
})

app.get('/docs/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.query.path) + "/raw" , customHeader))
})

app.get('/docs/blob', async (req, res) => 
{
  res.send({url : "https://gitlab.com/shashankkawle/DOCS/-/raw/master/_ASSETS/" + req.query.path})
})

app.post('/docs/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master" , body , customHeader))
})

app.put('/docs/file', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }
  
  res.send(await appInstance.http.httpPut(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master" , body , customHeader))
})

app.post('/docs/folder', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
  let body = {
    "content" : "Welcome to Keynotes",
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "%2FReadMe.md?branch=master" , body , customHeader))
})

app.post('/docs/blob', async (req, res) => 
{
  let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close" }
  let body = {
    "content" : req.body.content,
    "commit_message" : req.body.commitMessage,
    "author_name" : req.body.authorName,
    "author_email" : req.body.authorEmail
  }

  res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/_ASSETS%2F" + encodeURIComponent(req.body.filePath) + "?branch=master&encoding=base64", body , customHeader))
})

app.post('/docs/catalog' , async(req ,res) => 
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

  let output = await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.name) + "%2FReadMe.md?branch=master" , body , customHeader)
  console.log(output)
  res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/_DIR_FILES%2F"  + encodeURIComponent(req.body.name) + "%2F" + encodeURIComponent(req.body.fileName) + "?branch=master&encoding=base64", body2 , customHeader))
})

app.get('/article/gallary' , async(req , res) => 
{
  let data = await appInstance.pool.query("select	* from article_master order by dateupdated desc")
  return res.status(200).json(data.rows)
})

app.post('/article' , async (req, res) => 
{ 
  let data = await appInstance.article.createNewArticle(req);
  res.send(data);
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