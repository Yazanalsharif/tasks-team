const taskGroupSokcetConnection = async (req, res, next) => {
    const io = req.io;
    try {
        if(io.sockets._events.connection === undefined) {
        io.on('connection', async  (socket) => {
          console.log('connect');
           socket.on('createTask', async (task, callback) => {
               
              if(validator.isEmpty(task, {ignore_whitespace:true})) {
                 return callback('could not create task with empty string');
              }

              const createTask = await tasksGroubs.createTask({task, task_type:1, team_id: _id});
              socket.emit('validTask', task);
           });
           socket.on('disconnect', () => {
            
           })
        })
       
    }
    next();
    } catch(err) {
        next();
    }
   
    
}

