const ResourceDB = require("../../../models/resources_schema");


// Post a Ebook Resource
exports.post_ebook = (req,res) => {
    // Validate Request
    if(!req.body)
    {
        console.log(req.body);
        res.status(400).send({ message : "Content cannot be empty!"});
        return;
    }

    // Check if content type is Video
    if(req.body.Resource_Type != "Ebook")
    {
        res.status(400).send({ message : "Content type should be Ebook!"});
        return;
    }

    //New Resource
    let time = new Date();
    const new_resource = new ResourceDB({
        Url: req.body.Url,
        Subject_Code : req.body.Subject_Code,
        Message : req.body.Message,
        Post_time : time,
        Resource_Type : req.body.Resource_Type,
    })

    new_resource.save(new_resource)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message : err.message || "Some error occurred while creating a create operation"
        });
    });
};


// Get all Ebook resources or a specific one
exports.find_ebook = (req,res) => {
    if(req.query.id)
    {   
        const id = req.query.id;
        ResourceDB.findById(id)
            .then(data => {
                if(!data)
                {
                    res.status(404).send({ message : "No resource found with id "+ id});
                }
                else
                {
                    if(data.Resource_Type != "Ebook")
                    {   
                        res.status(400).send({ message : "Content type should be Ebook!"});
                        return;
                    }   
                    res.send(data);
                }
            });
    }
    else
    {
        ResourceDB.find({ Resource_Type : 'Ebook' })
            .then(resources => {
                res.send(resources);
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving resource information" });
            });
    }
};


// Update/Patch a Single Ebook Resource
exports.update_ebook = (req, res) => {
    if(!req.body)
    {
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
    
    const id = req.params.id;

    ResourceDB.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data)
            {
                res.status(404).send({ message : `Cannot Update Resource with ${id}. Maybe Resource not found!`})
            }
            else
            {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message : err.message || "Error in Updating Resource!"});
        });
};


// Delete a Ebook Resource
exports.delete_ebook = (req,res) => {
    if(!req.params.id)
    {
        return res
            .status(400)
            .send({ message : "Please Enter the Ebook ID to Delete!"});
    }
    else
    {
        const id = req.params.id;
        
        ResourceDB.findOneAndDelete(id)
            .then(data => {
                if(!data)
                {
                    res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
                }
                else
                {
                    res.send({ message : "Ebook Resource Deleted Successfully! " });
                }
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error in Deleting Resource!"});
            });
    }
};