const express = require('express');
const router =express.Router();
const Grupo = require('../models/grupo');
const Asignatura = require('../models/asignatura');

//get back all the grupos
router.get('/', async (req,res)=>{
    try{
        const grupos = await Grupo.find();
        res.json(grupos);
    } catch(err) {
        res.json({message:err});
    }
});

//add a grupo
router.post('/', async (req,res)=>{
    const grupo = new Grupo({
        Asignatura:req.body.Asignatura,
        Numero: req.body.Numero,
        Dias:req.body.Dias,
        Horario: req.body.Horario,
        Cupos: req.body.Cupos,
        Edificio: req.body.Edificio,
        Salon:req.body.Salon,
        IDProfesor: req.body.IDProfesor,
        IDEstudiantes:req.body.IDEstudiantes
    });    
    try{
        const savedGrupo = await grupo.save();
        res.json(savedGrupo);
    } catch(err) {
        res.json({message:err});
    }
});

router.get('/:grupoId', async (req,res)=>{
    try{
        const grupo = await Grupo.findById(req.params.grupoId);
        res.json(grupo);
    } catch(err) {
        res.json({message:err});
    }    
});

//buscar grupo por asignatura
router.get('/porasignatura/:AsignaturaId', async (req,res)=>{
    try{        
        const grupos = await Grupo.find({Asignatura:req.params.AsignaturaId});
        res.json(grupos);
    } catch(err) {
        res.json({message:err});
    }    
})

//remove a grupo
router.delete('/:grupoId', async (req,res)=>{
    try{
        const removedGrupo = await Grupo.remove({_id: req.params.grupoId});
        res.json(removedGrupo);
    } catch(err) {
        res.json({message:err});
    }    
});

//update a grupo
router.patch('/:grupoId', async (req,res)=>{
    try{
        const updatedGrupo = await Grupo.updateOne(
            {_id: req.params.grupoId},
            {$set:{
                Numero: req.body.Numero, 
                Dias:req.body.Dias,
                Horario: req.body.Horario,
                Cupos: req.body.Cupos,
                Edificio: req.body.Edificio,
                Salon:req.body.Salon,
                IDProfesor: req.body.IDProfesor,
                IDEstudiantes:req.body.IDEstudiantes
            }

            }            
        );
        res.json(updatedGrupo);
    } catch(err) {
        res.json({message:err});
    }    
});

router.post('/gruposInfo', async(req, res) => {
    groupList = req.body
    groupInfo = []
    try {
        for (const element of groupList){
            group = await Grupo.findById(element.GroupId)
            AsignaturaNombre = await Asignatura.findById(group.Asignatura.toString())
            group.Asignatura = AsignaturaNombre
            groupInfo.push(group)
        }
        res.json(groupInfo)
    } catch(err) {
        res.json({message:err})
    }
});

router.post('/scheduleByIds', async(req, res) => {
    groupList = req.body
    groupIdList = groupList.map((element) => { return element.GroupId })
    dayList = {"Lunes": [], "Martes": [], "Miercoles": [], "Jueves": [], "Viernes": []}
    scheduleArray = []
    try {
        for (const day of Object.keys(dayList)){
            group = await Grupo.find({_id: {"$in": groupIdList}, Dias: { "$in": [day]}})
            for (const g of group){
                AsignaturaNombre = await Asignatura.findById(g.Asignatura.toString())
                g.Asignatura = AsignaturaNombre
            }
            dayList[`${day}`] = group          
        }
        res.json(dayList)
    } catch(err){
        res.json({message:err})
    }

})

router.get('/grupoAsignatura/:grupoId', async (req,res)=>{
    try{
        const grupo = await Grupo.findById(req.params.grupoId);
        AsignaturaNombre = await Asignatura.findById(grupo.Asignatura.toString())
        grupo.Asignatura = AsignaturaNombre
        res.json(grupo);
    } catch(err) {
        res.json({message:err});
    }    
});

module.exports = router;