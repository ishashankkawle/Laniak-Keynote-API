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
app.use(express.json({ limit: '10mb' }))


//--------------------------------------------------------------------
// HANDLE SOCKET HANG EXCEPTION
//--------------------------------------------------------------------
app.use(function (req, res, next) {
  req.socket.on("error", function () {

  });
  res.socket.on("error", function () {

  });
  next();
});

//--------------------------------------------------------------------
// MAIN ROUTES
//--------------------------------------------------------------------
app.get('/health', async (req, res) => {
  try 
  {
    await appInstance.pool.query("select	count(0) from article_master")
    res.send({ "status": "Online" , "Database" : "Online"})
  }
  catch (e) { 
    res.send({ "status": "Online" , "Database" : "Offline" })
  }
})

app.get('/docs/contents', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    if (req.query.path) {
      res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/tree?path=" + encodeURIComponent(req.query.path), customHeader))
    }
    else {
      res.send(await httpGet(gitlabBaseUrl + "/repository/tree", customHeader))
    }
  } catch (error) {
    console.log(error)
  }
})

app.get('/docs/all', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    if (req.query.path) {
      res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/tree?path=" + encodeURIComponent(req.query.path) + "&recursive=true", customHeader))
    }
    else {
      res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/tree?recursive=true", customHeader))
    }
  } catch (error) {
    console.log(error)
  }
})

app.get('/docs/file', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.query.path) + "/raw", customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.get('/docs/blob', async (req, res) => {
  try {
    res.send({ url: "https://gitlab.com/shashankkawle/DOCS/-/raw/master/_ASSETS/" + encodeURIComponent(req.query.path) })
  } catch (error) {
    console.log(error)
  }
})

app.post('/docs/file', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": req.body.content,
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.put('/docs/file', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": req.body.content,
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    res.send(await appInstance.http.httpPut(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.post('/docs/folder', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": "Welcome to Keynotes",
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "%2FReadMe.md?branch=master", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.post('/docs/blob', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": req.body.content,
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/_ASSETS%2F" + encodeURIComponent(req.body.filePath) + "?branch=master&encoding=base64", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.post('/docs/catalog', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": "Welcome to Keynotes",
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }
    let body2 = {
      "content": req.body.content,
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    let output = await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.name) + "%2FReadMe.md?branch=master", body, customHeader)
    console.log(output)
    res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/_DIR_FILES%2F" + encodeURIComponent(req.body.name) + "%2F" + encodeURIComponent(req.body.fileName) + "?branch=master&encoding=base64", body2, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.delete('/docs/file', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }
    res.send(await appInstance.http.httpDelete(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(req.body.filePath) + "?branch=master", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.get('/articles/gallary', async (req, res) => {
  try {
    let data = await appInstance.pool.query("select	* from article_master order by TO_DATE(datecreated , 'DD-MM-YYYY') desc")
    return res.status(200).json(data.rows)
  } catch (error) {
    console.log(error)
  }
})

app.post('/articles', async (req, res) => {
  try {
    let data = await appInstance.article.createNewArticle(req);
    res.send(data);
  } catch (error) {
    console.log(error)
  }
})

app.get('/articles/summary', async (req, res) => {
  try {
    let data = await appInstance.pool.query("select	* from article_master where id = $1", [req.query.id])
    return res.status(200).json(data.rows[0])
  } catch (error) {
    console.log(error)
  }
})

app.put('/articles/likes', async (req, res) => {
  try {
    let data = await appInstance.pool.query("update article_master set likes = ((select likes from article_master where id = $1) :: numeric  + 1) :: text  where id = $1 RETURNING *", [req.body.id])
    return res.status(200).json(data.rows[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/articles/file', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    const filePath = appInstance.resources.articleRootFolder + "/" + req.query.path
    res.send(await appInstance.http.httpGet(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(filePath) + "/raw", customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.put('/articles/file', async (req, res) => {
  try {

    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": req.body.content,
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    const filePath = appInstance.resources.articleRootFolder + "/" + req.body.filePath

    res.send(await appInstance.http.httpPut(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(filePath) + "?branch=master", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.post('/articles/blob', async (req, res) => {
  try {
    let customHeader = { "PRIVATE-TOKEN": "glpat-xG6KXqNybtRAVdhd1pyM", "Connection": "close" }
    let body = {
      "content": req.body.content,
      "commit_message": req.body.commitMessage,
      "author_name": req.body.authorName,
      "author_email": req.body.authorEmail
    }

    const filePath = appInstance.resources.articleAssetsFolder + "/" + req.body.filePath

    res.send(await appInstance.http.httpPost(gitlabBaseUrl + "/repository/files/" + encodeURIComponent(filePath) + "?branch=master&encoding=base64", body, customHeader))
  } catch (error) {
    console.log(error)
  }
})

app.delete('/articles/file', async (req, res) => {
  try {
    let data = await appInstance.article.deleteArticle(req);
    res.send(data);
  } catch (error) {
    console.log(error)
  }
})

//--------------------------------------------------------------------
// POST REQUEST MIDDLEWARES
// 1. 404 - NOT FOUND
// 2. 500 - INTERNAL SERVER ERROR
//--------------------------------------------------------------------

// 404 - Not Found
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route' + req.url + ' Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});