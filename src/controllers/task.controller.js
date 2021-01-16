const userModule = require('../modules/usersModule');
const validator = require('validator');
const tasksGroubs = require('../modules/tasksGroubs');
const groupEditModule = require('../modules/groupEdit.module');


const getTaskPage = async (req, res) => {
    try{
        if(!req.id){
            return res.redirect('/');
        }
        
        const user = await userModule.findUserById(req.id);
        const groups = await tasksGroubs.getGroups(req.id);
        
        res.render('tasks', {
            user,
            error:req.flash('err')[0],
            groups
        });
    }catch(err) {
        res.send({error: err.message})
    }
}

const createTaskGroup = async (req, res) => {
    try{
        if(!req.id) {
            return res.redirect('/')
        }
        
        if(validator.isEmpty(req.body.teamName, {ignore_whitespace:true})) {
            throw new Error('the name could not be empty');
        }

        if(!isNaN(req.body.teamName)) {
            throw new Error('the team could not be Number');
        }

        const createGroup = await tasksGroubs.insertGroup({
            teamname:req.body.teamName,
            own:req.id
        });
        res.redirect('/mytasks');
    }catch(err) {
        if(err.message) {
            req.flash('err', err.message);
        } else {
            req.flash('err', err);
        }
       
        res.redirect('/mytasks')
    }
}
//get the tasks group 
const getTaskGroup = async (req, res) => {
    //get id of the team from params
    const _id = req.params.id;
    try{
        const user = await userModule.findUserById(req.id);
        const groups = await tasksGroubs.getGroups(req.id);
        
        if(!req.id) {
            return res.redirect('/mytasks');
        }


        //check if there is releasion between user and team
        const team = await tasksGroubs.joinedGroup(req.id, _id);
        if(team.length === 0) {
            //you have to create page for you are not allwoed to join this team
            return res.redirect('/mytasks');
        }
        //get owner to display in groups
        const owner = await tasksGroubs.getOwnFromTeam(_id);
        
        const uncomplitedTasks = await tasksGroubs.getTasksGroup(req.id, _id, false);
        const complitedTasks = await tasksGroubs.getTasksGroup(req.id, _id, true);
        const usersInGroup = await groupEditModule.getAllUsersFromGroup(_id);
        res.render('taskGroup', {
            usersInGroup,
            user,
            groups,
            owner,
            uncomplitedTasks,
            complitedTasks,
            error: req.flash('err')[0]
        });
        //let io = res.io;
        
    } catch(err) {
        console.log(err);
    }
}

const createNewTask = async (req, res) => {
    const task = req.body.task;
    const teamId = req.params.id;
    try {

        if(!req.id) {
            return redirect('/');
        }
        if(validator.isEmpty(task, {ignore_whitespace: true})){
           throw new Error('the task can\'t be empty');
        }
        const insertedId = await tasksGroubs.createTask({task, task_type: 1, team_id:teamId});
        res.redirect('/mytasks/'+teamId);
        
    }catch(error) {


        if(error.message) {
            req.flash('err', error.message);
        } else {
            req.flash('err', error);
        }


        res.redirect('/mytasks/'+teamId);
    }
}

module.exports = {getTaskPage, createTaskGroup, getTaskGroup, createNewTask};