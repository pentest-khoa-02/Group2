import settingService from "../services/settingService";
const getIndex = async (req, res) => {
  const settings = await settingService.getAllSetting();
  if(typeof (req.session) == "undefined") res.render("settings", { settings });
  else {
    const update = req.session.update;
    delete req.session.update;
    res.render("settings", { settings, update: update });
  }
};

const updateSetting = async (req, res) => {
  const obj = req.body;
  for(const key in obj){
    try{
      await settingService.updateSetting(key, obj[key])
    }
    catch(err){
      console.log(err)
    }
  }
  req.session.update = {message: "Updated successfully!"};
  res.redirect("/settings");
};

export default { getIndex, updateSetting };