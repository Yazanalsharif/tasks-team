const notFound = async (req, res) => {
    try{
        res.render('Error404');

    }catch(err) {

        res.status(500).send({error:err.message});

    }
}

module.exports = {notFound};