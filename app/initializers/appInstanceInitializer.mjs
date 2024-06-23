import "./envInitializer.mjs"
import { resources } from "../public/resources.mjs";
import ArticleController from "../controllers/article_controller.mjs";
import httpHandler from "../core/httpHandler.mjs";
import Util from "../core/util.mjs";
import {pool} from "./databasePoolInitializer.mjs"

class AppInstance
{
    constructor()
    {
        if(AppInstance. instance)
        {
            console.log("Old App Instance Returned")
            return AppInstance.instance
        }

        console.log("New App Instance Created")
        AppInstance.instance = this;
        this.pool = pool;
        this.http = new httpHandler();
        this.article = new ArticleController();
        this.util = new Util();
        this.resources = resources;
    }
}

export default AppInstance;