const taskGroup = require('../modules/tasksGroubs');
const taskEdit = require('../modules/taskEdit.module');

const updateTasks = async (req, res) => {
    const data =  req.body;
    const teamId = req.params.id;
    try{
        if(!req.id) {
            return res.redirect('/');
        }

        //to make sure only who joined group can edit or delete the task 
        const joinedGroup = await taskGroup.joinedGroup(req.id, teamId);
        if(!joinedGroup) {
            return res.redirect('/mytasks');
        }

        if(data.deleteTask) {
            await taskEdit.deleteTask(data.deleteTask, teamId);
        }

        if(data.complete) {
            await taskEdit.changeCompleteTask(data.complete);
        }

        res.redirect('/mytasks/'+teamId);
    }catch(error) {
        res.redirect('/mytasks/'+teamId);
    }
}

module.exports = {updateTasks};