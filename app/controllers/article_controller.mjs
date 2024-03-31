import Util from "../core/util.mjs";
import AppInstance from "../initializers/appInstanceInitializer.mjs";

class ArticleController {
    constructor()
    {
        this.appInstance = new AppInstance(); 
    }

    async createNewArticle(req)
    {
        let date = this.appInstance.util.getCurrentDate()
        console.log("Curent date " + date)
        const { name, url , description , content , commitMessage , authorName , authorEmail } = req.body
        await this.appInstance.pool.query("INSERT INTO article_master (id , name, url , author , datecreated , description , authoremail , dateupdated) VALUES ( (SELECT nextval('masterDbSequene')) , $1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING *;" , [name, url, authorName, date , description , authorEmail, date ] , (error) => {
            if (error) {
            throw error
            }
        });

        let customHeader = { "PRIVATE-TOKEN" : "glpat-xG6KXqNybtRAVdhd1pyM" , "Connection" : "close"}
        let body = {
            "content" : content,
            "commit_message" : commitMessage,
            "author_name" : authorName,
            "author_email" : authorEmail
        }
        const filePath = "_ARTICLES/" + name

        return await this.appInstance.http.httpPost(this.appInstance.resources.gitlabBaseUrl + "/repository/files/" + encodeURIComponent(filePath) + "?branch=master" , body , customHeader)
    };
}

export default ArticleController;