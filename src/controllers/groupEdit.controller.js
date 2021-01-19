const userModule = require('../modules/usersModule');
const tasksGroubs = require('../modules/tasksGroubs');
const groupEdit = require('../modules/groupEdit.module');


const getGroupEditPage = async (req, res) => {
    const teamId = req.params.id;
    const user = req.user;
    try{
        if(!user) {
            return res.redirect('/');
         }
         
         const owner = await tasksGroubs.getOwnFromTeam(teamId);
         if(!owner) {
             return res.redirect('/');
         }
         
         if(owner.ownId !== user.id) {
             return res.redirect('/mytasks');
         }

         
         const groups = await tasksGroubs.getGroups(user.id);
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

        if(!req.user){
            return res.redirect('/');
        }
        const user = req.user
        const owner = await tasksGroubs.getOwnFromTeam(teamId);
        
        if(!owner) {
            return res.redirect('/mytasks');
        }

        if(owner.ownId !== user.id) {
            return res.redirect('/mytasks/teamId');
        }

        const newUser = await userModule.findUserByEmail(userEmail);
        if(!newUser) {
            throw new Error('the user you looking for is not exist');
        }

        await groupEdit.insertUserInGroup(newUser.id, teamId);
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

        if(!req.user){
            return res.redirect('/');
        }
        const owner = await tasksGroubs.getOwnFromTeam(teamId);
        
        if(!owner) {
            return res.redirect('/mytasks');
        }

        if(owner.ownId !== req.user.id) {
            return res.redirect('/mytasks/teamId');
        }
        
        const deletedUser = await userModule.findUserByEmail(userEmail);
        
        if(!deletedUser) {
            throw new Error('the user you looking for is not exist');
        }

        if(deletedUser.id === owner.ownId) {
            throw new Error('you can\'t delete the owner if you want to delete all group click delete Group');
        }

        const isJoinedGroup = await tasksGroubs.joinedGroup(deletedUser.id, teamId);

        if(!isJoinedGroup) {
            throw new Error('the user does\'t join the group');
        }

        await groupEdit.deleteUserFromGroup(deletedUser.id, teamId);

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

        if(!req.user){
            return res.redirect('/');
        }

        const owner = await tasksGroubs.getOwnFromTeam(teamId);
        
        if(!owner) {
            return res.redirect('/mytasks');
        }

        if(owner.ownId !== req.user.id) {
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