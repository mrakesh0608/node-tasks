//Chalk -Start
const chalk = require('chalk');
const DoneC = chalk.bgGreen.black;
const titleC = chalk.bgYellow.black;
const listC = chalk.bgBlue.black;
//Chalk -End

//MongoDB-Start
const mongoose = require('mongoose')
function DBConnect()
{
    return new Promise((resolve,reject)=>{
        
        const dbURI = "mongodb+srv://mrakesh0608:mydb123@cluster0.u0jcl.mongodb.net/Node-Tasks?retryWrites=true&w=majority";

        mongoose.connect(dbURI)
        .then( (result) => resolve(result))
        .catch( (err)=> reject(err));
    })
}
//MongoDB-End

//Importing-DB-Model-Task
const Task = require('./models/task');

//Display Task-Start
function DisplayTask(result)
{
    for(i=0;i<result.length;i++)
    {
        console.log(titleC("Task : "+result[i].title))
        console.log("Task ID : "+result[i]._id);
        console.log("Completed : "+result[i].completed);
        console.log("Description : "+result[i].desc);
        console.log("");
    }
}
//Display Task-End

//Commands-Start
const yarg = require('yargs');

yarg.command({
	command: 'create',
	describe: 'create a new task',
	builder: {
		title: {
			describe: 'Title of Task',
			demandOption: true,
			type: 'string'	
		},
		desc: {
			describe: 'Description of Task',
			demandOption: true,
			type: 'string'
		},
        	completed: {
			describe: 'status',
			type: 'boolean'
		}
	},
	handler(argv) 
    	{
		if(argv.completed == undefined) argv.completed = false;

		const task = new Task({
		    title : argv.title,
		    desc : argv.desc,
		    completed : argv.completed
		})

		DBConnect()
		.then(()=>{
		    task.save()
		    .then(()=>{
			console.log(DoneC("\nTask Created"));
		    })
		    .then(()=>{
			mongoose.connection.close();
		    })
		})
		.catch((err)=> console.log(err))
	}
});

yarg.command({
	command: 'read',
	describe: 'read tasks',
	builder: {},
	handler(argv) 
    	{ 
		DBConnect()
		.then(()=>{
		    Task.find({completed: false})
		    .then((result)=>{
			console.log(listC("\nNot completed tasks\n"));
			DisplayTask(result);
		    })
		    .then(()=>{
			mongoose.connection.close();
		    })
		})
		.catch((err)=> console.log(err))
	}
});

yarg.command({
	command: 'update',
	describe: 'update task as completed task',
	builder: {
        id: {
		describe: 'Task id',
		demandOption: true,
		type: 'string'	
	    }
    	},
	handler(argv) 
    	{ 
		DBConnect()
		.then(()=>{
		    Task.findByIdAndUpdate({_id:argv.id},{completed: true})
		    .then((result)=>{
			console.log(DoneC("Task Updated"));
		    })
		    .then(()=>{
			mongoose.connection.close();
		    })
		})
		.catch((err)=> console.log(err))
	}
});

yarg.command({
	command: 'delete',
	describe: 'delete a task using its Task ID',
	builder: {
        id: {
		describe: 'Task id',
		demandOption: true,
		type: 'string'	
	    }
    	},
	handler(argv) 
    	{ 
		DBConnect()
		.then(()=>{
		    Task.findByIdAndRemove({_id:argv.id})
		    .then((result)=>{
			console.log(DoneC("Task Deleted"));
		    })
		    .then(()=>{
			mongoose.connection.close();
		    })
		})
		.catch((err)=> console.log(err))
	}
});

yarg.command({
	command: 'readCompleted',
	describe: 'read tasks',
	builder: {},
	handler(argv) 
    	{ 
		DBConnect()
		.then(()=>{
		    Task.find({completed: true})
		    .then((result)=>{
			console.log(listC("\nCompleted tasks\n"));
			DisplayTask(result);
		    })
		    .then(()=>{
			mongoose.connection.close();
		    })
		})
		.catch((err)=> console.log(err))
	}
});

yarg.parse()
//Commands -End
