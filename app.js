/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);
var qnaKnowledgebaseId = null;
var qnaSubscriptionKey = null;

var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
                knowledgeBaseId: process.env.QnAKnowledgebaseId, 
    subscriptionKey: process.env.QnASubscriptionKey});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
                defaultMessage: 'No match! Try changing the query terms!',
                qnaThreshold: 0.3}
);


// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, [
    function (session) {
        qnaKnowledgebaseId = process.env.QnAKnowledgebaseId;
        qnaSubscriptionKey = process.env.QnASubscriptionKey;
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        {
            session.send("Welcome to a short quiz to test your knowledge.");
            session.beginDialog('preciousMetal');
        }
        else
        {
            session.replaceDialog('basicQnAMakerDialog');
        }
    },
    function (session, results) {
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        {
            if(results.response.entity == "Gold")
            {
                userScore = userScore + quizScore;
                session.send("Correct!");
            }
            else
            {
                session.send("Incorrect. The right answer is Gold.");
            }
            session.beginDialog('desertAnimal');
        }
        else
        {
            session.replaceDialog('basicQnAMakerDialog');
        }
    },
    function (session, results) {
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        {
            if(results.response.entity == "Camel")
            {
                userScore = userScore + quizScore;
                session.send("Correct!");
            }
            else
            {
                session.send("Incorrect. The right answer is Camel.");
            }
            session.beginDialog('planet');
        }
        else
        {
            session.replaceDialog('basicQnAMakerDialog');
        }
    },
    function (session, results) {
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        {
            if(results.response.entity == "Sun")
            {
                userScore = userScore + quizScore;
                session.send("Correct!");
            }
            else
            {
                session.send("Incorrect. The right answer is Sun.");
            }
            session.beginDialog('fastestAnimal');
        }
        else
        {
            session.replaceDialog('basicQnAMakerDialog');
        }
    },
    function (session, results) {
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        {
            if(results.response.entity == "Cheetah")
            {
                userScore = userScore + quizScore;
                session.send("Correct!");
            }
            else
            {
                session.send("Incorrect. The right answer is Cheetah.");
            }
            session.beginDialog('sensitiveOrgan');
        }
        else
        {
            session.replaceDialog('basicQnAMakerDialog');
        }
    },
    function (session, results) {
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        {
            if(results.response.entity == "Skin")
            {
                userScore =  userScore + quizScore;
                session.dialogData.score = userScore;
                session.send("Correct!");
            }
            else
            {
                session.send("Incorrect. The right answer is Skin.");
            }
            // Process request and display reservation details
            session.send('You gain ' + userScore + " points. Click here to register your score https://dev.projectcog.com/Demo/skypebot/congraz.php?score=" + userScore + ".");
            session.endDialog();
        }
        else
        {
            session.replaceDialog('basicQnAMakerDialog');
        }
    }
]);
bot.set('storage', tableStorage);

bot.dialog('basicQnAMakerDialog', basicQnAMakerDialog);

/*bot.dialog('/', //basicQnAMakerDialog);
[
    /*function (session){
        var qnaKnowledgebaseId = process.env.QnAKnowledgebaseId;
        var qnaSubscriptionKey = process.env.QnASubscriptionKey;
        var txt = session.message.text;
        
        // QnA Subscription Key and KnowledgeBase Id null verification
        if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
            session.send('This is a test for Projectcog\'s Skype Bot app.');
            //if(txt == "foo")
            //{
            //    session.send('bar');
            //}
        else
            session.replaceDialog('basicQnAMakerDialog');
    }*/
//]);


bot.dialog("preciousMetal",[
    function (session) {
        builder.Prompts.choice(session, "Which is the heavier metal?", ["Silver","Gold","Bronze"], { listStyle: 3 }); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog("desertAnimal",[
    function (session) {
        builder.Prompts.choice(session, "Which is the animal referred as the ship of the desert?", ["Camel","Snake","Rat", "Scorpion"], { listStyle: 3 }); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog("planet",[
    function (session) {
        builder.Prompts.choice(session, "Which is the nearest star to planet earth?", ["Mercury","Saturn","Venus", "Sun"], { listStyle: 3 }); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog("fastestAnimal",[
    function (session) {
        builder.Prompts.choice(session, "Which is the fastest animal on the land?", ["Dog","Deer","Cheetah", "Mouse"], { listStyle: 3 }); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog("sensitiveOrgan",[
    function (session) {
        builder.Prompts.choice(session, "Which is the most sensitive organ in our body?", ["Heart","Skin","Brain", "Eyes"], { listStyle: 3 }); 
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);