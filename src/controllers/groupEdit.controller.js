const userModule = require('../modules/usersModule');
const tasksGroubs = require('../modules/tasksGroubs');
const groupEdit = require('../modules/groupEdit.module');


const getGroupEditPage = async (req, res) => {
    const teamId = req.params.id;
    const userId = req.id;
    try{
        if(!userId) {
            return res.redirect('/');
         }
         
         const owner = await tasksGroubs.getOwnFromTeam(teamId);
         if(!owner) {
             return res.redirect('/');
         }
         
         if(owner.ownId !== userId) {
             return res.redirect('/mytasks');
         }
         const user = await userModule.findUserById(req.id);
         const groups = await tasksGroubs.getGroups(req.id);
         const usersInGroup  = await groupEdit.getAllUsersFromGroup(teamId);
         res.render('groupEdit', {
             error: req.flash('error')[0],
             owner,
             user,
             groups,
             usersInGroup
         });
        
    }catch(err) {
       res.status(404).send({err: err.message});
    }
}

const addUserToGroup = async (req, res) => {
    const teamId = req.params.id;
    const userEmail = req.body.email;
    try{

        if(!req.id){
            return res.redirect('/');
        }

        const owner = await tasksGroubs.getOwnFromTeam(teamId);
        
        if(!owner) {
            return res.redirect('/mytasks');
        }

        if(owner.ownId !== req.id) {
            return res.redirect('/mytasks/teamId');
        }

        const user = await userModule.findUserByEmail(userEmail);
        
        if(!user) {
            throw new Error('the user you looking for is not exist');
        }

        const userJoined = await groupEdit.insertUserInGroup(user.id, teamId);
        res.redirect(`/mytasks/${teamId}/edit`);
    }catch(err) {
        if(err.message) {
            req.flash('error', err.message);
        }else {
            req.flash('error', err);
        }

        res.redirect(`/mytasks/${teamId}/edit`);
    }

}

const deleteUserFromGroup = async (req, res) => {
    const teamId = req.params.id;
    const userEmail = req.body.email;
    try{

        if(!req.id){
            return res.redirect('/');
        }

        const owner = await tasksGroubs.getOwnFromTeam(teamId);
        
        if(!owner) {
            return res.redirect('/mytasks');
        }

        if(owner.ownId !== req.id) {
            return res.redirect('/mytasks/teamId');
        }
        
        const user = await userModule.findUserByEmail(userEmail);
        
        if(!user) {
            throw new Error('the user you looking for is not exist');
        }

        if(user.id === owner.ownId) {
            throw new Error('you can\'t delete the owner if you want to delete all group click delete Group');
        }

        const isJoinedGroup = await tasksGroubs.joinedGroup(user.id, teamId);

        if(!isJoinedGroup) {
            throw new Error('the user did\'t joined the group');
        }

        await groupEdit.deleteUserFromGroup(user.id, teamId);

        res.redirect(`/mytasks/${teamId}/edit`);

    }catch(err) {
        if(err.message) {
            req.flash('error', err.message);
        }else {
            req.flash('error', err);
        }

        res.redirect(`/mytasks/${teamId}/edit`);
    }

}

const updateName = async (req, res) => {
    const teamId = req.params.id;
    const groupName = req.body.groupName;
    try{

        if(!req.id){
            return res.redirect('/');
        }

        const owner = await tasksGroubs.getOwnFromTeam(teamId);
        
        if(!owner) {
            return res.redirect('/mytasks');
        }

        if(owner.ownId !== req.id) {
            return res.redirect('/mytasks/teamId');
        }

        await groupEdit.updateGroupName(groupName, teamId);

        res.redirect(`/mytasks/${teamId}/edit`);

    }catch(err) {
        if(err.message) {
            req.flash('error', err.message);
        }else {
            req.flash('error', err);
        }

        res.redirect(`/mytasks/${teamId}/edit`);
    }

}



module.exports = {
    getGroupEditPage,
    addUserToGroup,
    deleteUserFromGroup,
    updateName
}